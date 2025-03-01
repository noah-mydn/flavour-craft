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

module.exports = { editUserProfile, deleteUserProfile };
