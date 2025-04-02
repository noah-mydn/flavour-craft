import React, { useState, useEffect } from "react";
import axios from "axios";
import { displayErrorToast, displaySuccessToast } from "../../utils/toastUtil";
import { getAuthConfig } from "../../utils/authHeaders";

export const useCampaign = () => {
  const [campaign, setCampaign] = useState({
    title: "",
    desktopImage: "",
    mobileImage: "",
    startDate: "",
    endDate: "",
  });
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [mode, setMode] = useState("create"); // "create" or "edit"

  const BASE_URL = process.env.REACT_APP_BASE_API + "/campaign";

  // Fetch all campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL, getAuthConfig());
      setCampaigns(response.data.campaigns || []);
    } catch (err) {
      displayErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new campaign
  const createCampaign = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", campaign.title);
    formData.append("desktopImage", campaign.desktopImage);
    formData.append("mobileImage", campaign.mobileImage);
    formData.append("startDate", campaign.startDate);
    formData.append("endDate", campaign.endDate);

    try {
      const response = await axios.post(
        BASE_URL,
        formData,
        getAuthConfig(true)
      );
      setCampaigns([...campaigns, response.data.campaign]);
      displaySuccessToast("New Campaign Created!");
      resetForm();

      return response.data.campaign;
    } catch (err) {
      setError(err.response.data.error);
      //displayErrorToast(error);
      //setOpenDialog(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing campaign
  const updateCampaign = async (id) => {
    const formData = new FormData();
    formData.append("title", campaign.title);
    formData.append("desktopImage", campaign.desktopImage);
    formData.append("mobileImage", campaign.mobileImage);
    formData.append("startDate", campaign.startDate);
    formData.append("endDate", campaign.endDate);

    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/${id}`,
        formData,
        getAuthConfig(true)
      );
      setCampaigns(
        campaigns.map((c) => (c._id === id ? response.data.campaign : c))
      );
      displaySuccessToast("Campaign Info edited!");
      resetForm();
      return response.data.campaign;
    } catch (err) {
      //displayErrorToast(error);
      setError(err.response.data.error);
      //setOpenDialog(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a campaign
  const deleteCampaign = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/${id}`, getAuthConfig());
      setCampaigns(campaigns.filter((c) => c._id !== id));
      setDeleteConfirmOpen(false);
      setCampaignToDelete(null);
      return true;
    } catch (err) {
      displayErrorToast(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get a single campaign by ID
  const getCampaignById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/${id}`, getAuthConfig());
      return response.data.campaign;
    } catch (err) {
      displayErrorToast(error);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaign({ ...campaign, [name]: value });
  };

  // Handle file inputs directly
  const handleFileInput = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const fieldValue = {
      ...campaign,
      [fieldName]: file,
    };
    console.log(fieldValue);
    setCampaign(fieldValue);
  };

  // Reset form
  const resetForm = () => {
    setCampaign({
      title: "",
      desktopImage: "",
      mobileImage: "",
      startDate: "",
      endDate: "",
    });
    setSelectedCampaign(null);
    setMode("create");
    setOpenDialog(false);
  };

  // Open delete confirmation
  const openDeleteConfirmation = (id) => {
    setCampaignToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation
  const closeDeleteConfirmation = () => {
    setDeleteConfirmOpen(false);
    setCampaignToDelete(null);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (campaignToDelete) {
      await deleteCampaign(campaignToDelete);
    }
  };

  // Edit campaign setup
  const setupEditCampaign = (campaignData) => {
    setCampaign({
      title: campaignData.title,
      desktopImage: campaignData.desktopImage,
      mobileImage: campaignData.mobileImage,
      startDate: campaignData.startDate
        ? campaignData.startDate.split("T")[0]
        : "",
      endDate: campaignData.endDate ? campaignData.endDate.split("T")[0] : "",
    });
    setSelectedCampaign(campaignData._id);
    setMode("edit");
    setOpenDialog(true);
  };

  // Setup create campaign
  const setupCreateCampaign = () => {
    resetForm();
    setMode("create");
    setOpenDialog(true);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "create") {
      await createCampaign();
    } else {
      await updateCampaign(selectedCampaign);
    }
  };

  // Load campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaign,
    campaigns,
    loading,
    error,
    openDialog,
    deleteConfirmOpen,
    campaignToDelete,
    mode,
    selectedCampaign,
    setOpenDialog,
    handleInputChange,
    handleFileInput,
    handleSubmit,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    fetchCampaigns,
    getCampaignById,
    setupEditCampaign,
    setupCreateCampaign,
    resetForm,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete,
  };
};
