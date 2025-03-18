const express = require("express");
const authenticateToken =
  require("../middlewares/authVerification").authenticateToken;
const adminAuth = require("../middlewares/authVerification").adminAuth;
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

router.get("/dietary-options", authenticateToken, getDietaryOptions);
router.get("/cuisines", authenticateToken, getCuisineTypes);

//Create/Update/Delete Cuisines (Admin Only)
router.post("/cuisines", adminAuth, addNewCuisineType);
router.put("/cuisines/:id", adminAuth, updateCuisineType);
///break///

//Create/Update/Delete Dietary Options (Admin Only)
router.post("/dietary-options", adminAuth, addDietaryOption);
router.put("/dietary-options/:id", adminAuth, updateDietaryOption);
router.delete("/dietary-options/:id", adminAuth, deleteDietaryOption);
///break///

router.delete("/cuisines/:id", authenticateToken, deleteCuisineTypes);
router.get("/dietary-options/:id", authenticateToken, getDietaryOptionsById);

module.exports = router;
