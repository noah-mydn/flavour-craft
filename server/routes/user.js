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
const { adminAuth } = require("../middlewares/authVerification");
const {
  viewUserAnalytics,
  issueWarning,
  deleteUser,
} = require("../controllers/userAnalyticsController");
const userAuth = require("../middlewares/authVerification").userAuth;

const router = express.Router();

router.put(
  "/edit",
  profilePicUpload.single("userImg"),
  userAuth,
  editUserProfile
);
router.put("/update-password", userAuth, updatePassword);
router.post("/delete", userAuth, deleteUserProfile);
router.put("/set/dietaryOptions", userAuth, addDietaryPreferences);
router.put("/set/cuisineTypes", userAuth, addCuisinePreferences);
router.get("/profile", userAuth, getUserProfileById);
router.get("/me", userAuth, getCurrentUserProfile);
router.get("/all", adminAuth, viewUserAnalytics);
router.put("/:userId/warn", adminAuth, issueWarning);
router.delete("/:userId/delete", adminAuth, deleteUser);
module.exports = router;
