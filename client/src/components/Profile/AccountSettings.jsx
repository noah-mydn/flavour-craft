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
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Visibility,
  VisibilityOff,
  LockReset,
  DeleteForever,
} from "@mui/icons-material";
import useProfile from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";

const AccountSettingsDialog = ({ open, onClose, user }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabValue, setTabValue] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    confirmDeleteError,
    setConfirmDeleteError,
    loading,
    handleChangePassword,
    handlePasswordChange,
    deleteAccount,
    passwordData,
    email,
    setEmail,
  } = useProfile();

  const { accountLogout } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setMessage({ type: "", text: "" });
    setConfirmDeleteError("");
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword) {
      setMessage({ type: "error", text: "Current password is required" });
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
    handleChangePassword(onClose);
  };

  const accountDeleteSuccess = () => {
    setTimeout(() => {
      accountLogout();
    }, [1000]);
  };

  const handleDeleteAccount = async () => {
    deleteAccount(accountDeleteSuccess);
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose(false)}
      fullScreen={fullScreen}
      fullWidth="md"
    >
      <DialogTitle
        variant="h5"
        fontWeight="bold"
        sx={{ background: theme.palette.primary.main, color: "#fff" }}
      >
        Account Settings
      </DialogTitle>

      {/* Only show tabs if user is not admin */}
      {!isAdmin && (
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
      )}

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

        {/* Always show password change for admin users */}
        {(tabValue === 0 || isAdmin) && (
          <Stack spacing={3} sx={{ mt: isAdmin ? 3 : 1 }}>
            {isAdmin && (
              <Typography variant="subtitle1" fontWeight="bold">
                Update your password
              </Typography>
            )}

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
                        <Visibility />
                      ) : (
                        <VisibilityOff />
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
                      {showPassword.new ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              //helperText="Password must be at least 8 characters long "
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
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        )}

        {/* Only show delete account tab for non-admin users */}
        {tabValue === 1 && !isAdmin && (
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="warning">
              Warning: This action cannot be undone. Your account and all
              associated data will be permanently deleted.
            </Alert>

            <Typography variant="body2">
              To confirm, please enter your email address:{" "}
            </Typography>

            <TextField
              type="email"
              label="Confirm by typing your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
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

        {/* Show appropriate action button based on tab and role */}
        {tabValue === 0 || isAdmin ? (
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
