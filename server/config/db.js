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
const {
  cleanUpOrphanedRecipes,
  recalculateRecipeRatings,
} = require("../controllers/recipesController");
const UserAnalytics = require("../models/UserAnalytics");
const Posts = require("../models/community/Posts");

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

    //recalculateRecipeRatings();

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
    // await Users.updateMany(
    //   {
    //     $or: [
    //       { isFirstLoggedIn: { $exists: false } },
    //       { authProvider: { $exists: false } },
    //     ],
    //   },
    //   {
    //     $set: {
    //       isFirstLoggedIn: true,
    //       authProvider: "local",
    //     },
    //   }
    // );
    const users = await Users.find().lean();
    console.log(`Found ${users.length} users. Backfilling analytics…`);

    for (const u of users) {
      const status = u.isRestricted ? "Restricted" : "Active";

      // Upsert a UserAnalytics doc for each user
      await UserAnalytics.updateOne(
        { userId: u._id },
        {
          userId: u._id,
          generatedRecipeCount: u.myRecipeGenerations?.length || 0,
          status,
          lastActiveAt: u.updatedAt || u.createdAt,
        },
        { upsert: true }
      );
    }
    // console.log("Migration Success:", result);

    cleanUpOrphanedRecipes();

    // Users.create({
    //   firstName: "FlavourCraft",
    //   lastName: "Admin",
    //   role: "admin",
    //   email: "admin3@flavourcraft.com",
    //   password: "@dmiN123!",
    // });
    // await Posts.find({ downvotes: { $exists: true } });

    // await Posts.updateMany(
    //   {},
    //   {
    //     $set: { isRemoved: false },
    //     $unset: { downvotes: 1 },
    //   }
    // );
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

connectDB();
