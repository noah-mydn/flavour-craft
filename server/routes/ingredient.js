const express = require("express");

const authenticateToken =
  require("../middlewares/authVerification").authenticateToken;
const { fetchAllIngredients } = require("../controllers/ingredientController");

const router = express.Router();

router.get("/", authenticateToken, fetchAllIngredients);

module.exports = router;
