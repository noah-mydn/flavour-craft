const {
  dietaryRestrictions,
  cuisinePreferences,
} = require("../constants/data");

exports.getDietaryRestrictionOptions = async (req, res) => {
  try {
    return res.status(200).json({
      data: dietaryRestrictions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getCuisinePreferences = async (req, res) => {
  try {
    return res.status(200).json({
      data: cuisinePreferences,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
