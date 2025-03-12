const Ingredient = require("../models/Ingredients");
const Recipe = require("../models/Recipes");

const updateIngredientsDatabase = async () => {
  try {
    const recipes = await Recipe.find();
    const ingredientNamesSet = new Set(); // Using Set to store unique names

    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (ingredient.name) {
          ingredientNamesSet.add(ingredient.name.trim().toLowerCase());
        }

        // Check for substitutes
        // if (Array.isArray(ingredient.substitute)) {
        //   ingredient.substitute.forEach((substitute) => {
        //     ingredientNamesSet.add(substitute.trim().toLowerCase());
        //   });
        // }
      });
    });

    const ingredientNames = [...ingredientNamesSet];

    // Fetch existing ingredients from DB
    const existingIngredients = await Ingredient.find({
      name: { $in: ingredientNames },
    });

    const existingNamesSet = new Set(
      existingIngredients.map((ing) => ing.name)
    );

    // Filter out ingredients that already exist
    const newIngredients = ingredientNames
      .filter((name) => !existingNamesSet.has(name))
      .map((name) => ({ name }));

    if (newIngredients.length > 0) {
      await Ingredient.insertMany(newIngredients);
      console.log("Ingredients database updated successfully!");
    } else {
      console.log("No new ingredients to add.");
    }
  } catch (error) {
    console.error("Error updating ingredient database:", error.message);
  }
};

const fetchAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    return res.status(200).json({
      status: 200,
      ingredients,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error fetching all ingredients",
    });
  }
};

module.exports = { updateIngredientsDatabase, fetchAllIngredients };
