const mongoose = require("mongoose");
const {
  updateIngredientsDatabase,
} = require("../controllers/ingredientController");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB connected");
      updateIngredientsDatabase();
    });
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

connectDB();
