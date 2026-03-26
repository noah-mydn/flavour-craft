const RecipeGenerationLog = require("../logs/recipeGenerationLog");
const Recipe = require("../models/Recipes");
const User = require("../models/Users");
const Comments = require("../models/community/Comments");
const Post = require("../models/community/Posts");
const Cuisine = require("../models/DietaryOptions").Cuisine;
const DietaryOption = require("../models/DietaryOptions").DietaryOption;

const getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const recipes = await Recipe.countDocuments();
    const cuisines = await Cuisine.countDocuments();
    const dieatryOptions = await DietaryOption.countDocuments();
    res.status(200).json({
      status: 200,
      stats: {
        users,
        recipes,
        cuisines,
        dieatryOptions,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getRecipeGenerationTrends = async (req, res) => {
  try {
    let { period } = req.query; // Use req.query instead of req.params
    console.log("Requested period:", period);

    if (!period) {
      return res
        .status(400)
        .json({ status: 400, message: "Missing period parameter" });
    }

    let startDate, endDate, dateGroupFormat;
    const now = new Date();

    if (period === "last7") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 6); // 7-day range including today
      endDate = now;
      dateGroupFormat = {
        day: { $dayOfMonth: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    } else if (period.startsWith("monthly-")) {
      const monthName = period.split("-")[1];
      if (!monthName) {
        return res
          .status(400)
          .json({ status: 400, message: "Invalid month format" });
      }

      const monthIndex =
        new Date(Date.parse(monthName + " 1, 2023")).getMonth() + 1;
      startDate = new Date(now.getFullYear(), monthIndex - 1, 1);
      endDate = new Date(now.getFullYear(), monthIndex, 0, 23, 59, 59, 999);

      dateGroupFormat = { day: { $dayOfMonth: "$createdAt" } };
    } else if (period === "this-year") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      dateGroupFormat = { month: { $month: "$createdAt" } };
    } else {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid period format" });
    }

    // Aggregate actual data from MongoDB
    const trends = await Recipe.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1, "_id.day": 1 } },
    ]);

    if (period === "this-year") {
      // Return monthly totals only
      const filledTrends = [];
      for (let month = 1; month <= 12; month++) {
        const monthName = new Date(2023, month - 1, 1).toLocaleString("en-US", {
          month: "short",
        });
        const count = trends.find((t) => t._id.month === month)?.count || 0;
        filledTrends.push({ month: monthName, count });
      }
      return res.status(200).json({ status: 200, trends: filledTrends });
    }

    // Create a map of existing data for easy lookup
    const trendMap = new Map();
    trends.forEach(({ _id, count }) => {
      const key = `${_id.month}-${_id.day}`;
      trendMap.set(key, count);
    });

    // Generate the full date range and fill missing ones with count: 0
    const filledTrends = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const month = currentDate.getMonth() + 1; // JS months are 0-based
      const day = currentDate.getDate();
      const key = `${month}-${day}`;

      filledTrends.push({
        date: `${currentDate.toLocaleString("en-US", {
          month: "short",
        })} ${day}`, // e.g., "Mar 28"
        count: trendMap.get(key) || 0,
      });

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.status(200).json({ status: 200, trends: filledTrends });
  } catch (error) {
    console.error("Error fetching recipe generation trends:", error.message);
    return res.status(500).json({
      status: 500,
      message: "Error fetching trends",
    });
  }
};

const getEngagementTrends = async (req, res) => {
  try {
    // Get the last 7 days including today
    const start = new Date();
    start.setDate(start.getDate() - 6); // 6 days back so today is included

    const end = new Date(); // Today

    // Aggregating Posts per Day
    const postData = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalPosts: { $sum: 1 },
        },
      },
    ]);

    // Aggregating Comments per Day
    const commentData = await Comments.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalComments: { $sum: 1 },
        },
      },
    ]);

    // Convert postData and commentData into Maps for easy merging
    const postMap = new Map(
      postData.map((item) => [
        `${item._id.year}-${item._id.month}-${item._id.day}`,
        item,
      ])
    );

    const commentMap = new Map(
      commentData.map((item) => [
        `${item._id.year}-${item._id.month}-${item._id.day}`,
        item,
      ])
    );

    // Generate the last 7 days with default values
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const key = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;

      result.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }), // "Mar 6"
        totalPosts: postMap.get(key)?.totalPosts || 0,
        totalComments: commentMap.get(key)?.totalComments || 0,
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCuisineDistribution = async (req, res) => {
  try {
    // Get total recipe count for percentage calculation
    const totalRecipes = await Recipe.countDocuments();

    // Aggregate the recipes by cuisine type
    const cuisineData = await Recipe.aggregate([
      { $unwind: "$cuisineTypes" },
      { $group: { _id: "$cuisineTypes", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }, // Top 10 cuisines
      {
        $project: {
          _id: 1,
          count: 1,
          percentage: {
            $multiply: [{ $divide: ["$count", totalRecipes] }, 100],
          },
        },
      },
    ]);

    // Aggregate the rest into "Others"
    const otherCuisines = await Recipe.aggregate([
      { $unwind: "$cuisineTypes" },
      { $group: { _id: "$cuisineTypes", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $skip: 10 },
      {
        $group: {
          _id: "Others",
          count: { $sum: "$count" },
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          percentage: {
            $multiply: [{ $divide: ["$count", totalRecipes] }, 100],
          },
        },
      },
    ]);

    const finalData = [...cuisineData, ...otherCuisines];

    res.json({ success: true, data: finalData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const recipes = await Recipe.countDocuments();
    const cuisines = await Cuisine.countDocuments();
    const dietaryOptions = await DietaryOption.countDocuments();

    // Cuisine distribution
    const totalRecipes = await Recipe.countDocuments();
    const cuisineData = await Recipe.aggregate([
      { $unwind: "$cuisineTypes" },
      { $group: { _id: "$cuisineTypes", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }, // Limit to the top 5 cuisines
      {
        $project: {
          _id: 1,
          count: 1,
          percentage: {
            $multiply: [{ $divide: ["$count", totalRecipes] }, 100],
          },
        },
      },
    ]);

    // Optional: If you want to include an "Others" category for cuisines outside the top 5
    const otherCuisines = await Recipe.aggregate([
      { $unwind: "$cuisineTypes" },
      { $group: { _id: "$cuisineTypes", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $skip: 5 }, // Skip the top 5 cuisines
      { $group: { _id: "Others", count: { $sum: "$count" } } },
      {
        $project: {
          _id: 1,
          count: 1,
          percentage: {
            $multiply: [{ $divide: ["$count", totalRecipes] }, 100],
          },
        },
      },
    ]);

    const cuisineDistribution = [...cuisineData, ...otherCuisines];

    // Response
    res.status(200).json({
      status: 200,
      stats: {
        users,
        recipes,
        cuisines,
        dietaryOptions,
        cuisineDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error.message);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};

module.exports = {
  getDashboardStats,
  getRecipeGenerationTrends,
  getStats,
  getEngagementTrends,
  getCuisineDistribution,
};
