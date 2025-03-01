const express = require("express");
const {
  editUserProfile,
  deleteUserProfile,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authVerification");

const router = express.Router();

router.post("/edit", authenticateToken, editUserProfile);
router.post("/delete", authenticateToken, deleteUserProfile);

module.exports = router;
