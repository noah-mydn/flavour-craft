const mongoose = require("mongoose");

const recipeGenerationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const RecipeGenerationLog = mongoose.model(
  "RecipeGenerationLog",
  recipeGenerationLogSchema
);
module.exports = RecipeGenerationLog;
