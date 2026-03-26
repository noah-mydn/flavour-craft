const express = require("express");
const {
  getDashboardStats,
  getRecipeGenerationTrends,
  getStats,
  getEngagementTrends,
  getCuisineDistribution,
} = require("../controllers/reportController");

const router = express.Router();
const { adminAuth } = require("../middlewares/authVerification");
router.get("/all", adminAuth, getDashboardStats);
router.get("/stats", adminAuth, getStats);
router.get("/recipes/generation-trend", adminAuth, getRecipeGenerationTrends);
router.get("/community/engagement-trend", adminAuth, getEngagementTrends);
router.get("/cuisine/distribution", adminAuth, getCuisineDistribution);

module.exports = router;
