const Campaign = require("../models/Campaign");
const cloudinary = require("cloudinary").v2;
const isOverlapping = async (startDate, endDate, excludeId = null) => {
  const query = {
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) },
      },
    ],
  };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const overlapping = await Campaign.findOne(query);
  return overlapping;
};

// Create Campaign
exports.createCampaign = async (req, res) => {
  try {
    const { title, startDate, endDate, hashtag } = req.body;

    const overlapping = await isOverlapping(startDate, endDate);
    if (overlapping) {
      return res.status(400).json({
        message:
          "There is already an active campaign in the selected date range. Please choose different dates.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < today) {
      return res
        .status(400)
        .json({ message: "Start date cannot be in the past" });
    }

    if (end <= start) {
      return res.status(400).json({
        message: "End date must be at least one day after start date",
      });
    }

    const desktopImage = req.files["desktopImage"]?.[0]?.path;
    const mobileImage = req.files["mobileImage"]?.[0]?.path;

    if (!desktopImage || !mobileImage) {
      return res.status(400).json({ message: "Both images are required" });
    }

    const newCampaign = new Campaign({
      title,
      desktopImage,
      mobileImage,
      startDate,
      endDate,
      hashtag,
    });

    await newCampaign.save();
    res.status(201).json({
      status: 201,
      campaign: newCampaign,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Campaign
exports.updateCampaign = async (req, res) => {
  try {
    const { title, startDate, endDate, hashtag } = req.body;
    let updateData = { title, hashtag };

    if (startDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(startDate);

      if (start < today) {
        return res
          .status(400)
          .json({ message: "Start date cannot be in the past" });
      }
      updateData.startDate = startDate;
    }

    if (endDate) {
      const start = new Date(req.body.startDate || updateData.startDate);
      const end = new Date(endDate);

      if (end <= start) {
        return res.status(400).json({
          message: "End date must be at least one day after start date",
        });
      }
      updateData.endDate = endDate;
    }

    if (req.files["desktopImage"])
      updateData.desktopImage = req.files["desktopImage"][0].path;
    if (req.files["mobileImage"])
      updateData.mobileImage = req.files["mobileImage"][0].path;

    const currentCampaign = await Campaign.findById(req.params.id);
    if (!currentCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const newStartDate = startDate
      ? new Date(startDate)
      : currentCampaign.startDate;
    const newEndDate = endDate ? new Date(endDate) : currentCampaign.endDate;

    // Validate new range doesn't overlap others
    const overlapping = await isOverlapping(
      newStartDate,
      newEndDate,
      req.params.id
    );
    if (overlapping) {
      return res.status(400).json({
        message:
          "The updated campaign period overlaps with another existing campaign. Please edit or delete the conflicting campaign first.",
      });
    }

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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// Get Single Campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign)
      return res
        .status(404)
        .json({ status: 404, message: "Campaign not found" });
    res.status(200).json({
      status: 200,
      campaign,
    });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

// Delete Campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res
        .status(404)
        .json({ status: 404, message: "Campaign not found!" });
    }

    // Extract public_id from the Cloudinary image URLs
    const extractPublicId = (url) => {
      const parts = url.split("/");
      return parts[parts.length - 1].split(".")[0];
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
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Get Active Campaign
exports.getActiveCampaign = async (req, res) => {
  try {
    const now = new Date();

    const activeCampaign = await Campaign.findOne({
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (!activeCampaign) {
      return res
        .status(404)
        .json({ status: 404, message: "No active campaign found" });
    }

    res.status(200).json({
      status: 200,
      campaign: activeCampaign,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
