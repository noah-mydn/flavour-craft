const Campaign = require("../models/Campaign");
// Create Campaign
exports.createCampaign = async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for date comparison
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < today) {
      return res
        .status(400)
        .json({ error: "Start date cannot be in the past" });
    }

    if (end <= start) {
      return res
        .status(400)
        .json({ error: "End date must be at least one day after start date" });
    }

    const desktopImage = req.files["desktopImage"]?.[0]?.path;
    const mobileImage = req.files["mobileImage"]?.[0]?.path;

    if (!desktopImage || !mobileImage) {
      return res.status(400).json({ error: "Both images are required" });
    }

    const newCampaign = new Campaign({
      title,
      desktopImage,
      mobileImage,
      startDate,
      endDate,
    });

    await newCampaign.save();
    res.status(201).json({
      status: 201,
      campaign: newCampaign,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating campaign!", error: err.message });
  }
};

// Update Campaign
exports.updateCampaign = async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;
    let updateData = { title };

    if (startDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(startDate);

      if (start < today) {
        return res
          .status(400)
          .json({ error: "Start date cannot be in the past" });
      }
      updateData.startDate = startDate;
    }

    if (endDate) {
      const start = new Date(req.body.startDate || updateData.startDate);
      const end = new Date(endDate);

      if (end <= start) {
        return res.status(400).json({
          error: "End date must be at least one day after start date",
        });
      }
      updateData.endDate = endDate;
    }

    if (req.files["desktopImage"])
      updateData.desktopImage = req.files["desktopImage"][0].path;
    if (req.files["mobileImage"])
      updateData.mobileImage = req.files["mobileImage"][0].path;

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      status: 200,
      campaign: updatedCampaign,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating campaign!", error: err.message });
  }
};

// Get All Campaigns
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json({
      status: 200,
      campaigns,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });
    res.status(200).json({
      status: 200,
      campaign,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cloudinary = require("cloudinary").v2;

// Delete Campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Extract public_id from the Cloudinary image URLs
    const extractPublicId = (url) => {
      const parts = url.split("/");
      return parts[parts.length - 1].split(".")[0]; // Extracts filename without extension
    };

    const desktopImageId = extractPublicId(campaign.desktopImage);
    const mobileImageId = extractPublicId(campaign.mobileImage);

    // Delete images from Cloudinary
    await cloudinary.uploader.destroy(`campaigns/${desktopImageId}`);
    await cloudinary.uploader.destroy(`campaigns/${mobileImageId}`);

    // Delete campaign from database
    await Campaign.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Campaign and images deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
