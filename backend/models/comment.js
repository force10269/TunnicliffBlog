const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  slug: {
    type: String,
    ref: "Blog",
    required: true,
  },
  postTime: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
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
  nLikes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
