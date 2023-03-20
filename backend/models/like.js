const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("Like", likeSchema);
