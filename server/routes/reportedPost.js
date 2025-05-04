const express = require("express");
const {
  reportPost,
  removePost,
  ignoreReport,
  viewReports,
} = require("../controllers/community/reportController");
const {
  authenticateToken,
  adminAuth,
} = require("../middlewares/authVerification");
const router = express.Router();

router.get("/", adminAuth, viewReports);
router.put("/:postId/remove", adminAuth, removePost);
router.put("/:postId/ignore", adminAuth, ignoreReport);
router.post("/:postId", authenticateToken, reportPost);
module.exports = router;
