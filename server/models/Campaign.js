const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hashtag: {
    type: [String],
    required: true,
  },
  desktopImage: { type: String, required: true },
  mobileImage: { type: String, required: true },
  isActive: {
    type: Boolean,
    default: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Campaign", campaignSchema);
