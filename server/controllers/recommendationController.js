const { CohereClient } = require("cohere-ai");
const Recipe = require("../models/Recipes");
const cohere = new CohereClient({
  token: process.env.COHERE_TOKEN,
});

const generateRecipe = async (req, res) => {
  const { ingredients, cuisine, dietaryPreferences } = req.body;

  // Validate input
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({
      status: 400,
      message:
        "Invalid payload structure of ingredients. It should be an array",
    });
  }
  if (!Array.isArray(cuisine)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid payload structure of cuisine. It should be an array",
    });
  }
  if (!Array.isArray(dietaryPreferences)) {
    return res.status(400).json({
      status: 400,
      message:
        "Invalid payload structure of dietaryPreferences. It should be an array",
    });
  }

  console.log("Request body:", req.body);

  const query = {
    ingredients: {
      $all: ingredients.map((ingredient) => ({
        $elemMatch: {
          $or: [{ name: ingredient }, { substitute: { $in: [ingredient] } }],
        },
      })),
    },
  };

  if (cuisine.length > 0) {
    query.cuisineTypes = { $all: cuisine };
  }

  if (dietaryPreferences.length > 0) {
    query.dietaryPreferences = { $all: dietaryPreferences };
  }

  try {
    const recipesFromDB = await Recipe.find(query).limit(100);
    if (recipesFromDB.length > 0) {
      return res.status(200).json({
        status: 200,
        message: "Recipes found in the database.",
        data: recipesFromDB,
      });
    }

    console.log("No matching recipes found in the database.");
    return res.status(404).json({
      status: 404,
      message: "No recipes found matching the criteria.",
    });

    const prompt = `
      Generate a recipe with the following details:
      - Ingredients: ${ingredients.join(", ")}
      - Cuisine types: ${cuisine.join(", ")}
      - Dietary preferences: ${dietaryPreferences.join(", ")}
      Include fields: recipe name, ingredients, instructions, nutritional information (calories, protein, carbs, fat), and cooking time. Return the result in JSON format.
    `;

    const stream = await cohere.chatStream({
      model: "command-r-08-2024",
      message: prompt,
      temperature: 0.3,
      chatHistory: [
        {
          role: "User",
          message: prompt,
        },
      ],
      promptTruncation: "AUTO",
    });

    let responseText = "";
    for await (const chat of stream) {
      if (chat.eventType === "text-generation") {
        responseText += chat.text;
      }
    }
    console.log("Raw responseText:", responseText);
    const cleanRecipeDataString = responseText
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "");

    console.log("Cleaned recipe data string:", cleanRecipeDataString);

    const recipeData = JSON.parse(cleanRecipeDataString);

    console.log("Recipe Data:", recipeData);

    return res.status(200).json({
      status: 200,
      data: recipeData,
    });
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    return res.status(500).json({
      status: 500,
      message:
        "An error occurred while generating the recipe. Please try again.",
    });
  }
};

module.exports = { generateRecipe };
