const express = require("express");
const userAuth = require("../middlewares/authVerification").userAuth;
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

router.get("/dietary-options", userAuth, getDietaryOptions);
router.get("/cuisines", userAuth, getCuisineTypes);

//Create/Update/Delete Cuisines (Admin Only)
router.post("/cuisines", adminAuth, addNewCuisineType);
router.put("/cuisines/:id", adminAuth, updateCuisineType);
///break///

//Create/Update/Delete Dietary Options (Admin Only)
router.post("/dietary-options", adminAuth, addDietaryOption);
router.put("/dietary-options/:id", adminAuth, updateDietaryOption);
router.delete("/dietary-options/:id", adminAuth, deleteDietaryOption);
///break///

router.delete("/cuisines/:id", userAuth, deleteCuisineTypes);
router.get("/dietary-options/:id", userAuth, getDietaryOptionsById);

module.exports = router;
