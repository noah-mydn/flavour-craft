const mongoose = require("mongoose");

const CuisineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const DietaryOptionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  options: [{ type: String, required: true }],
});

const Cuisine = mongoose.model("Cuisine", CuisineSchema);
const DietaryOption = mongoose.model("DietaryOption", DietaryOptionSchema);

module.exports = { Cuisine, DietaryOption };
