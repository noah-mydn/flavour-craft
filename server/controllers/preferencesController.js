const { Cuisine, DietaryOption } = require("../models/DietaryOptions");

exports.getDietaryRestrictionOptions = async (req, res) => {
  try {
    const dietaryOptions = await DietaryOption.find(
      {},
      "category options -_id"
    );
    return res.status(200).json({ data: dietaryOptions });
  } catch (error) {
    console.error("Error fetching dietary restrictions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCuisinePreferences = async (req, res) => {
  try {
    const cuisines = await Cuisine.find({}, "name -_id");
    return res.status(200).json({ data: cuisines.map((c) => c.name) });
  } catch (error) {
    console.error("Error fetching cuisine preferences:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
