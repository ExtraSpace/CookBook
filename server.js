if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");

// Import routes
const indexRouter = require("./routes/index");

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
app.use(express.static("public"));

// Set different options
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

// Setting up Router
app.use("/", indexRouter);

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running at http://localhost:${process.env.PORT || 3000}/`
  );
});
