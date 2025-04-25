const mongoose = require("mongoose");
const UserAnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    generatedRecipeCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Restricted", "Disabled"],
      default: "Active",
    },
    lastActiveAt: Date,
  },
  { timestamps: true }
);
const UserAnalytics = mongoose.model("UserAnalytics", UserAnalyticsSchema);
module.exports = UserAnalytics;
