const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Related Post
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Author
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
