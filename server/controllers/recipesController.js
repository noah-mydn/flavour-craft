const Recipe = require("../models/Recipes");
const { CohereClient } = require("cohere-ai");
const User = require("../models/Users");
const {
  getTimePeriod,
  getRecipesByTimeAndDietary,
} = require("../middlewares/timeBasedRecipe");

const cohere = new CohereClient({
  token: process.env.COHERE_TOKEN,
});

const generateRecipesInBatch = async (req, res) => {
  try {
    const prompt = `
      Generate 2 breakfast and brunch recipes using the following schema format. Include all required fields and ensure the content is properly structured. Return the result as an array of JSON objects.
      Cuisine types include:  Japanese.
      Any of these Dietary types: Shellfish-Free, Diabetes-Friendly, Low-Sodium, Kidney-Friendly, Vegan,
      tag include breakfast, brunch, drinks, baking, etc more,
      description should be image promptable precise description, instructions should be detailed and step-by-step
      Schema:
      {
        "name": "String (Recipe name)",
        "ingredients": [
          {
            "name": "String (Ingredient name)",
            "quantity": "String",
            "substitute": ["String"]
          }
        ],
        "shortDescription": "String", 
        "dietaryPreferences": ["String"],
        "cuisineTypes": ["String"],
        "tags": ["String"] 
        "cookingInstructions": ["String"] ,
        "nutritionalInfo": {
          "calories": "String",
          "protein": "String",
          "carbs": "String",
          "fat": "String"
        },
        "cookingTime": "String"
      }
    `;

    // Call Cohere API for recipe generation
    const stream = await cohere.chatStream({
      model: "command-r-08-2024",
      message: prompt,
      temperature: 0.3,
    });

    let responseText = "";
    for await (const chat of stream) {
      if (chat.eventType === "text-generation") {
        responseText += chat.text;
      }
    }

    console.log(responseText);
    // Clean and parse AI response
    const cleanRecipeDataString = responseText
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "");

    const recipes = JSON.parse(cleanRecipeDataString);
    console.log("Generated Recipes:", recipes);

    // Filter out duplicate recipes based on the name
    const existingRecipeNames = await Recipe.find({}, "name").then((docs) =>
      docs.map((doc) => doc.name)
    );

    const uniqueRecipes = recipes.filter(
      (recipe) => !existingRecipeNames.includes(recipe.name)
    );

    // Save unique recipes to MongoDB
    await Recipe.insertMany(uniqueRecipes);
    console.log("Recipes successfully saved to the database.");

    return res.status(200).json({
      status: 200,
      message: `${uniqueRecipes.length} new recipes saved to the database.`,
      data: uniqueRecipes,
    });
  } catch (error) {
    console.error("Error generating or saving recipes:", error.message);
    return res.status(500).json({
      status: 500,
      message:
        "An error occurred while generating or saving the recipes. Please try again.",
    });
  }
};
const generateRecipe = async (req, res) => {
  const { ingredients, cuisine, dietaryPreferences } = req.body;

  // Validate input
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res
      .status(400)
      .json({ status: 400, message: "Ingredients must be an array" });
  }
  if (!Array.isArray(cuisine)) {
    return res
      .status(400)
      .json({ status: 400, message: "Cuisine must be an array" });
  }
  if (!Array.isArray(dietaryPreferences)) {
    return res
      .status(400)
      .json({ status: 400, message: "Dietary preferences must be an array" });
  }

  try {
    // Check DB first
    const query = {
      ingredients: {
        $all: ingredients.map((ingredient) => ({
          $elemMatch: {
            $or: [{ name: ingredient }, { substitute: { $in: [ingredient] } }],
          },
        })),
      },
    };

    if (cuisine.length > 0) query.cuisineTypes = { $all: cuisine };
    if (dietaryPreferences.length > 0)
      query.dietaryPreferences = { $all: dietaryPreferences };

    const recipesFromDB = await Recipe.find(query).limit(100);
    if (recipesFromDB.length > 0) {
      return res
        .status(200)
        .json({ status: 200, message: "Recipes found.", data: recipesFromDB });
    }

    console.log("No matching recipes found. Generating with AI...");

    // AI Recipe Generation
    const prompt = `
      Generate 10 authentic recipes with these details, if you cannot find authentic/valid recipes with these ingredients, return a meaningful message:
      - Ingredients: ${ingredients.join(", ")}
      - Cuisine types: ${cuisine.join(", ")}
      - Dietary preferences: ${dietaryPreferences.join(", ")}
      Include: recipe name, ingredients, instructions, nutrition info (calories, protein, carbs, fat), cooking time. Return JSON.
    `;

    const stream = await cohere.chatStream({
      model: "command-r-08-2024",
      message: prompt,
      temperature: 0.3,
      chatHistory: [{ role: "User", message: prompt }],
      promptTruncation: "AUTO",
    });

    let responseText = "";
    for await (const chat of stream) {
      if (chat.eventType === "text-generation") {
        responseText += chat.text;
      }
    }

    const cleanRecipeDataString = responseText
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "");
    const generatedRecipes = JSON.parse(cleanRecipeDataString);

    console.log("Generated Recipes:", generatedRecipes);

    // Save to DB
    await Recipe.insertMany(generatedRecipes);

    return res.status(201).json({ status: 201, data: generatedRecipes });
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Error generating recipe." });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const { page, pageSize } = req.body;
    const skip = (page - 1) * pageSize;

    const recipes = await Recipe.find()

      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(pageSize));

    // Get the total number of recipes for pagination info
    const totalRecipes = await Recipe.countDocuments();

    res.status(200).json({
      status: 200,
      message: "Recipes retrieved successfully",
      recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / pageSize),
        totalRecipes,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        status: 404,
        message: "Recipe not found",
      });
    }
    await trackRecipeViews(req, res);
    res.status(200).json({
      status: 200,
      recipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchRecipes = async (req, res) => {
  try {
    const { query, page = 1, pageSize = 10 } = req.query; // Add page and pageSize from the query params
    const skip = (page - 1) * pageSize;

    const recipes = await Recipe.find({
      $text: { $search: query },
    })
      .skip(skip) // Skip results based on page
      .limit(parseInt(pageSize)); // Limit the number of recipes per page

    // Get the total number of matching recipes for pagination info
    const totalRecipes = await Recipe.countDocuments({
      $text: { $search: query },
    });

    if (recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No recipes found for the given keyword" });
    }

    res.status(200).json({
      status: 200,
      recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / pageSize),
        totalRecipes,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const filterRecipes = async (req, res) => {
  try {
    const {
      ingredients,
      cuisineTypes,
      dietaryPreferences,
      tags,
      cookingTime,
      filterType = "AND",
      page = 1,
      pageSize = 10,
    } = req.body;

    let filterCriteria = [];

    // Filter by ingredients (check if ingredients are in recipe ingredients)
    if (ingredients) {
      const ingredientCriteria = {
        "ingredients.name": { $in: ingredients.split(",") },
      };
      filterCriteria.push(ingredientCriteria);
    }

    // Filter by cuisine types
    if (cuisineTypes) {
      const cuisineCriteria = {
        cuisineTypes: { $in: cuisineTypes.split(",") },
      };
      filterCriteria.push(cuisineCriteria);
    }

    // Filter by dietary preferences
    if (dietaryPreferences) {
      const dietaryCriteria = {
        dietaryPreferences: { $in: dietaryPreferences.split(",") },
      };
      filterCriteria.push(dietaryCriteria);
    }

    // Filter by tags
    if (tags) {
      const tagCriteria = {
        tags: { $in: tags.split(",") },
      };
      filterCriteria.push(tagCriteria);
    }

    // Filter by cooking time (greater than or equal to a certain time)
    if (cookingTime) {
      const time = parseInt(cookingTime);
      const timeCriteria = {
        cookingTime: { $lte: time },
      };
      filterCriteria.push(timeCriteria);
    }

    // Apply 'AND' or 'OR' logic
    let recipes;
    if (filterType === "OR" && filterCriteria.length > 0) {
      recipes = await Recipe.find({ $or: filterCriteria })
        .skip((page - 1) * pageSize) // Skip the results based on the current page
        .limit(pageSize); // Limit the number of results per page
    } else {
      recipes = await Recipe.find({ $and: filterCriteria })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
    }

    // Get the total number of recipes for pagination info
    const totalRecipes = await Recipe.countDocuments({ $and: filterCriteria });

    if (recipes.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No recipes found for the given filter criteria",
      });
    }

    res.status(200).json({
      recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / pageSize),
        totalRecipes,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const trackRecipeViews = async (req, res) => {
  try {
    const recipeId = req.params.id;
    await Recipe.findByIdAndUpdate(recipeId, {
      $inc: { views: 1 },
    });
  } catch (error) {
    console.error("Error updating views:", error);
  }
};

const saveRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const index = user.savedRecipes.indexOf(recipeId);

    if (index === -1) {
      // Save the recipe and increment the 'saves' count
      user.savedRecipes.push(recipeId);
      await Recipe.findOneAndUpdate(
        { _id: recipeId },
        { $inc: { saves: 1 } }, // Increment saves by 1
        { new: true }
      );
      await user.save();
      return res.status(200).json({
        status: 200,
        message: "Recipe saved successfully",
      });
    } else {
      // Unsaving the recipe, but check to prevent saves from going negative
      user.savedRecipes.splice(index, 1);
      if (recipe.saves > 0) {
        // Only decrement if saves is greater than 0
        await Recipe.findOneAndUpdate(
          { _id: recipeId },
          { $inc: { saves: -1 } }, // Decrement saves by 1
          { new: true }
        );
      }
      await user.save();
      return res.status(200).json({
        status: 200,
        message: "Recipe unsaved successfully",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const rateRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Invalid rating. Must be between 1-5." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Check if user has already rated this recipe
    const existingRating = user.ratedRecipes.find(
      (r) => r.recipeId.toString() === recipeId
    );
    if (existingRating) {
      // Update existing rating
      const oldRating = existingRating.rating;
      existingRating.rating = rating;

      // Adjust recipe rating average
      const newAverage =
        (recipe.ratings.average * recipe.ratings.count - oldRating + rating) /
        recipe.ratings.count;
      await Recipe.findByIdAndUpdate(recipeId, {
        $set: { "ratings.average": newAverage },
      });
    } else {
      // New rating
      user.ratedRecipes.push({ recipeId, rating });
      recipe.ratings.count += 1;
      recipe.ratings.average =
        (recipe.ratings.average * (recipe.ratings.count - 1) + rating) /
        recipe.ratings.count;
      await recipe.save();
    }

    await user.save();
    return res.status(200).json({
      status: 200,
      message: "Recipe rated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPopularRecipes = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (page - 1) * pageSize;

    const popularRecipes = await Recipe.aggregate([
      {
        $addFields: {
          popularityScore: {
            $add: [
              { $multiply: ["$saves", 0.5] }, // Saves carry the most weight
              { $multiply: ["$views", 0.3] }, // Views have medium influence
              { $multiply: ["$ratings.average", 0.2] }, // Consider average rating
            ],
          },
        },
      },
      { $sort: { popularityScore: -1 } }, // Sort by popularity
      { $skip: skip }, // Skip previous pages
      { $limit: parseInt(pageSize) }, // Limit results per page
    ]);

    const totalRecipes = await Recipe.countDocuments();

    res.status(200).json({
      status: 200,
      popularRecipes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecipes / pageSize),
        totalRecipes,
      },
    });
  } catch (error) {
    console.error("Error fetching popular recipes:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTrendingRecipes = async (req, res) => {
  try {
    // Fetch the 10 recipes with the highest trendingScore, sorted in descending order
    const recipes = await Recipe.find({})
      .sort({ trendingScore: -1 }) // Sort by trendingScore in descending order
      .limit(10); // Limit the number of recipes to 10

    // Log the number of recipes fetched for debugging
    console.log(`Found ${recipes.length} recipes for trending.`);

    // If no recipes are found, log a message
    if (!recipes.length) {
      console.log("No trending recipes found.");
    }

    // Return the results without pagination
    res.status(200).json({
      status: 200,
      recipes,
      totalRecipes: recipes.length, // Total recipes count based on the 10 fetched
    });
  } catch (error) {
    console.error("Error while fetching trending recipes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPersonalizedRecipes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, pageSize = 10 } = req.query; // Add page and pageSize from the query params
    const skip = (page - 1) * pageSize;

    // Get user preferences
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare filter criteria based on user preferences
    let filterCriteria = {};

    // Filter by dietary preferences
    if (user.dietaryRestrictions.length > 0) {
      filterCriteria.dietaryPreferences = { $in: user.dietaryRestrictions };
    }

    // Filter by cuisine preferences
    if (user.cuisinePreferences.length > 0) {
      filterCriteria.cuisineTypes = { $in: user.cuisinePreferences };
    }

    // Get personalized recipes based on both dietary and cuisine preferences
    let recipes = await Recipe.find(filterCriteria)
      .skip(skip) // Skip results based on page
      .limit(10); // Limit the number of recipes per page

    // Get the total number of matching personalized recipes for pagination info
    const totalRecipes = recipes.length;

    // If no recipes are found, show similar recipes from saved ones
    if (recipes.length === 0 && user.savedRecipes.length > 0) {
      const savedRecipes = await Recipe.find({
        _id: { $in: user.savedRecipes },
      })
        .skip(skip)
        .limit(parseInt(pageSize)); // Limit saved recipes as well

      return res.status(200).json({
        status: 200,
        recipes: savedRecipes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(savedRecipes?.length / pageSize),
          totalRecipes,
        },
      });
    }

    // If no saved recipes, show random recipes
    if (recipes.length === 0) {
      const randomRecipes = await Recipe.aggregate([{ $sample: { size: 10 } }]);
      return res.status(200).json({ recipes: randomRecipes });
    }

    return res.status(200).json({
      recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / pageSize),
        totalRecipes,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const filterPersonalizedRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      excludeDietary,
      excludeCuisine,
      page = 1,
      pageSize = 10,
    } = req.body; // Retrieve pagination details from req.body
    const skip = (page - 1) * pageSize;

    // Validate that only one filter (dietary or cuisine) is being excluded
    if (excludeDietary && excludeCuisine) {
      return res
        .status(400)
        .json({ message: "You can only exclude one preference at a time." });
    }

    // Get user preferences
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare filter criteria based on user preferences
    let filterCriteria = {};

    // Filter by dietary preferences (excluding specific dietary if required)
    if (user.dietaryRestrictions.length > 0 && !excludeDietary) {
      filterCriteria.dietaryPreferences = { $in: user.dietaryRestrictions };
    }

    if (excludeDietary && user.dietaryRestrictions.length > 0) {
      filterCriteria.dietaryPreferences = {
        $nin: [excludeDietary],
      };
    }

    // Filter by cuisine preferences (excluding specific cuisine if required)
    if (user.cuisinePreferences.length > 0 && !excludeCuisine) {
      filterCriteria.cuisineTypes = { $in: user.cuisinePreferences };
    }

    if (excludeCuisine && user.cuisinePreferences.length > 0) {
      filterCriteria.cuisineTypes = {
        $nin: [excludeCuisine],
      };
    }

    // Get filtered recipes with pagination
    let recipes = await Recipe.find(filterCriteria)
      .skip(skip) // Skip based on page
      .limit(parseInt(pageSize)); // Limit the number of recipes per page

    // Get the total number of matching recipes for pagination info
    const totalRecipes = await Recipe.countDocuments(filterCriteria);

    // If no recipes are found, show similar recipes from saved ones
    if (recipes.length === 0 && user.savedRecipes.length > 0) {
      const savedRecipes = await Recipe.find({
        _id: { $in: user.savedRecipes },
      })
        .skip(skip) // Apply pagination to saved recipes
        .limit(parseInt(pageSize)); // Limit saved recipes

      return res.status(200).json({
        recipes: savedRecipes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalRecipes / pageSize),
          totalRecipes,
        },
      });
    }

    // If no saved recipes, show random recipes
    if (recipes.length === 0) {
      const randomRecipes = await Recipe.aggregate([{ $sample: { size: 10 } }]);
      return res.status(200).json({ recipes: randomRecipes });
    }

    return res.status(200).json({
      recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / pageSize),
        totalRecipes,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMostViewedRecipes = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.body;
    const skip = (page - 1) * pageSize;

    // Fetch the most viewed recipes, sorted by views in descending order
    const recipes = await Recipe.find()
      .sort({ views: -1 }) // Sort by views in descending order
      .skip(skip)
      .limit(parseInt(pageSize));

    // Get the total number of recipes for pagination info
    const totalRecipes = await Recipe.countDocuments();

    return res.status(200).json({
      recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / pageSize),
        totalRecipes,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getRecipeOfTheDay = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user preferences (e.g., dietary restrictions, liked cuisines)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { dietaryPreferences, savedRecipes, ratedRecipes } = user;

    // Step 1: Get all recipes matching dietary preferences
    let filteredRecipes = await Recipe.find({
      dietaryPreferences: { $in: dietaryPreferences },
    });

    // Step 2: Prioritize saved and highly rated recipes
    let preferredRecipes = filteredRecipes.filter(
      (recipe) =>
        savedRecipes.includes(recipe._id) || ratedRecipes[recipe._id] >= 4
    );

    let selectedRecipe;

    if (preferredRecipes.length > 0) {
      // Step 3: Randomly pick from preferred recipes
      selectedRecipe =
        preferredRecipes[Math.floor(Math.random() * preferredRecipes.length)];
    } else if (filteredRecipes.length > 0) {
      // Step 4: If no preferred recipes, randomly pick from all filtered recipes
      selectedRecipe =
        filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
    } else {
      return res.status(404).json({ message: "No matching recipes found" });
    }

    // Store the selected recipe as today's recipe (optional: use Redis or cache)
    await User.findByIdAndUpdate(userId, {
      lastRecipeOfTheDay: selectedRecipe._id,
    });

    res.status(200).json({
      status: 200,
      recipe: selectedRecipe,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe of the day" });
  }
};

const getTimeBasedRecipe = async (req, res) => {
  const { dietaryPreferences } = req.body || [];
  const time = getTimePeriod();

  console.log("Time:", time);

  try {
    const recipes = await getRecipesByTimeAndDietary(time, dietaryPreferences);
    res.status(200).json({ time, recipes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommended recipes" });
  }
};

module.exports = {
  generateRecipesInBatch,
  trackRecipeViews,
  saveRecipe,
  rateRecipe,
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  filterRecipes,
  getPopularRecipes,
  getTrendingRecipes,
  getPersonalizedRecipes,
  getMostViewedRecipes,
  filterPersonalizedRecipe,
  generateRecipe,
  getRecipeOfTheDay,
  getTimeBasedRecipe,
};
