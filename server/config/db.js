const mongoose = require("mongoose");
const {
  updateIngredientsDatabase,
} = require("../controllers/ingredientController");
const {
  updateCuisineAndDietaryDb,
} = require("../controllers/preferencesController");
const { Cuisine, DietaryOption } = require("../models/DietaryOptions");
const Recipe = require("../models/Recipes");
const Users = require("../models/Users");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB connected");
      updateIngredientsDatabase();
      updateCuisineAndDietaryDb();
    });

    Recipe.find({}).then((recipes) => {
      recipes.forEach((recipe) => {
        // Example formula for trending score: views * 0.5 + saves * 1.5 + average ratings * 2
        const trendingScore =
          recipe.views * 0.5 + recipe.saves * 1.5 + recipe.ratings.average * 2;

        // Update the recipe with the new trendingScore
        recipe.trendingScore = trendingScore;

        // Save the updated recipe
        recipe.save().catch((err) => {
          console.error(`Failed to update recipe: ${recipe.name}`, err);
        });
      });
    });
    // await Cuisine.deleteMany({});
    //await DietaryOption.deleteMany({});

    // Insert cuisines
    // const cuisineDocs = cuisinePreferences.map((cuisine) => ({
    //   name: cuisine,
    // }));
    // await Cuisine.insertMany(cuisineDocs);

    // Insert dietary restrictions
    //await DietaryOption.insertMany(dietaryRestrictions);
    // Recipe.updateMany(
    //   {},
    //   {
    //     $set: {
    //       thumbnail:
    //         "https://res.cloudinary.com/dek6ihfme/image/upload/v1741418937/recipe-thumbnail-fallback_yhxyqo.png",
    //     },
    //   }
    // );
    // Remove all existing thumbnails
    await Recipe.updateMany({}, { $unset: { thumbnail: "" } });
    console.log("All recipe thumbnails removed!");

    // Set new default thumbnail
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

connectDB();
