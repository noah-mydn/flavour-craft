const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const Post = require("../models/community/Posts");
const Comment = require("../models/community/Comments");
const Notification = require("../models/community/Notification");
const { default: mongoose } = require("mongoose");

const editUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user profile", error: err.message });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Post.deleteMany({ userId });
    await Comment.deleteMany({ userId });
    await Notification.deleteMany({ userId });

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      status: 200,
      message: "User profile updated successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user profile", error: err.message });
  }
};

const addCuisinePreferences = async (req, res) => {
  const { cuisineTypes } = req.body;
  const userId = req.user.userId;

  if (!Array.isArray(cuisineTypes) || cuisineTypes.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid cuisine types. It should be a non-empty array.",
    });
  }

  try {
    // Convert strings to ObjectId
    const cuisineObjectIds = cuisineTypes.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { cuisinePreferences: cuisineObjectIds } },
      { new: true, runValidators: true }
    ).populate("cuisinePreferences"); // Populate to return full objects

    if (!updatedUser) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }

    return res.status(200).json({
      status: 200,
      message: "Cuisine preferences updated successfully.",
      data: updatedUser.cuisinePreferences, // Now contains full objects
    });
  } catch (error) {
    console.error("Error updating cuisine preferences:", error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while updating preferences.",
    });
  }
};

const addDietaryPreferences = async (req, res) => {
  const { dietaryOptions } = req.body;
  const userId = req.user.userId;

  if (!Array.isArray(dietaryOptions) || dietaryOptions.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid dietary preferences. It should be a non-empty array.",
    });
  }

  try {
    // Convert string IDs to ObjectIds
    const dietaryObjectIds = dietaryOptions.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { dietaryRestrictions: dietaryObjectIds } },
      { new: true }
    ).populate("dietaryRestrictions");

    if (!updatedUser) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }

    return res.status(200).json({
      status: 200,
      message: "Dietary preferences updated successfully.",
      data: updatedUser.dietaryRestrictions, // Now contains full objects
    });
  } catch (error) {
    console.error("Error updating dietary preferences:", error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while updating preferences.",
    });
  }
};

const getUserProfileById = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    const newUserFormat = user.toObject();
    delete newUserFormat.password;

    return res.status(200).json({
      status: 200,
      message: "User profile retrieved successfully",
      user: newUserFormat,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching user profile",
    });
  }
};

const getCurrentUserProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId)
      .populate("cuisinePreferences")
      .populate("dietaryRestrictions");
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not foun" });
    }

    const newUserFormat = user.toObject();
    delete newUserFormat.password;

    return res.status(200).json({
      status: 200,
      message: "User profile retrieved successfully",
      user: newUserFormat,
    });
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching current user profile",
    });
  }
};

module.exports = {
  editUserProfile,
  deleteUserProfile,
  addDietaryPreferences,
  addCuisinePreferences,
  getUserProfileById,
  getCurrentUserProfile,
};
