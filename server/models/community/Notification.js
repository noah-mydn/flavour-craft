const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  commentedUser: {
    firstName: String,
    lastName: String,
    userImg: String,
  },

  message: { type: String, required: true },
  link: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
