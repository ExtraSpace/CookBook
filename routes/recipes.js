const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const Recipe = require("../models/recipe");
const Author = require("../models/author");

const uploadPath = path.join("public", Recipe.featureImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

// Get All recipes
router.get("/", async (req, res) => {
  let query = Recipe.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publishedDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte("publishedDate", req.query.publishedAfter);
  }
  try {
    const recipes = await query.exec();
    res.render("recipes/index", {
      recipes: recipes,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect("/");
  }
});

// Page for new recipe entry page
router.get("/new", (req, res) => {
  renderNewPage(res, new Recipe());
});

// Posting new recipe
router.post("/", upload.single("featureImage"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const recipe = new Recipe({
    title: req.body.title,
    author: req.body.author,
    category: req.body.category,
    description: req.body.description,
    publishedDate: new Date(req.body.publishedDate),
    preparationTime: req.body.preparationTime,
    featuredImageName: fileName,
  });
  try {
    const newRecipe = await recipe.save();
    // res.redirect(`recipes/${newRecipe.id}`);
    res.redirect("recipes");
  } catch {
    if (recipe.featuredImageName != null) {
      removeFeatureImage(recipe.featuredImageName);
    }
    renderNewPage(res, recipe, true);
  }
});

function removeFeatureImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

async function renderNewPage(res, recipe, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      recipe: recipe,
    };
    if (hasError) params.errorMessage = "Error Creating Recipe.";
    res.render("recipes/new", params);
  } catch (error) {
    res.redirect("/recipes");
  }
}

module.exports = router;
