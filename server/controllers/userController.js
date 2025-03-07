const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const Post = require("../models/community/Posts");
const Comment = require("../models/community/Comments");
const Notification = require("../models/community/Notification");

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
  const userId = req.user.id; // Assuming you have authentication middleware that sets `req.user`

  // Validate input
  if (!Array.isArray(cuisineTypes) || cuisineTypes.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid cuisine types. It should be a non-empty array.",
    });
  }

  try {
    // Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { cuisinePreferences: cuisineTypes } }, // Store cuisine preferences
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }

    return res.status(200).json({
      status: 200,
      message: "Cuisine preferences updated successfully.",
      data: updatedUser.cuisinePreferences,
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
  const userId = req.user.id;

  if (!Array.isArray(dietaryOptions) || dietaryOptions.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid dietary preferences. It should be a non-empty array.",
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { dietaryPreferences: dietaryOptions } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }

    return res.status(200).json({
      status: 200,
      message: "Dietary preferences updated successfully.",
      data: updatedUser.dietaryPreferences,
    });
  } catch (error) {
    console.error("Error updating dietary preferences:", error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while updating preferences.",
    });
  }
};

module.exports = {
  editUserProfile,
  deleteUserProfile,
  addDietaryPreferences,
  addCuisinePreferences,
};
