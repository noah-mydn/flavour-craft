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
  downvotePost,
  deleteUpVote,
  deleteDownVote,
} = require("../controllers/community/postController");

const authenticateToken = require("../middlewares/authVerification");
const router = express.Router();

router.post(
  "/create",
  cloudinaryUpload.array("images", 5),
  authenticateToken,
  createPost
);
router.get("/popular", authenticateToken, getPopularPosts);
router.get("/trending", authenticateToken, getTrendingPosts);
router.put(
  "/:postId",
  cloudinaryUpload.array("images", 5),
  authenticateToken,
  updatePost
);
router.get("/", authenticateToken, getAllPosts);
router.delete("/:postId", authenticateToken, deletePost);
router.get("/:postId", authenticateToken, getPostById);

router.post("/:postId/comment", authenticateToken, addComment);
router.delete("/:postId/comment/:commentId", authenticateToken, deleteComment);
router.post("/:postId/upvote", authenticateToken, upvotePost);
router.post("/:postId/downvote", authenticateToken, downvotePost);
router.delete("/:postId/removeUpvote", authenticateToken, deleteUpVote);
router.delete("/:postId/removeDownVote", authenticateToken, deleteDownVote);

module.exports = router;
