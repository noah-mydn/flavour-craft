const express = require("express");
const { cloudinaryUpload } = require("../middlewares/multer");
const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
  getPopularPosts,
  getTrendingPosts,
  addComment,
  deleteComment,
  upvotePost,
  getAllComments,
  getNotifications,
  updateComment,
  markNotificationAsRead,

  // downvotePost,
  // deleteUpVote,
  // deleteDownVote,
} = require("../controllers/community/postController");
const { uploadPostImages } = require("../middlewares/uploadImages");
const { adminAuth } = require("../middlewares/authVerification");

const authenticateToken =
  require("../middlewares/authVerification").authenticateToken;
const router = express.Router();

router.get("/notis", authenticateToken, getNotifications);
router.put("/notis/:id/read", authenticateToken, markNotificationAsRead);

router.post(
  "/create",
  cloudinaryUpload.array("images", 5),
  authenticateToken,
  createPost
);
router.put(
  "/:postId",

  cloudinaryUpload.array("newImages", 5),
  authenticateToken,
  updatePost
);

//  General post routes
router.get("/sort", authenticateToken, getAllPosts);
router.get("/:postId", authenticateToken, getPostById);
router.delete("/:postId", authenticateToken, deletePost);

//  Comments section
router.get("/:postId/comments", authenticateToken, getAllComments);
router.post("/:postId/comment", authenticateToken, addComment);
router.put("/:postId/comment/:commentId", authenticateToken, updateComment);
router.delete("/:postId/comment/:commentId", authenticateToken, deleteComment);

//  Voting routes
router.post("/:postId/upvote", authenticateToken, upvotePost);

//Report routes

// router.post("/:postId/downvote", authenticateToken, downvotePost);
// router.delete("/:postId/removeUpvote", authenticateToken, deleteUpVote);
// router.delete("/:postId/removeDownVote", authenticateToken, deleteDownVote);

module.exports = router;
