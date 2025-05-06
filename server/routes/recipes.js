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
const userAuth = require("../middlewares/authVerification").userAuth;

const router = express.Router();

router.post("/search", adminAuth, searchRecipe);
router.post("/batch-generate", adminAuth, generateRecipesInBatch);
router.post("/generate", userAuth, generateRecipe);
router.delete("/delete", adminAuth, deleteRecipesInBatch);
router.get("/recommend", userAuth, getTimeBasedRecipe);
router.get("/all", userAuth, getAllRecipes);
router.get("/trending", userAuth, getTrendingRecipes);
router.get("/popular", userAuth, getPopularRecipes);
router.get("/personalized", userAuth, getPersonalizedRecipes);
router.get("/mostViewed", userAuth, getMostViewedRecipes);
router.get("/recipe-of-the-day", userAuth, getRecipeOfTheDay);
router.post("/filter", userAuth, filterRecipes);
router.post("/personalized-filter", userAuth, filterPersonalizedRecipe);

router.get("/:id", userAuth, getRecipeById);
router.delete("/:id", adminAuth, deleteRecipe);
router.put(
  "/:id/upload",
  recipeImgUpload.single("thumbnail"),
  adminAuth,
  uploadRecipeThumbnail
);
router.put("/:id/view", userAuth, trackRecipeViews);
router.post("/:id/save", userAuth, saveRecipe);
router.post("/:id/rate", userAuth, rateRecipe);

module.exports = router;
