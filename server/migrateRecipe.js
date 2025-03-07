const mongoose = require("mongoose");
const Recipe = require("./models/Recipes");

async function migrateRecipes() {
  await mongoose.connect(
    "mongodb+srv://flavourcraft_user:F5x8Iwz078YrsiiO@flavour-craft-cluster.k5u6v.mongodb.net/flavourCraft?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const recipes = await Recipe.find({});

  for (const recipe of recipes) {
    let updated = false;

    // Ensure views, saves, and ratings fields exist
    if (typeof recipe.views !== "number") {
      recipe.views = 0;
      updated = true;
    }
    if (typeof recipe.saves !== "number") {
      recipe.saves = 0;
      updated = true;
    }
    if (!recipe.ratings || typeof recipe.ratings !== "object") {
      recipe.ratings = { average: 0, count: 0 };
      updated = true;
    }

    if (updated) {
      await recipe.save();
      console.log(`Updated recipe: ${recipe._id}`);
    }
  }

  console.log("Recipe migration complete.");
  mongoose.connection.close();
}

migrateRecipes().catch((err) => console.error(err));
