const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  slug: {
    type: String,
    ref: "Blog",
    required: true,
  },
  likeTime: {
    type: Date,
    default: Date.now,
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
    name: {
      type: String,
    },
  },
});

// Add a unique index to prevent duplicate Likes per user per slug
likeSchema.index({ "slug": 1, "author.userId": 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
