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
const multer = require("multer");
const userAuth = require("../middlewares/authVerification").userAuth;

const router = express.Router();

router.put(
  "/edit",
  (req, res, next) => {
    profilePicUpload.single("userImg")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: "Multer error", error: err.message });
      } else if (err) {
        return res
          .status(500)
          .json({ message: "Upload error", error: err.message });
      }
      next(); // Proceed to controller only if no error
    });
  },

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
