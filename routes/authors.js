const express = require("express");
const router = express.Router();
const Author = require("../models/author");

// Get All authors
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors: authors, searchOptions: req.query });
  } catch (error) {
    res.redirect("/");
  }
});

// Page for new author entry page
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Posting new author
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect("authors");
    // res.redirect(`author/${newAuthor.id}`)
  } catch (error) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating author.",
    });
  }
});

module.exports = router;
