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

const userAuth = require("../middlewares/authVerification").userAuth;
const router = express.Router();

router.get("/notis", userAuth, getNotifications);
router.put("/notis/:id/read", userAuth, markNotificationAsRead);

router.post(
  "/create",
  cloudinaryUpload.array("images", 5),
  userAuth,
  createPost
);
router.put(
  "/:postId",

  cloudinaryUpload.array("newImages", 5),
  userAuth,
  updatePost
);

//  General post routes
router.get("/sort", userAuth, getAllPosts);
router.get("/:postId", userAuth, getPostById);
router.delete("/:postId", userAuth, deletePost);

//  Comments section
router.get("/:postId/comments", userAuth, getAllComments);
router.post("/:postId/comment", userAuth, addComment);
router.put("/:postId/comment/:commentId", userAuth, updateComment);
router.delete("/:postId/comment/:commentId", userAuth, deleteComment);

//  Voting routes
router.post("/:postId/upvote", userAuth, upvotePost);

//Report routes

// router.post("/:postId/downvote", userAuth, downvotePost);
// router.delete("/:postId/removeUpvote", userAuth, deleteUpVote);
// router.delete("/:postId/removeDownVote", userAuth, deleteDownVote);

module.exports = router;
