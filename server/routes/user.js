const express = require("express");
const {
  editUserProfile,
  deleteUserProfile,
  addDietaryPreferences,
  addCuisinePreferences,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authVerification");

const router = express.Router();

router.post("/edit", authenticateToken, editUserProfile);
router.post("/delete", authenticateToken, deleteUserProfile);
router.put("/set/dietaryOptions", authenticateToken, addDietaryPreferences);
router.put("/set/cuisineTypes", authenticateToken, addCuisinePreferences);
module.exports = router;
