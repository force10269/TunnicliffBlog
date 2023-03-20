require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

module.exports = mongoose;
