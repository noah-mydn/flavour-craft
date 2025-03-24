const express = require("express");
const {
  editUserProfile,
  deleteUserProfile,
  addDietaryPreferences,
  addCuisinePreferences,
  getUserProfileById,
  getCurrentUserProfile,
  updatePassword,
} = require("../controllers/userController");
const { profilePicUpload } = require("../middlewares/multer");
const authenticateToken =
  require("../middlewares/authVerification").authenticateToken;

const router = express.Router();

router.put(
  "/edit",
  profilePicUpload.single("userImg"),
  authenticateToken,
  editUserProfile
);
router.put("/update-password", authenticateToken, updatePassword);
router.post("/delete", authenticateToken, deleteUserProfile);
router.put("/set/dietaryOptions", authenticateToken, addDietaryPreferences);
router.put("/set/cuisineTypes", authenticateToken, addCuisinePreferences);
router.get("/profile", authenticateToken, getUserProfileById);
router.get("/me", authenticateToken, getCurrentUserProfile);
module.exports = router;
