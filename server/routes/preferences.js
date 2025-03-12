const express = require("express");
const authenticateToken = require("../middlewares/authVerification");
const {
  addDietaryOption,
  addNewCuisineType,
  getDietaryOptions,
  getCuisineTypes,
  updateDietaryOption,
  updateCuisineType,
  deleteDietaryOption,
  deleteCuisineTypes,
  getDietaryOptionsById,
  getCuisineById,
} = require("../controllers/preferencesController");
const router = express.Router();

router.post("/dietary-options", authenticateToken, addDietaryOption);
router.post("/cuisines", authenticateToken, addNewCuisineType);
router.get("/dietary-options", authenticateToken, getDietaryOptions);
router.get("/cuisines", authenticateToken, getCuisineTypes);
router.get("/dietary-options/:id", authenticateToken, getDietaryOptionsById);
router.get("/cuisines/:id", authenticateToken, getCuisineById);
router.put("/dietary-options/:id", authenticateToken, updateDietaryOption);
router.put("/cuisines/:id", authenticateToken, updateCuisineType);
router.delete("/dietary-options/:id", authenticateToken, deleteDietaryOption);
router.delete("/cuisines/:id", authenticateToken, deleteCuisineTypes);
module.exports = router;
