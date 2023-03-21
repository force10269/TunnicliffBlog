const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  postTime: {
    type: Date,
    default: Date.now,
  },
  nLikes: {
    type: Number,
    default: 0,
  },
  numComments: {
    type: Number,
    default: 0,
  },
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profilePic: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  topics: {
    type: [String],
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Blog", blogSchema);
