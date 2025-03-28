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
const { cleanUpOrphanedRecipes } = require("../controllers/recipesController");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB connected");
      updateIngredientsDatabase();
      updateCuisineAndDietaryDb();
    });

    Recipe.find({}).then((recipes) => {
      recipes.forEach((recipe) => {
        //trending score calculation
        const trendingScore =
          recipe.views * 0.5 + recipe.saves * 1.5 + recipe.ratings.average * 2;

        // Update  recipe with the new trendingScore
        recipe.trendingScore = trendingScore;

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

    // const result = await Users.updateMany(
    //   { role: { $exists: false } },
    //   { $set: { role: "user" } }
    // );

    // console.log(`Migration complete: ${result.modifiedCount} users updated.`);

    // await Recipe.updateMany(
    //   {},
    //   {
    //     $set: {
    //       thumbnail:
    //         "https://res.cloudinary.com/dek6ihfme/image/upload/v1741418937/recipe-thumbnail-fallback_yhxyqo.png",
    //     },
    //   }
    // );
    // console.log("All recipe thumbnails removed!");

    // const result = await Users.updateMany(
    //   { role: { $ne: "admin" } },
    //   { $set: { isFirstLoggedIn: true } }
    // );

    // console.log("Migration Success:", result);

    cleanUpOrphanedRecipes();
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

connectDB();
