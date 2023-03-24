const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
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

// Add a unique index to prevent duplicate Likes
likeSchema.index({ referenceId: 1, "author.userId": 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
