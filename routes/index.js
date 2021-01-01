const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");

router.get("/", async (req, res) => {
  let recipes;
  try {
    recipes = await Recipe.find().sort({ createdAt: "desc" }).limit(5).exec();
  } catch (error) {
    recipes = [];
  }
  res.render("index", { recipes: recipes });
});

module.exports = router;
