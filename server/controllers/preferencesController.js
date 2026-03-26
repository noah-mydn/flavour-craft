const Recipe = require("../models/Recipes");

const Cuisine = require("../models/DietaryOptions").Cuisine;
const DietaryOption = require("../models/DietaryOptions").DietaryOption;

exports.updateCuisineAndDietaryDb = async () => {
  try {
    const recipes = await Recipe.find();
    const cuisineSet = new Set();
    const dietarySet = new Set();

    recipes.forEach((recipe) => {
      if (recipe.cuisineTypes) {
        recipe.cuisineTypes.forEach((cuisine) => {
          const formattedCuisine = cuisine
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
          cuisineSet.add(formattedCuisine);
        });
      }

      if (recipe.dietaryPreferences) {
        recipe.dietaryPreferences.forEach((dietary) => {
          dietarySet.add(dietary.trim()); // Keep dietary preferences as they are
        });
      }
    });

    const cuisineNames = [...cuisineSet];
    const dietaryNames = [...dietarySet];

    // Fetch all cuisines and dietary options
    const existingCuisines = await Cuisine.find();
    const existingDietaryOptions = await DietaryOption.find();

    // Normalize names for comparison
    const cuisineMap = new Map(); // Stores unique cuisines in Title Case
    const dietaryMap = new Map(); // Stores unique dietary preferences

    const duplicateCuisines = [];
    const duplicateDietaryOptions = [];

    // Check for duplicate cuisines
    existingCuisines.forEach((cuisine) => {
      const lowerName = cuisine.name.toLowerCase();
      if (cuisineMap.has(lowerName)) {
        duplicateCuisines.push(cuisine._id); // Mark duplicate for deletion
      } else {
        cuisineMap.set(lowerName, cuisine._id); // Store first occurrence
      }
    });

    // Check for duplicate dietary options
    existingDietaryOptions.forEach((dietary) => {
      const lowerName = dietary.name.toLowerCase();
      if (dietaryMap.has(lowerName)) {
        duplicateDietaryOptions.push(dietary._id); // Mark duplicate for deletion
      } else {
        dietaryMap.set(lowerName, dietary._id); // Store first occurrence
      }
    });

    // Delete duplicate cuisines and cascade remove references
    if (duplicateCuisines.length > 0) {
      await Cuisine.deleteMany({ _id: { $in: duplicateCuisines } });
      await Recipe.updateMany(
        { cuisineTypes: { $in: duplicateCuisines } },
        { $pull: { cuisineTypes: { $in: duplicateCuisines } } } // Remove references
      );
      console.log("Duplicate cuisines removed.");
    }

    // Delete duplicate dietary options and cascade remove references
    if (duplicateDietaryOptions.length > 0) {
      await DietaryOption.deleteMany({ _id: { $in: duplicateDietaryOptions } });
      await Recipe.updateMany(
        { dietaryPreferences: { $in: duplicateDietaryOptions } },
        { $pull: { dietaryPreferences: { $in: duplicateDietaryOptions } } } // Remove references
      );
      console.log("Duplicate dietary options removed.");
    }

    // Insert new cuisines (Title Case enforced)
    const newCuisines = cuisineNames
      .filter((name) => !cuisineMap.has(name.toLowerCase()))
      .map((name) => ({ name }));

    const newDietaryOptions = dietaryNames
      .filter((name) => !dietaryMap.has(name.toLowerCase()))
      .map((name) => ({ name }));

    if (newCuisines.length > 0) {
      await Cuisine.insertMany(newCuisines);
      console.log("Cuisine database updated successfully!");
    } else {
      console.log("No new cuisines to add.");
    }

    if (newDietaryOptions.length > 0) {
      await DietaryOption.insertMany(newDietaryOptions);
      console.log("Dietary options database updated successfully!");
    } else {
      console.log("No new dietary options to add.");
    }
  } catch (error) {
    console.error(
      "Error updating cuisine and dietary preferences database:",
      error.message
    );
  }
};

