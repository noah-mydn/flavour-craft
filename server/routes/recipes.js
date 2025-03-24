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

  getPersonalizedRecipes,
  generateRecipe,
  getMostViewedRecipes,
  getRecipeOfTheDay,
  getTimeBasedRecipe,
  deleteRecipe,
  deleteRecipesInBatch,
  uploadRecipeThumbnail,
  searchRecipe,
} = require("../controllers/recipesController");
const { adminAuth } = require("../middlewares/authVerification");
const { recipeImgUpload } = require("../middlewares/multer");
const authenticateToken =
  require("../middlewares/authVerification").authenticateToken;

const router = express.Router();

router.post("/search", adminAuth, searchRecipe);
router.post("/batch-generate", adminAuth, generateRecipesInBatch);
router.post("/generate", authenticateToken, generateRecipe);
router.delete("/delete", adminAuth, deleteRecipesInBatch);
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

router.get("/:id", authenticateToken, getRecipeById);
router.delete("/:id", adminAuth, deleteRecipe);
router.put(
  "/:id/upload",
  recipeImgUpload.single("thumbnail"),
  adminAuth,
  uploadRecipeThumbnail
);
router.put("/:id/view", authenticateToken, trackRecipeViews);
router.post("/:id/save", authenticateToken, saveRecipe);
router.post("/:id/rate", authenticateToken, rateRecipe);

module.exports = router;
