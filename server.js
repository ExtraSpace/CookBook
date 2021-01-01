if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Import routes
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const recipeRouter = require("./routes/recipes");

// Setting up mongodb with Mongoose
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database."));

// Express app
const app = express();

// Apply Middlewares to the express app
app.use(expressLayout);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(express.static(__dirname + "/public"));

// Set different options
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

// Setting up Router
app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/recipes", recipeRouter);

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running at http://localhost:${process.env.PORT || 3000}/`
  );
});
