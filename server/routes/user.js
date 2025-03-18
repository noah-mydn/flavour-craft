const express = require("express");
const {
  editUserProfile,
  deleteUserProfile,
  addDietaryPreferences,
  addCuisinePreferences,
  getUserProfileById,
  getCurrentUserProfile,
} = require("../controllers/userController");
const authenticateToken =
  require("../middlewares/authVerification").authenticateToken;

const router = express.Router();

router.post("/edit", authenticateToken, editUserProfile);
router.post("/delete", authenticateToken, deleteUserProfile);
router.put("/set/dietaryOptions", authenticateToken, addDietaryPreferences);
router.put("/set/cuisineTypes", authenticateToken, addCuisinePreferences);
router.get("/profile", authenticateToken, getUserProfileById);
router.get("/me", authenticateToken, getCurrentUserProfile);
module.exports = router;
