const Recipe = require("../models/Recipes");
const { CohereClient } = require("cohere-ai");
const User = require("../models/Users");
const RecipeGenerationLog = require("../logs/recipeGenerationLog");
const {
  getTimePeriod,
  getRecipesByTimeAndDietary,
} = require("../middlewares/timeBasedRecipe");
const {
  updateIngredientsDatabase,
} = require("../controllers/ingredientController");

const {
  updateCuisineAndDietaryDb,
} = require("../controllers/preferencesController");
const mongoose = require("mongoose");

const cohere = new CohereClient({
  token: process.env.COHERE_TOKEN,
});

const generateRecipesInBatch = async (req, res) => {
  console.log("Recipe Generation Log :", req.user);
  if (req.user?.role !== "admin") {
    return;
  }
  const { _id } = req.user;
  const { tags, cuisines, dietaryOptions, count } = req.body;

  try {
    const prompt = `
    Generate ${count} recipes under any of ${tags.join(
      ","
    )} using the following schema format. Include all required fields and ensure the content is properly structured. Return the result as an array of JSON objects.
  
    Any of these Cuisine types: ${cuisines.join(",")}.
    Any of these Dietary types: ${dietaryOptions.join(",")}.
  
    STRICT VALIDATION RULES:
    -If given cuisine type is all, analyze the origin of the recipe and label its cuisine, do not label it as All.
    - **Verify all ingredients align with dietary labels**:
      - Vegan recipes **CANNOT** contain any meat, dairy, eggs, honey, or animal-derived products.
      - Vegetarian recipes **CANNOT** contain meat, poultry, or fish.
      - Halal recipes **CANNOT** contain pork, alcohol, or non-halal meat.
      - Kosher recipes **MUST** only contain kosher-certified ingredients.
      - Gluten-free recipes **CANNOT** contain wheat, barley, or rye.
      - Nut-Free recipes **CANNOT** contain any type of nuts.
      - Soy-Free recipes **CANNOT** contain soybeans, soy sauce, tofu, miso, or any soy-derived products.
      - Strict dietary validation - **No mislabeling allowed**.
    
    - **Ingredient Substitutions:**
      - If an ingredient violates a dietary restriction, **replace it ONLY with a nutritionally and functionally similar alternative**.
      - Example:
        - **Miso paste (soy-based) → Chickpea miso**, NOT vegetable broth.
        - **Smoked sausage (pork) → Chicken sausage (for halal/kosher)**.
        - **Soy sauce → Coconut aminos (for soy-free)**.
      - If a compliant substitute is unavailable, **exclude the ingredient**.
  
    - **Recipe Quality:**
      - Provide a **precise and image-promptable** description for each recipe.
      - Ensure **detailed, step-by-step** cooking instructions.
    
    - **Nutritional Information: (for a single serving estimate)**
      - Macronutrients **must be stated in grams (g)** for calories, protein, carbs, and fat for a single serving value.
      - Estimation should be closely related to actual value. do not generate impossible and faulty values.
      - Only if macronutrient values cannot be estimated, use **"Varies"** . Do not use otherwise.
    
    - **Output Format:**
      - The response must be a structured JSON array.
  
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
      "tags": ["String"],
      "cookingInstructions": ["String"],
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

    await RecipeGenerationLog.create({
      userId: _id,
    });

    await updateIngredientsDatabase();

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
  const { ingredients, cuisines, dietaryPreferences } = req.body;
  const { _id } = req.user;

  // Validate input
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "You need to have at least one ingredient!",
    });
  }
  if (!Array.isArray(cuisines)) {
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
      // Strict match for cuisine
      cuisineTypes: { $all: cuisines }, // Ensures ALL selected cuisines are included

      // Dietary preferences should be flexible
      dietaryPreferences: { $in: dietaryPreferences },

      // Ingredients should be flexible but must be part of the list
      $or: [
        {
          "ingredients.name": { $in: ingredients }, // Ingredient matches directly
        },
        {
          "ingredients.substitute": { $in: ingredients }, // Match ingredient substitutes
        },
      ],
    };

    const recipesFromDB = await Recipe.find(query).limit(25);

    if (recipesFromDB.length > 0) {
      return res
        .status(200)
        .json({ status: 200, message: "Recipes found.", data: recipesFromDB });
    }

    console.log("No matching recipes found. Generating with AI...");

    // AI Recipe Generation
    const prompt = `
      Generate 4 complete and authentic recipes based on the given details.
      **Important Rules**:
     
      - If a value is unknown, generate a realistic value instead.
      - Use ingredients from the list, but not necessarily all. 
      - If no valid recipes can be generated, return: { "error": "Sorry, I couldn't find any recipe." }
      - If you are unsure about cuisine, just don't add

      **Input Details**:
      - Ingredients: ${ingredients.join(", ")}
      - Cuisine types: ${cuisines.join(", ")}
      - Dietary preferences: ${dietaryPreferences.join(", ")}

      **Expected JSON Schema**:
       - **ALL fields inside are mandatory.**. Do NOT leave any fields empty.
{
  "recipes": [
    {
      "name": "String",
      "shortDescription": "String",
      "ingredients": [{"name": "String", "quantity": "String", "substitute": ["String"]}],
      "cookingInstructions": ["String"],
      "cookingTime": "String",
      "cuisineTypes": ["String"], 
      "dietaryPreferences": ["String"],
      "tags": ["String"],
      "nutritionalInfo": {"calories": "String", "protein": "String", "carbs": "String", "fat": "String"}
    }
  ]
}
Return **ONLY JSON**, nothing else.
`;

    const stream = await cohere.chatStream({
      model: "command-r-08-2024",
      message: prompt,
      temperature: 0.3,
      chatHistory: [{ role: "User", message: prompt }],
      promptTruncation: "AUTO",
    });

    let responseText = "";
    try {
      for await (const chat of stream) {
        if (chat.eventType === "text-generation") {
          responseText += chat.text;
        }
      }
    } catch (error) {
      console.error("Error streaming AI response:", error.message);
      return res.status(500).json({
        status: 500,
        message: "Error retrieving AI response.",
      });
    }

    console.log("Raw AI Response:", responseText);

    const cleanRecipeDataString = responseText
      .replace(/^```json\n/, "") // Remove leading code block markers
      .replace(/\n```$/, "") // Remove trailing markers
      .trim(); // Remove extra spaces

    // Add a closing bracket if missing
    if (!cleanRecipeDataString.endsWith("}")) {
      cleanRecipeDataString += "}";
    }

    // Validate AI response
    let generatedRecipes;
    try {
      await RecipeGenerationLog.create({
        userId: _id,
      });
      generatedRecipes = JSON.parse(cleanRecipeDataString);

      if (
        !generatedRecipes ||
        !generatedRecipes.recipes ||
        !Array.isArray(generatedRecipes.recipes)
      ) {
        throw new Error("Invalid JSON structure from AI");
      }
    } catch (error) {
      console.error("Error parsing AI response:", error.message);
      console.error("Received AI response:", cleanRecipeDataString);
      return res.status(500).json({
        status: 500,
        message: "AI response is not valid JSON.",
      });
    }

    generatedRecipes.recipes = generatedRecipes.recipes.map((recipe) => ({
      name: recipe.name || "Unknown Recipe",
      shortDescription: recipe.shortDescription || "",
      ingredients: recipe.ingredients,

      cookingInstructions: recipe.cookingInstructions,
      cookingTime: recipe.cookingTime,
      cuisineTypes: recipe.cuisineTypes || [],
      dietaryPreferences: recipe.dietaryPreferences || [],
      tags: recipe.tags || [],
      nutritionalInfo: {
        calories: recipe.nutritionalInfo?.calories || "Unknown",
        protein: recipe.nutritionalInfo?.protein || "Unknown",
        carbs: recipe.nutritionalInfo?.carbs || "Unknown",
        fat: recipe.nutritionalInfo?.fat || "Unknown",
      },
    }));

    console.log("Generated Recipes:", generatedRecipes.recipes);

    // Save to DB
    const newlySavedRecipes = await Recipe.insertMany(generatedRecipes.recipes);
    await updateIngredientsDatabase();
    await updateCuisineAndDietaryDb();

    // Extract recipe IDs
    const recipeIds = newlySavedRecipes?.map((recipe) => recipe._id);

    // Update user's myRecipeGenerations field
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { myRecipeGenerations: { $each: recipeIds } },
    });

    return res.status(201).json({ status: 201, data: newlySavedRecipes });
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    return res.status(500).json({
      status: 500,
      message: `Error generating recipe, ${error.message}`,
    });
  }
};

const uploadRecipeThumbnail = async (req, res) => {
  const recipeId = req.params.id;
  try {
    if (!req.file) {
      return res.status(400).json({ status: 400, message: "No file uploaded" });
    }
    const imageUrl = req.file.path;
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $set: { thumbnail: imageUrl } },
      { new: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ status: 404, message: "Recipe not found" });
    }
    return res.status(200).json({ status: 200, data: updatedRecipe });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: `Error uploading recipe thumbnail, ${error.message}`,
    });
  }
};

const deleteRecipesInBatch = async (req, res) => {
  const recipeIds = req.body.recipeIds;
  try {
    if (!recipeIds || recipeIds.length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "No recipe IDs provided" });
    }

    await Recipe.deleteMany({ _id: { $in: recipeIds } });
    return res
      .status(200)
      .json({ status: 200, data: "Recipes deleted successfully" });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: `Error deleting recipes, ${error.message}`,
    });
  }
};

const deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ status: 404, message: "Recipe not found" });
    }
    await User.updateMany(
      {
        $or: [
          { savedRecipes: recipeId },
          { myRecipeGenerations: recipeId },
          { ratedRecipes: recipeId },
        ],
      },
      {
        $pull: {
          savedRecipes: recipeId,
          myRecipeGenerations: recipeId,
          ratedRecipes: recipeId,
        },
      }
    );
    await Recipe.findByIdAndDelete(recipeId);
    return res
      .status(200)
      .json({ status: 200, data: "Recipe deleted successfully", recipeId });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: `Error deleting recipe, ${error.message}`,
    });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
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

const filterRecipes = async (req, res) => {
  try {
    const {
      ingredients,
      cuisineTypes,
      dietaryPreferences,
      tags,
      cookingTime,
      page = 1,
      pageSize = 10,
    } = req.body;

    let filterCriteria = [];

    // Convert ingredients to array properly
    if (ingredients) {
      const ingredientsArray = Array.isArray(ingredients)
        ? ingredients
        : ingredients.split(",");
      filterCriteria.push({ ingredients: { $in: ingredientsArray } });
    }

    // Convert cuisine types to array and apply strict filtering
    if (cuisineTypes && cuisineTypes.length > 0) {
      const cuisineArray = Array.isArray(cuisineTypes)
        ? cuisineTypes
        : cuisineTypes.toString().split(",");

      // Apply case-insensitive regex filtering for each cuisine type
      const regexCuisines = cuisineArray.map((cuisine) => ({
        cuisineTypes: { $regex: new RegExp(`^${cuisine.trim()}$`, "i") },
      }));

      filterCriteria.push({ $or: regexCuisines });
    }

    // Convert dietary preferences to array
    if (dietaryPreferences && dietaryPreferences.length > 0) {
      const dietaryArray = Array.isArray(dietaryPreferences)
        ? dietaryPreferences
        : dietaryPreferences.toString().split(",");
      filterCriteria.push({ dietaryPreferences: { $in: dietaryArray } });
    }

    // Convert tags to array
    if (tags && tags.length > 0) {
      const tagArray = Array.isArray(tags) ? tags : tags.toString().split(",");
      filterCriteria.push({ tags: { $in: tagArray } });
    }

    // Filter by cooking time
    // Filter by cooking time
    if (cookingTime) {
      const operatorMap = {
        "<": "$lt",
        "<=": "$lte",
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
      };

      const match = cookingTime.match(/(<=|>=|<|>|=)?\s*(\d+)/);
      if (match) {
        const operator = match[1] || "=";
        const time = parseInt(match[2], 10);

        if (!isNaN(time)) {
          // Extract just the numeric part from the cookingTime string and convert to number for comparison
          filterCriteria.push({
            $expr: {
              [operatorMap[operator]]: [
                {
                  $toInt: {
                    $arrayElemAt: [
                      {
                        $split: [
                          {
                            $arrayElemAt: [
                              { $split: ["$cookingTime", ","] },
                              0,
                            ],
                          },
                          " ",
                        ],
                      },
                      0,
                    ],
                  },
                },
                time,
              ],
            },
          });
        }
      }
    }

    // Convert pagination values to numbers
    const pageNumber = parseInt(page, 10) || 1;
    const pageSizeNumber = parseInt(pageSize, 10) || 10;

    // Construct query properly
    const query = filterCriteria.length ? { $and: filterCriteria } : {};
    console.log("Filtered Query:", JSON.stringify(query, null, 2));

    // Fetch recipes
    const recipes = await Recipe.find(query)
      .skip((pageNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber);

    // Get total recipe count
    const totalRecipes = await Recipe.countDocuments(query);

    if (recipes.length === 0) {
      return res.status(200).json({
        message: "No recipes found for the given filter criteria",
      });
    }

    res.status(200).json({
      recipes,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecipes / pageSizeNumber),
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
      recipes: popularRecipes,
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
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (page - 1) * pageSize;

    // Get user preferences
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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
    const userId = req.user.userId;

    // Fetch user preferences and populate dietary and cuisine preferences
    const user = await User.findById(userId)
      .populate("dietaryRestrictions", "_id name") // Assuming dietaryRestrictions have "name" field
      .populate("cuisinePreferences", "_id name");

    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      dietaryRestrictions = [],
      cuisinePreferences = [],
      savedRecipes = [],
      ratedRecipes = [],
    } = user;

    // Extract IDs
    const dietaryIds = dietaryRestrictions.map((d) => d._id);
    const cuisineIds = cuisinePreferences.map((c) => c._id);

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Fetch recipes matching dietary restrictions (or all if none)
    let filteredRecipes = [];
    if (dietaryIds.length > 0 || cuisineIds.length > 0) {
      filteredRecipes = await Recipe.find({
        $or: [
          { dietaryPreferences: { $in: dietaryIds } },
          { cuisineTypes: { $in: cuisineIds } },
        ],
      });
    }

    // If no recipes match preferences, fetch all recipes
    if (!filteredRecipes || filteredRecipes.length === 0) {
      filteredRecipes = await Recipe.find({});
    }

    if (!filteredRecipes || filteredRecipes.length === 0) {
      return res.status(200).json({ message: "No recipes found" });
    }

    // Find user's preferred recipes (saved or rated ≥ 4)
    const preferredRecipes = filteredRecipes.filter(
      (recipe) =>
        savedRecipes.includes(recipe._id.toString()) ||
        ratedRecipes.some(
          (r) => r.recipeId === recipe._id.toString() && r.rating >= 4
        )
    );

    const recipePool =
      preferredRecipes.length > 0 ? preferredRecipes : filteredRecipes;

    if (recipePool.length === 0) {
      return res.status(200).json({ message: "No suitable recipe found" });
    }

    // Generate a deterministic index for today’s recipe
    const seed =
      parseInt(userId.substring(0, 8), 16) +
      parseInt(today.replace(/-/g, ""), 10);
    const recipeIndex = seed % recipePool.length;

    const selectedRecipe = recipePool[recipeIndex];

    res.status(200).json({
      status: 200,
      recipe: selectedRecipe,
    });
  } catch (error) {
    console.error("Error in getRecipeOfTheDay:", error);
    res.status(500).json({ error: error.message });
  }
};

const getTimeBasedRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user and populate dietary restrictions
    const user = await User.findById(userId).populate(
      "dietaryRestrictions",
      "_id name"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const dietaryIds = user.dietaryRestrictions.map((d) => d._id);

    const time = getTimePeriod();
    console.log("Time:", time);

    const recipes = await getRecipesByTimeAndDietary(time, dietaryIds);

    res.status(200).json({ time, recipes });
  } catch (error) {
    console.error("Error in getTimeBasedRecipe:", error);
    res.status(500).json({ message: "Error fetching recommended recipes" });
  }
};

const searchRecipe = async (req, res) => {
  try {
    const { query } = req.body;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const skip = (page - 1) * pageSize;

    const recipes = await Recipe.find({
      $or: [{ name: { $regex: query, $options: "i" } }],
    })
      .skip(skip)
      .limit(pageSize);

    const totalRecipes = await Recipe.countDocuments({
      $or: [{ name: { $regex: query, $options: "i" } }],
    });

    res.json({
      pagination: {
        totalRecipes,
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / pageSize),
      },
      recipes,
    });
  } catch (error) {
    console.error("Error searching recipes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const cleanUpOrphanedRecipes = async () => {
  try {
    // Step 1: Fetch all existing recipe IDs from the Recipe collection
    const allRecipeIds = await Recipe.find().select("_id");

    const existingRecipeIds = allRecipeIds.map(
      (recipe) => new mongoose.Types.ObjectId(recipe._id)
    );

    // Step 2: Update users by removing references to non-existing recipeIds from their arrays
    await User.updateMany(
      {
        $or: [
          { savedRecipes: { $nin: existingRecipeIds } },
          { myRecipeGenerations: { $nin: existingRecipeIds } },
          { ratedRecipes: { $nin: existingRecipeIds } },
        ],
      },
      {
        $pull: {
          savedRecipes: { $nin: existingRecipeIds },
          myRecipeGenerations: { $nin: existingRecipeIds },
          ratedRecipes: { $nin: existingRecipeIds },
        },
      }
    );

    console.log("Orphaned recipe IDs have been cleaned up.");
  } catch (error) {
    console.error("Error cleaning orphaned recipe IDs:", error.message);
  }
};

module.exports = {
  generateRecipesInBatch,
  trackRecipeViews,
  saveRecipe,
  rateRecipe,
  getAllRecipes,
  getRecipeById,
  filterRecipes,
  getPopularRecipes,
  getTrendingRecipes,
  getPersonalizedRecipes,
  getMostViewedRecipes,
  filterPersonalizedRecipe,
  generateRecipe,
  getRecipeOfTheDay,
  getTimeBasedRecipe,
  uploadRecipeThumbnail,
  deleteRecipesInBatch,
  deleteRecipe,
  searchRecipe,
  cleanUpOrphanedRecipes,
};
