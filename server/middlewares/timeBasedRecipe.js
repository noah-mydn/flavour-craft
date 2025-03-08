const Recipe = require("../models/Recipes");

const getTimePeriod = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

const getRecipesByTimeAndDietary = async (time, dietaryPreference) => {
  let timeTags = [];

  // Define time-based tags
  if (time === "morning") {
    timeTags = ["Breakfast", "Brunch", "Smoothie", "Porridge", "Beverage"];
  } else if (time === "afternoon") {
    timeTags = ["Lunch", "Rice Bowls", "Salad", "Soups", "Stir-Fry"];
  } else if (time === "evening") {
    timeTags = [
      "Dinner",
      "Comfort Food",
      "Main Course",
      "Noodles",
      "Pasta",
      "Barbecue",
    ];
  } else {
    timeTags = [
      "Snack",
      "Dessert",
      "No-Bake",
      "Drinks",
      "Pizza Night",
      "Appetizer",
    ];
  }

  try {
    const query = {
      tags: { $in: timeTags }, // Filter recipes with matching time tags
    };

    console.log("First QUERY:", query);

    if (dietaryPreference && dietaryPreference.length > 0) {
      query.dietaryPreferences = { $in: dietaryPreference };
    }

    console.log("Final QUERY:", query);

    const recipes = await Recipe.find(query).limit(5);
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

module.exports = { getTimePeriod, getRecipesByTimeAndDietary };
