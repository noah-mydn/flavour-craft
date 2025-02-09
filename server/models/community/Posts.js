const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  topic: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  image: { type: String, default: "" },
  tags: [{ type: String }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
