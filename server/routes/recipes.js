const express = require("express");
const {
  generateRecipesInBatch,
  trackRecipeViews,
  saveRecipe,
  rateRecipe,
  getTrendingRecipes,
  getAllRecipes,
  getPopularRecipes,
  getRecipeById,
  filterRecipes,
  filterPersonalizedRecipe,
  searchRecipes,
  getPersonalizedRecipes,
  generateRecipe,
  getMostViewedRecipes,
  getRecipeOfTheDay,
  getTimeBasedRecipe,
} = require("../controllers/recipesController");
const authenticateToken = require("../middlewares/authVerification");

const router = express.Router();

router.post("/batch-generate", authenticateToken, generateRecipesInBatch);
router.post("/generate", authenticateToken, generateRecipe);
router.post("/recommend", authenticateToken, getTimeBasedRecipe);
router.get("/all", authenticateToken, getAllRecipes);
router.get("/trending", authenticateToken, getTrendingRecipes);
router.get("/popular", authenticateToken, getPopularRecipes);
router.get("/personalized", authenticateToken, getPersonalizedRecipes);
router.get("/mostViewed", authenticateToken, getMostViewedRecipes);
router.get("/recipe-of-the-day", authenticateToken, getRecipeOfTheDay);
router.post("/filter", authenticateToken, filterRecipes);
router.post(
  "/personalized-filter",
  authenticateToken,
  filterPersonalizedRecipe
);
router.post("/search", authenticateToken, searchRecipes);
router.get("/:id", authenticateToken, getRecipeById);
router.put("/:id/view", authenticateToken, trackRecipeViews);
router.post("/:id/save", authenticateToken, saveRecipe);
router.post("/:id/rate", authenticateToken, rateRecipe);

module.exports = router;
