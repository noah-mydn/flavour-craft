const express = require("express");

const userAuth = require("../middlewares/authVerification").userAuth;
const { fetchAllIngredients } = require("../controllers/ingredientController");

const router = express.Router();

router.get("/", userAuth, fetchAllIngredients);

module.exports = router;
