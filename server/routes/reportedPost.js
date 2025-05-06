const express = require("express");
const {
  reportPost,
  removePost,
  ignoreReport,
  viewReports,
} = require("../controllers/community/reportController");
const { userAuth, adminAuth } = require("../middlewares/authVerification");
const router = express.Router();

router.get("/", adminAuth, viewReports);
router.put("/:postId/remove", adminAuth, removePost);
router.put("/:postId/ignore", adminAuth, ignoreReport);
router.post("/:postId", userAuth, reportPost);
module.exports = router;
