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
  // downvotePost,
  // deleteUpVote,
  // deleteDownVote,
} = require("../controllers/community/postController");
const { uploadPostImages } = require("../middlewares/uploadImages");

const authenticateToken =
  require("../middlewares/authVerification").authenticateToken;
const router = express.Router();

router.get("/notifications", authenticateToken, getNotifications);

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

//  Popular & trending posts
router.get("/popular", authenticateToken, getPopularPosts);
router.get("/trending", authenticateToken, getTrendingPosts);

//  General post routes
router.get("/", authenticateToken, getAllPosts);
router.get("/:postId", authenticateToken, getPostById);
router.delete("/:postId", authenticateToken, deletePost);

//  Comments section
router.get("/:postId/comments", authenticateToken, getAllComments);
router.post("/:postId/comment", authenticateToken, addComment);
router.put("/:postId/comment/:commentId", authenticateToken, updateComment);
router.delete("/:postId/comment/:commentId", authenticateToken, deleteComment);

//  Voting routes
router.post("/:postId/upvote", authenticateToken, upvotePost);
// router.post("/:postId/downvote", authenticateToken, downvotePost);
// router.delete("/:postId/removeUpvote", authenticateToken, deleteUpVote);
// router.delete("/:postId/removeDownVote", authenticateToken, deleteDownVote);

module.exports = router;
