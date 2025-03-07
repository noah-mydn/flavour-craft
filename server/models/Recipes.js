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
  views: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
recipeSchema.index({
  name: "text",
  "ingredients.name": "text",
  shortDescription: "text",
});
const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
