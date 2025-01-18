const Ingredient = require("../models/Ingredients");
const Recipe = require("../models/Recipes");

const updateIngredientsDatabase = async () => {
  try {
    const recipes = await Recipe.find();
    let ingredientNames = [];

    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (ingredient.name && !ingredientNames.includes(ingredient.name)) {
          ingredientNames.push(ingredient.name);
        }

        ingredient.substitute.forEach((substitute) => {
          if (!ingredientNames.includes(substitute)) {
            ingredientNames.push(substitute);
          }
        });
      });
    });

    const uniqueIngredients = ingredientNames.map((name) => ({
      name: name.trim().toLowerCase(),
    }));

    for (const ingredient of uniqueIngredients) {
      const existingIngredient = await Ingredient.findOne({
        name: ingredient.name,
      });
      if (!existingIngredient) {
        await Ingredient.create(ingredient);
      }
    }

    console.log("Ingredients database updated successfully!");
  } catch (error) {
    console.error("Error updating ingredient database:", error.message);
  }
};
module.exports = { updateIngredientsDatabase };
