const mongoose = require("mongoose");
const path = require("path");
const featureImageBasePath = "uploads/featureImage";

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: String,
  description: String,
  publishedDate: {
    type: Date,
    required: true,
  },
  preparationTime: Number,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  featuredImageName: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

recipeSchema.virtual("featureImagePath").get(function () {
  if (this.featuredImageName != null) {
    return path.join("/", featureImageBasePath, this.featuredImageName);
  }
});

module.exports = mongoose.model("Recipe", recipeSchema);
module.exports.featureImageBasePath = featureImageBasePath;
