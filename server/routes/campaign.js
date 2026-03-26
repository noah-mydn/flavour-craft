const express = require("express");
const multer = require("multer");
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getActiveCampaign,
} = require("../controllers/campaignController");
const { campaignUpload } = require("../middlewares/multer");
const { adminAuth, userAuth } = require("../middlewares/authVerification");

const router = express.Router();

router.post(
  "/",
  campaignUpload.fields([{ name: "desktopImage" }, { name: "mobileImage" }]),
  adminAuth,
  createCampaign
);
router.get("/current", userAuth, getActiveCampaign);
router.get("/", userAuth, getCampaigns);
router.get("/:id", userAuth, getCampaignById);
router.put(
  "/:id",
  campaignUpload.fields([{ name: "desktopImage" }, { name: "mobileImage" }]),
  adminAuth,
  updateCampaign
);
router.delete("/:id", adminAuth, deleteCampaign);

module.exports = router;
