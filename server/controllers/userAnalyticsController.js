const User = require("../models/Users");
const UserAnalytics = require("../models/UserAnalytics");
const Notification = require("../models/community/Notification");
const Post = require("../models/community/Posts");
const Comment = require("../models/community/Comments");
const mongoose = require("mongoose");

exports.issueWarning = async (req, res) => {
  const { userId } = req.params;
  const restrictionPeriod = 14; // days

  // 1) Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ status: 400, message: "Invalid userId" });
  }

  // 2) Compute the date 2 weeks from now
  const restrictionUntil = new Date();
  restrictionUntil.setDate(restrictionUntil.getDate() + restrictionPeriod);

  try {
    // 3) Restrict the user
    const user = await User.findByIdAndUpdate(
      userId,
      { isRestricted: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    // 4) Upsert analytics record
    await UserAnalytics.findOneAndUpdate(
      { userId },
      {
        status: "Restricted",
        restrictedUntil: restrictionUntil, // <— use the correct variable name
        lastActiveAt: new Date(),
      },
      { upsert: true }
    );

    // 5) Create a notification
    const notificationMessage = `Hello ${user.firstName}, your account has been temporarily restricted for 2 weeks due to a violation of community guidelines.`;

    await new Notification({
      recipient: userId,
      author: { firstName: "Admin" },
      message: notificationMessage,
      link: `/profile`,
      isRead: false,
    }).save();

    return res.status(200).json({
      status: 200,
      message: "User has been warned and restricted for 2 weeks.",
    });
  } catch (error) {
    console.error("Error issuing warning:", error);
    return res.status(500).json({
      status: 500,
      message: "Error issuing warning: " + error.message,
    });
  }
};

exports.viewUserAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 1) Load all analytics
    const analyticsList = await UserAnalytics.find().lean();
    const userIds = analyticsList.map((a) => a.userId);

    // 2) Load users *including* their myRecipeGenerations array
    const users = await User.find(
      { _id: { $in: userIds } },
      "firstName lastName userImg email myRecipeGenerations"
    )
      .lean()
      .exec();

    // 3) Build lookup map
    const userMap = users.reduce((map, u) => {
      map[u._id.toString()] = u;
      return map;
    }, {});

    // 4) Merge and compute the count from the user doc
    const result = analyticsList.map((a) => {
      const u = userMap[a.userId.toString()] || {};
      return {
        userId: a.userId,
        generatedRecipeCount: Array.isArray(u.myRecipeGenerations)
          ? u.myRecipeGenerations.length
          : 0,
        firstName: u.firstName,
        lastName: u.lastName,
        userImg: u.userImg,
        email: u.email,
        lastActiveAt: a.lastActiveAt,
        status: a.status,
      };
    });

    console.log("RESULT", result);
    return res.status(200).json({ status: 200, users: result });
  } catch (err) {
    console.error("Error fetching user analytics:", err);
    return res.status(500).json({
      status: 500,
      message: "Failed to retrieve user analytics",
      error: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ status: 400, message: "Invalid userId" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    await UserAnalytics.deleteMany({ userId });
    await Post.deleteMany({ author: userId });
    await Comment.deleteMany({ author: userId });
    await Notification.deleteMany({ recipient: userId });

    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ status: 200, message: "User profile and related data deleted." });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      status: 500,
      message: "Error deleting user",
      error: error.message,
    });
  }
};
