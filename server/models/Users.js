const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { validatePassword } = require("../utils/utils");

const userSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  userImg: {
    type: String,
    default: "./avatar.png",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    default: null,
    validate: {
      validator: function (password) {
        if (password === null) return true;
        const errorMessage = validatePassword(password);
        return errorMessage === null;
      },
      message: function (props) {
        return validatePassword(props.value);
      },
    },
  },
  dietaryRestrictions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "DietaryOption" },
  ],

  cuisinePreferences: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Cuisine" },
  ],
  createdAt: { type: Date, default: Date.now },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  myRecipeGenerations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  ],
  ratedRecipes: [
    {
      recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
      rating: Number,
    },
  ],
});

// Middleware to generate the username
userSchema.pre("save", function (next) {
  if (!this.username && this.firstName) {
    this.username = `${this.firstName}_${this._id}`;
  }
  next();
});

// Hash password
userSchema.pre("save", async function (next) {
  // Skip hashing if password is null or not modified
  if (!this.password || !this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Remove unnecessary fields for admin users
userSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.dietaryRestrictions = undefined;
    this.cuisinePreferences = undefined;
    this.savedRecipes = undefined;
    this.myRecipeGenerations = undefined;
    this.ratedRecipes = undefined;
  }
  next();
});

module.exports = mongoose.model("User", userSchema, "users");
