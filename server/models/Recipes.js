const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: String },
      substitute: { type: [String] },
    },
  ],
  shortDescription: {
    type: String,
    required: true,
  },
  dietaryPreferences: {
    type: [String],
    default: [],
  },
  cuisineTypes: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  cookingInstructions: {
    type: [String],
    required: true,
  },
  nutritionalInfo: {
    calories: { type: String },
    protein: { type: String },
    carbs: { type: String },
    fat: { type: String },
  },
  cookingTime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
