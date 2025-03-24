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
  useMediaQuery,
} from "@mui/material";
import { AddAPhoto, Check, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  cuisinesSelector,
  dietaryOptionsSelector,
} from "../../redux/selectors/selectors";
import { fetchCuisines } from "../../redux/apiClients/cuisineAPI";
import { fetchDietaryOptions } from "../../redux/apiClients/dietaryAPI";
import useProfile from "../../hooks/useProfile";

const EditProfileDialog = ({ open, onClose, user }) => {
  const {
    profileData,
    profileImage,
    loading,
    handleInputChange,
    handleAutocompleteChange,
    handleImageChange,
    handleSubmit,
  } = useProfile(user);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const cuisines = useSelector(cuisinesSelector);
  const dietaryOptions = useSelector(dietaryOptionsSelector);

  React.useEffect(() => {
    dispatch(fetchCuisines());
    dispatch(fetchDietaryOptions());
  }, []);

  const editUserProfile = () => {
    handleSubmit(() => onClose(false));
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      fullWidth
      fullScreen={fullScreen}
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
                alt={`${profileData.firstName} ${profileData.lastName}`}
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
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={profileData.lastName}
                  size="small"
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
                  value={profileData.email}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  disabled
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
              size="small"
              multiple
              id="dietary-restrictions"
              options={dietaryOptions}
              getOptionLabel={(option) => option.name}
              value={profileData?.dietaryRestrictions}
              onChange={(event, newValue) =>
                handleAutocompleteChange("dietaryRestrictions", newValue)
              }
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option._id}
                    label={option.name}
                    {...getTagProps({ index })}
                    sx={{
                      "& .MuiChip-deleteIcon": {
                        color: "#fff",
                      },
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
                  placeholder={
                    profileData?.dietaryRestrictions.length === 0
                      ? "Select dietary restrictions"
                      : ""
                  }
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
              size="small"
              multiple
              id="cuisine-preferences"
              options={cuisines}
              getOptionLabel={(option) => option.name}
              value={profileData?.cuisinePreferences}
              onChange={(event, newValue) =>
                handleAutocompleteChange("cuisinePreferences", newValue)
              }
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option._id}
                    label={option.name}
                    {...getTagProps({ index })}
                    sx={{
                      "& .MuiChip-deleteIcon": {
                        color: "#fff",
                      },
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
                  placeholder={
                    profileData?.cuisinePreferences?.length === 0
                      ? "Select dietary restrictions"
                      : ""
                  }
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
          onClick={editUserProfile}
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
