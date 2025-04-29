const { strictDietaryRestrictions } = require("../constants/data");
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

  if (time === "morning") {
    timeTags = [
      "Breakfast",
      "Brunch",
      "Smoothie",
      "Porridge",
      "Beverage",
      "Quick",
      "Muffins",
      "Pancakes",
      "Waffles",
      "Omelette",
      "Eggs",
    ];
  } else if (time === "afternoon") {
    timeTags = [
      "Lunch",
      "Rice Bowls",
      "Salad",
      "Soups",
      "Stir-Fry",
      "Curry",
      "Pasta",
      "Noodles",
    ];
  } else if (time === "evening") {
    timeTags = [
      "Dinner",
      "Comfort Food",
      "Main Course",
      "Noodles",
      "Pasta",
      "Barbecue",
      "Soup",
      "Salad",
      "Stir-Fry",
      "Curry",
      "Stew",
    ];
  } else {
    timeTags = [
      "Snack",
      "Dessert",
      "No-Bake",
      "Drinks",
      "Pizza Night",
      "Appetizer",
      "Muffins",
    ];
  }
  // Lowercase dietary prefs
  //const lowerPrefs = dietaryPreference.map((p) => p.toLowerCase());

  const strictPrefs = dietaryPreference.filter((p) =>
    strictDietaryRestrictions.includes(p)
  );
  const optionalPrefs = dietaryPreference.filter(
    (p) => !strictDietaryRestrictions.includes(p)
  );

  const baseExpr = {
    $expr: {
      $gt: [
        {
          $size: {
            $setIntersection: [
              {
                $map: { input: "$tags", as: "tag", in: { $toLower: "$$tag" } },
              },
              timeTags.map((tag) => tag.toLowerCase()),
            ],
          },
        },
        0,
      ],
    },
  };

  let query;

  if (strictPrefs.length > 0) {
    const strictFilter = { dietaryPreferences: { $all: strictPrefs } };

    if (optionalPrefs.length > 0) {
      const optionalFilter = {
        dietaryPreferences: { $in: optionalPrefs },
      };

      query = {
        $and: [
          baseExpr,
          {
            $or: [
              { dietaryPreferences: { $all: strictPrefs } },
              {
                $and: [
                  { dietaryPreferences: { $all: strictPrefs } },
                  optionalFilter,
                ],
              },
            ],
          },
        ],
      };
    } else {
      query = {
        $and: [baseExpr, strictFilter],
      };
    }
  } else if (optionalPrefs.length > 0) {
    query = {
      $and: [baseExpr, { dietaryPreferences: { $in: optionalPrefs } }],
    };
  } else {
    query = baseExpr;
  }

  console.log("Final Query:", JSON.stringify(query, null, 2));
  const allMatchingTime = await Recipe.find(baseExpr);
  console.log("Recipes matching timeTags only:", allMatchingTime.length);

  const allMatchingStrict = await Recipe.find({
    dietaryPreferences: { $all: strictPrefs },
  });
  console.log("Recipes matching strict only:", allMatchingStrict.length);
  try {
    const recipes = await Recipe.find(query).limit(5);
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

module.exports = { getTimePeriod, getRecipesByTimeAndDietary };
