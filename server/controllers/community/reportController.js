const Report = require("../../models/community/Reports");
const Post = require("../../models/community/Posts");
const mongoose = require("mongoose");
exports.reportPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    const existingReport = await Report.findOne({
      post: postId,
      reportedBy: userId,
    });

    if (existingReport) {
      return res
        .status(400)
        .json({ message: "You have already reported this post." });
    }

    const report = new Report({
      post: postId,
      reportedBy: userId,
      reason,
      status: "Pending",
    });

    await report.save();

    return res.status(201).json({
      message: "Report submitted successfully",
      report,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to report post",
      error: err.message,
    });
  }
};

exports.viewReports = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const reports = await Report.find()
      .populate("post")
      .populate("reportedBy", "firstName lastName email userImg");

    res.status(200).json({
      status: 200,
      message: "Reports retrieved successfully",
      reports,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Failed to fetch reports",
      error: err.message,
    });
  }
};

exports.removePost = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { postId } = req.params;

    const post = await Post.findByIdAndUpdate(
      postId,
      { isRemoved: true, status: "Removed" },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const result = await Report.updateMany(
      { post: postId },
      { status: "Removed" }
    );

    return res.status(200).json({
      message: "Post soft-deleted and reports marked Removed.",
      updatedReports: result.modifiedCount ?? result.nModified,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to remove post",
      error: err.message,
    });
  }
};

exports.ignoreReport = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { postId } = req.params;

    const result = await Report.updateMany(
      { post: postId, status: "Pending" },
      { status: "Ignored" }
    );

    return res.status(200).json({
      message: `Reports for post ${postId} marked Ignored.`,
      modifiedCount: result.modifiedCount ?? result.nModified,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to ignore reports",
      error: err.message,
    });
  }
};