// Add a new dietary option
exports.addDietaryOption = async (req, res) => {
  try {
    const { name } = req.body;
    const existingOption = await DietaryOption.findOne({ name });

    if (existingOption) {
      return res
        .status(400)
        .json({ status: 400, message: "Dietary option already exists." });
    }

    const dietaryOption = new DietaryOption({ name });
    await dietaryOption.save();

    res.status(201).json({
      status: 201,
      message: "Dietary option added successfully.",
      dietaryOption,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error adding dietary option.", error });
  }
};

// Add a new cuisine type
exports.addNewCuisineType = async (req, res) => {
  try {
    const { name } = req.body;
    const existingCuisine = await Cuisine.findOne({ name });

    if (existingCuisine) {
      return res
        .status(400)
        .json({ status: 400, message: "Cuisine type already exists." });
    }

    const cuisineType = new Cuisine({ name });
    await cuisineType.save();

    res.status(201).json({
      status: 201,
      message: "Cuisine type added successfully.",
      cuisineType,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Error adding cuisine type.", error });
  }
};

// Get all dietary options
exports.getDietaryOptions = async (req, res) => {
  try {
    const { page, pageSize } = req.query;

    let query = DietaryOption.find();

    if (page !== undefined && pageSize !== undefined) {
      const pageNumber = Number(page);
      const limit = Number(pageSize);

      if (!isNaN(pageNumber) && !isNaN(limit) && pageNumber > 0 && limit > 0) {
        const skip = (pageNumber - 1) * limit;
        query = query.skip(skip).limit(limit);
      }
    }

    const dietaryOptions = await query.exec();
    const total = await DietaryOption.countDocuments();

    res.status(200).json({
      status: 200,
      dietaryOptions,
      pagination: {
        total,
        page: page !== undefined ? Number(page) : null,
        pageSize: pageSize !== undefined ? Number(pageSize) : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching dietary options.",
      error,
    });
  }
};

exports.getCuisineTypes = async (req, res) => {
  try {
    const { page, pageSize } = req.query;

    let query = Cuisine.find();

    if (page !== undefined && pageSize !== undefined) {
      const pageNumber = Number(page);
      const limit = Number(pageSize);

      if (!isNaN(pageNumber) && !isNaN(limit) && pageNumber > 0 && limit > 0) {
        const skip = (pageNumber - 1) * limit;
        query = query.skip(skip).limit(limit);
      }
    }

    const cuisines = await query.exec();
    const total = await Cuisine.countDocuments();

    res.status(200).json({
      status: 200,
      cuisines,
      pagination: {
        total,
        page: page !== undefined ? Number(page) : null,
        pageSize: pageSize !== undefined ? Number(pageSize) : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching cuisine types.",
      error,
    });
  }
};

// Update a dietary option
exports.updateDietaryOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedDietary = await DietaryOption.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedDietary) {
      return res
        .status(404)
        .json({ status: 404, message: "Dietary option not found." });
    }

    res.status(200).json({
      status: 200,
      message: "Dietary option updated successfully.",
      updatedDietary,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error updating dietary option.",
      error,
    });
  }
};

// Update a cuisine type
exports.updateCuisineType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCuisine = await Cuisine.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCuisine) {
      return res
        .status(404)
        .json({ status: 404, message: "Cuisine type not found." });
    }

    res.status(200).json({
      status: 200,
      message: "Cuisine type updated successfully.",
      updatedCuisine,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error updating cuisine type.", error });
  }
};

// Delete a dietary option
exports.deleteDietaryOption = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDietary = await DietaryOption.findByIdAndDelete(id);

    if (!deletedDietary) {
      return res
        .status(404)
        .json({ status: 404, message: "Dietary option not found." });
    }

    res
      .status(200)
      .json({ status: 200, message: "Dietary option deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error deleting dietary option.", error });
  }
};

// Delete a cuisine type
exports.deleteCuisineTypes = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCuisine = await Cuisine.findByIdAndDelete(id);

    if (!deletedCuisine) {
      return res
        .status(404)
        .json({ status: 404, message: "Cuisine type not found." });
    }

    res
      .status(200)
      .json({ status: 200, message: "Cuisine type deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error deleting cuisine type.", error });
  }
};

//Get Cuisine By Id
exports.getCuisineById = async (req, res) => {
  const cuisineId = req.params.id;
  try {
    const cuisine = await Cuisine.findById(cuisineId);
    if (!cuisine) {
      return res
        .status(404)
        .json({ status: 404, message: "Cuisine not found" });
    }
    res.status(200).json({ status: 200, data: cuisine });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error fetching cuisine.", error });
  }
};

//Get dietaryOption by id
exports.getDietaryOptionsById = async (req, res) => {
  const dietaryOptionId = req.params.id;
  try {
    const dietaryOption = await DietaryOption.findById(dietaryOptionId);
    if (!dietaryOption) {
      return res(404).json({
        status: 404,
        message: "Dietary Option not found",
      });
    }
    res.status(200).json({ status: 200, data: dietaryOption });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error fetching dietary option", error });
  }
};
