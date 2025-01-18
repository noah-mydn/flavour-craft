const express = require("express");
const { generateRecipe } = require("../controllers/recommendationController");

const router = express.Router();

router.post("/generate", generateRecipe);

module.exports = router;
