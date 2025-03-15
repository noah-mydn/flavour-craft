import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CardMedia,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CampaignIcon from "@mui/icons-material/Campaign";
import PageHeader from "../../components/Admin/PageHeader";

// Sample data for campaigns
const campaignData = [
  {
    id: 1,
    title: "Summer Grilling Recipes",
    description:
      "Discover the best BBQ and grilling recipes for your summer gatherings",
    status: "Active",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    imageUrl: "/api/placeholder/800/400",
  },
  {
    id: 2,
    title: "Healthy New Year",
    description: "Start the year with healthy, nutritious recipes",
    status: "Scheduled",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    imageUrl: "/api/placeholder/800/400",
  },
  {
    id: 3,
    title: "Fall Comfort Food",
    description: "Warm, hearty recipes for the fall season",
    status: "Inactive",
    startDate: "2024-09-01",
    endDate: "2024-11-30",
    imageUrl: "/api/placeholder/800/400",
  },
];

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState(campaignData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    status: "Scheduled",
    startDate: "",
    endDate: "",
    imageUrl: "/api/placeholder/800/400",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleAddCampaign = () => {
    setDialogOpen(true);
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setEditDialogOpen(true);
  };

  const handleDeleteCampaign = (id) => {
    setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
  };

  const handleSaveCampaign = () => {
    // Add new campaign
    if (newCampaign.title && newCampaign.startDate && newCampaign.endDate) {
      const newId =
        campaigns.length > 0 ? Math.max(...campaigns.map((c) => c.id)) + 1 : 1;
      setCampaigns([...campaigns, { id: newId, ...newCampaign }]);
      setNewCampaign({
        title: "",
        description: "",
        status: "Scheduled",
        startDate: "",
        endDate: "",
        imageUrl: "/api/placeholder/800/400",
      });
      setDialogOpen(false);
    }
  };

  const handleUpdateCampaign = () => {
    if (selectedCampaign) {
      setCampaigns(
        campaigns.map((campaign) =>
          campaign.id === selectedCampaign.id ? selectedCampaign : campaign
        )
      );
      setEditDialogOpen(false);
      setSelectedCampaign(null);
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Scheduled":
        return "info";
      case "Inactive":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <PageHeader
        title="Campaign Manager"
        description="Manage featured campaigns for the home page"
        buttonText="Add Campaign"
        buttonIcon={<AddIcon />}
        onButtonClick={handleAddCampaign}
      />

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} lg={4} key={campaign.id}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={campaign.imageUrl}
                alt={campaign.title}
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6">{campaign.title}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: `${getStatusColor(campaign.status)}.light`,
                      color: `${getStatusColor(campaign.status)}.main`,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {campaign.status}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {campaign.description}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  {campaign.startDate} to {campaign.endDate}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditCampaign(campaign)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Campaign Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Campaign</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Campaign Title"
                value={newCampaign.title}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, title: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={newCampaign.description}
                onChange={(e) =>
                  setNewCampaign({
                    ...newCampaign,
                    description: e.target.value,
                  })
                }
                margin="normal"
                multiline
                rows={4}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={newCampaign.status}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      startDate: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, endDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Campaign Image
              </Typography>
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 1,
                  p: 2,
                  textAlign: "center",
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundImage: imagePreview
                    ? `url(${imagePreview})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!imagePreview && (
                  <>
                    <CampaignIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Drag and drop an image here or
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Browse Files
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </>
                )}
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                Recommended size: 1200x600 pixels. Max file size: 2MB
              </Typography>
              {imagePreview && (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => setImagePreview(null)}
                  sx={{ mt: 2 }}
                >
                  Remove Image
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveCampaign}
            disabled={
              !newCampaign.title ||
              !newCampaign.startDate ||
              !newCampaign.endDate
            }
          >
            Save Campaign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCampaign && (
          <>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Campaign Title"
                    value={selectedCampaign.title}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        title: e.target.value,
                      })
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={selectedCampaign.description}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        description: e.target.value,
                      })
                    }
                    margin="normal"
                    multiline
                    rows={4}
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedCampaign.status}
                      onChange={(e) =>
                        setSelectedCampaign({
                          ...selectedCampaign,
                          status: e.target.value,
                        })
                      }
                      label="Status"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Scheduled">Scheduled</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <TextField
                      label="Start Date"
                      type="date"
                      value={selectedCampaign.startDate}
                      onChange={(e) =>
                        setSelectedCampaign({
                          ...selectedCampaign,
                          startDate: e.target.value,
                        })
                      }
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                    <TextField
                      label="End Date"
                      type="date"
                      value={selectedCampaign.endDate}
                      onChange={(e) =>
                        setSelectedCampaign({
                          ...selectedCampaign,
                          endDate: e.target.value,
                        })
                      }
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Campaign Image
                  </Typography>
                  <CardMedia
                    component="img"
                    image={selectedCampaign.imageUrl}
                    alt={selectedCampaign.title}
                    sx={{ height: 200, borderRadius: 1, mb: 2 }}
                  />
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    startIcon={<EditIcon />}
                  >
                    Change Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateCampaign}
              >
                Update Campaign
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CampaignManager;
