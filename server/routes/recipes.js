const express = require("express");
const { generateRecipesInBatch } = require("../controllers/recipesController");

const router = express.Router();

router.post("/batch-generate", generateRecipesInBatch);

module.exports = router;
