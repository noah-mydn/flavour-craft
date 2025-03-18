import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Stack,
  Typography,
  Autocomplete,
  Chip,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { AddAPhoto, Check, Close } from "@mui/icons-material";
import { useDispatch } from "react-redux";

const EditProfileDialog = ({ open, onClose, user }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.userImg || null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    // Not allowing email changes is also common, depends on your requirements
  });

  // For dietary restrictions and cuisine preferences
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] =
    useState(user?.dietaryRestrictions || []);
  const [selectedCuisinePreferences, setSelectedCuisinePreferences] = useState(
    user?.cuisinePreferences || []
  );

  // Sample data for dropdowns - replace with your actual data source
  const dietaryOptions = [
    { _id: "67d001043d88023d7040cf6f", name: "Gluten-Free" },
    { _id: "67d000e23d88023d7040ce1c", name: "Low-Sugar" },
    { _id: "67d001183d88023d7040d049", name: "Soy-Free" },
    { _id: "sample1", name: "Vegetarian" },
    { _id: "sample2", name: "Vegan" },
    { _id: "sample3", name: "Keto" },
    { _id: "sample4", name: "Dairy-Free" },
    { _id: "sample5", name: "Nut-Free" },
  ];

  const cuisineOptions = [
    { _id: "67cfff0c3191bb61ad097653", name: "Chinese" },
    { _id: "67cfff393191bb61ad0977ec", name: "Korean" },
    { _id: "sample6", name: "Italian" },
    { _id: "sample7", name: "Mexican" },
    { _id: "sample8", name: "Indian" },
    { _id: "sample9", name: "Thai" },
    { _id: "sample10", name: "Mediterranean" },
    { _id: "sample11", name: "Japanese" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    //setLoading(true);

    // Create FormData object for file upload
    const profileData = new FormData();

    // Append text fields
    profileData.append("firstName", formData.firstName);
    profileData.append("lastName", formData.lastName);
    profileData.append("email", formData.email);

    // Append image if changed
    if (imageFile) {
      profileData.append("userImg", imageFile);
    }

    // Append arrays as JSON strings (or use your preferred method)
    profileData.append(
      "dietaryRestrictions",
      JSON.stringify(selectedDietaryRestrictions)
    );
    profileData.append(
      "cuisinePreferences",
      JSON.stringify(selectedCuisinePreferences)
    );

    console.log(profileData);

    // try {
    //   // Dispatch update action (assuming it handles FormData correctly)
    //   await dispatch(updateUserProfile(profileData));
    //   onClose(true); // Close with success flag
    // } catch (error) {
    //   console.error("Error updating profile:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          pb: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight="bold">
            Edit Profile
          </Typography>
          <IconButton
            onClick={() => onClose(false)}
            sx={{ color: theme.palette.primary.contrastText }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Profile Image */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <Box sx={{ position: "relative", pt: 2 }}>
              <Avatar
                src={profileImage}
                alt={`${formData.firstName} ${formData.lastName}`}
                sx={{
                  width: 120,
                  height: 120,
                  border: `4px solid ${theme.palette.background.paper}`,
                }}
              />
              <IconButton
                component="label"
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  backgroundColor: theme.palette.background.paper,
                  "&:hover": {
                    backgroundColor: theme.palette.grey[200],
                  },
                }}
              >
                <AddAPhoto fontSize="small" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </IconButton>
            </Box>
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  type="email"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Dietary Restrictions */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Dietary Restrictions
            </Typography>
            <Autocomplete
              multiple
              id="dietary-restrictions"
              options={dietaryOptions}
              getOptionLabel={(option) => option.name}
              value={selectedDietaryRestrictions}
              onChange={(event, newValue) => {
                setSelectedDietaryRestrictions(newValue);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option._id}
                    label={option.name}
                    {...getTagProps({ index })}
                    sx={{
                      borderRadius: 15,
                      color: "#fff",
                      background: theme.palette.secondary.dark,
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select dietary restrictions"
                  fullWidth
                  margin="normal"
                />
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
          </Grid>

          {/* Cuisine Preferences */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Cuisine Preferences
            </Typography>
            <Autocomplete
              multiple
              id="cuisine-preferences"
              options={cuisineOptions}
              getOptionLabel={(option) => option.name}
              value={selectedCuisinePreferences}
              onChange={(event, newValue) => {
                setSelectedCuisinePreferences(newValue);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option._id}
                    label={option.name}
                    {...getTagProps({ index })}
                    sx={{
                      borderRadius: 15,
                      color: "#fff",
                      background: theme.palette.secondary.dark,
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select cuisine preferences"
                  fullWidth
                  margin="normal"
                />
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "flex-end" }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Check />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            background: theme.palette.primary.main,
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
