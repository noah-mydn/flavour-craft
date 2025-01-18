const Recipe = require("../models/Recipes");
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_TOKEN,
});

// Function to generate and save recipes in batch
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

module.exports = { generateRecipesInBatch };
