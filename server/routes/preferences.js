const express = require("express");
const authenticateToken = require("../middlewares/authVerification");
const {
  getDietaryRestrictionOptions,
  getCuisinePreferences,
} = require("../controllers/preferencesController");
const router = express.Router();

router.get("/dietary-options", authenticateToken, getDietaryRestrictionOptions);
router.get("/cuisines", authenticateToken, getCuisinePreferences);

module.exports = router;
