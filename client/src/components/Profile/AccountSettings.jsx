import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Divider,
  Alert,
  Box,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Visibility,
  VisibilityOff,
  LockReset,
  DeleteForever,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
// Import these functions from your API client file
// import { updatePassword, deleteAccount } from '../redux/apiClients/userAPI';

const AccountSettingsDialog = ({ open, onClose, user }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account state
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [confirmDeleteError, setConfirmDeleteError] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset messages and errors when changing tabs
    setMessage({ type: "", text: "" });
    setConfirmDeleteError("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = async () => {
    // Validation
    if (!passwordData.currentPassword) {
      setMessage({ type: "error", text: "Current password is required" });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "New password must be at least 8 characters long",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      setLoading(true);

      // Simulate API call success for now
      setTimeout(() => {
        setMessage({ type: "success", text: "Password updated successfully" });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update password",
      });
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== password) {
      setConfirmDeleteError(
        "Please enter your password to confirm account deletion"
      );
      return;
    }

    try {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        onClose(true);
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete account",
      });
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        variant="h5"
        fontWeight="bold"
        sx={{ background: theme.palette.primary.main, color: "#fff" }}
      >
        Account Settings
      </DialogTitle>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab
          icon={<LockReset fontSize="small" />}
          iconPosition="start"
          label="Change Password"
        />
        <Tab
          icon={<DeleteForever fontSize="small" />}
          iconPosition="start"
          label="Delete Account"
        />
      </Tabs>

      <DialogContent>
        {message.text && (
          <Alert
            severity={message.type}
            sx={{ mb: 2 }}
            onClose={() => setMessage({ type: "", text: "" })}
          >
            {message.text}
          </Alert>
        )}

        {tabValue === 0 && (
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Update your password
            </Typography>

            <TextField
              label="Current Password"
              name="currentPassword"
              type={showPassword.current ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility("current")}
                      edge="end"
                    >
                      {showPassword.current ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="New Password"
              name="newPassword"
              type={showPassword.new ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility("new")}
                      edge="end"
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Password must be at least 8 characters long"
            />

            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type={showPassword.confirm ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility("confirm")}
                      edge="end"
                    >
                      {showPassword.confirm ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        )}

        {tabValue === 1 && (
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="warning">
              Warning: This action cannot be undone. Your account and all
              associated data will be permanently deleted.
            </Alert>

            <Typography variant="body2">
              To confirm, please enter your password:{" "}
            </Typography>

            <TextField
              label="Confirm by typing your password"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              fullWidth
              variant="outlined"
              error={!!confirmDeleteError}
              helperText={confirmDeleteError}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={() => onClose(false)}
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>

        {tabValue === 0 ? (
          <LoadingButton
            onClick={handleUpdatePassword}
            loading={loading}
            variant="contained"
            sx={{ background: theme.palette.secondary.dark }}
          >
            Update Password
          </LoadingButton>
        ) : (
          <LoadingButton
            onClick={handleDeleteAccount}
            loading={loading}
            variant="contained"
            color="primary"
          >
            Delete Account
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AccountSettingsDialog;
