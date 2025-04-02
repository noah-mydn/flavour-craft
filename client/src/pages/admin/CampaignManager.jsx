import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Tooltip,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  Title as TitleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useCampaign } from "../../hooks/admin/useCampaign";
import PageHeader from "../../components/Admin/PageHeader";
import { DetailCard } from "../../styles/ContainerStyles";
import theme from "../../theme/theme";

const CampaignManagement = () => {
  const {
    campaign,
    campaigns,
    loading,
    error,
    openDialog,
    deleteConfirmOpen,
    campaignToDelete,
    mode,
    setOpenDialog,
    handleInputChange,
    handleFileInput,
    handleSubmit,
    fetchCampaigns,
    setupEditCampaign,
    setupCreateCampaign,
    resetForm,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete,
  } = useCampaign();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = today.toISOString().split("T")[0];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Campaign Management"
        description="Create Campaign Banners"
      />
      <Box
        display="flex"
        justifyContent={{ xs: "center", sm: "flex-end" }}
        my={2}
      >
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchCampaigns}
          sx={{ mr: 2 }}
        >
          Refresh
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={setupCreateCampaign}
        >
          New Campaign
        </Button>
      </Box>

      {/* {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )} */}

      {loading && !openDialog ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : campaigns.length === 0 ? (
        <DetailCard
          sx={{ p: 4, textAlign: "center", mt: 4, border: "1px solid #ddd" }}
        >
          <Typography variant="h6" color="textSecondary">
            No campaigns found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Create a new campaign to get started
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={setupCreateCampaign}
            sx={{ mt: 2 }}
          >
            Create Campaign
          </Button>
        </DetailCard>
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((camp) => (
            <Grid item xs={12} md={6} lg={4} key={camp._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                  borderRadius: 2,
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    camp.desktopImage ||
                    "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  alt={camp.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {camp.title}
                  </Typography>

                  <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                    <DateRangeIcon
                      color="action"
                      sx={{ mr: 1, fontSize: 20 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(camp.startDate)} - {formatDate(camp.endDate)}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={
                        new Date(camp.endDate) > new Date()
                          ? "Active"
                          : "Expired"
                      }
                      color={
                        new Date(camp.endDate) > new Date()
                          ? "success"
                          : "error"
                      }
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Tooltip title="Edit Campaign">
                      <IconButton
                        onClick={() => setupEditCampaign(camp)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Campaign">
                      <IconButton
                        onClick={() => openDeleteConfirmation(camp._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog for creating or editing a campaign */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {mode === "create" ? "Create New Campaign" : "Edit Campaign"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} mb={2}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="title"
                  label="Campaign Title"
                  value={campaign.title}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  name="startDate"
                  label="Start Date"
                  value={campaign.startDate}
                  onChange={handleInputChange}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      inputProps: {
                        min: minDate,
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRangeIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  name="endDate"
                  label="End Date"
                  value={campaign.endDate}
                  onChange={handleInputChange}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      inputProps: {
                        min: minDate,
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRangeIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Desktop Image
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="desktop-image-upload"
                    type="file"
                    onChange={(e) => handleFileInput(e, "desktopImage")}
                  />
                  <label htmlFor="desktop-image-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      Choose Desktop Image
                    </Button>
                  </label>
                </Box>
                {typeof campaign.desktopImage === "string" &&
                  campaign.desktopImage && (
                    <Box sx={{ mt: 2, position: "relative" }}>
                      <img
                        src={campaign.desktopImage}
                        alt="Desktop Preview"
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </Box>
                  )}
                {campaign.desktopImage instanceof File && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      Selected file: {campaign.desktopImage.name}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Mobile Image
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="mobile-image-upload"
                    type="file"
                    onChange={(e) => handleFileInput(e, "mobileImage")}
                  />
                  <label htmlFor="mobile-image-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      Choose Mobile Image
                    </Button>
                  </label>
                </Box>
                {typeof campaign.mobileImage === "string" &&
                  campaign.mobileImage && (
                    <Box sx={{ mt: 2, position: "relative" }}>
                      <img
                        src={campaign.mobileImage}
                        alt="Mobile Preview"
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </Box>
                  )}
                {campaign.mobileImage instanceof File && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      Selected file: {campaign.mobileImage.name}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              variant="outlined"
              onClick={resetForm}
              color="primary"
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: theme.palette.secondary.dark }}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} />
                ) : mode === "create" ? (
                  <AddIcon />
                ) : (
                  <EditIcon />
                )
              }
            >
              {mode === "create" ? "Create Campaign" : "Update Campaign"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete Campaign"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this campaign? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CampaignManagement;
