const mongoose = require("mongoose");

var Image = mongoose.model("Image", {
  filename: {
    type: String,
    required: true,
  },
  hashedname: {
    type: String,
    required: true,
  },
  content_type: {
    type: String,
    required: true,
  },
  imageurl: {
    type: String,
    required: true,
  },
});

module.exports = { Image };
