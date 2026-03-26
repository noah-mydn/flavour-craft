const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/Users");

async function migrateUsers() {
  await mongoose.connect(
    "mongodb+srv://flavourcraft_user:F5x8Iwz078YrsiiO@flavour-craft-cluster.k5u6v.mongodb.net/flavourCraft?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const users = await User.find({});

  for (const user of users) {
    let updated = false;

    if (!user.username && user.firstName) {
      user.username = `${user.firstName}_${user._id}`;
      updated = true;
    }

    if (user.password && !user.password.startsWith("$2b$")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      updated = true;
    }

    user.savedRecipes = user.savedRecipes.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    user.ratedRecipes = user.ratedRecipes.filter((rating) =>
      mongoose.Types.ObjectId.isValid(rating.recipeId)
    );

    if (updated) {
      await user.save();
      console.log(`Updated user: ${user._id}`);
    }
  }

  console.log("User migration complete.");
  mongoose.connection.close();
}

migrateUsers().catch((err) => console.error(err));
