import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import EditProfileDialog from "../Profile/EditProfileDialog";
import AccountSettingsDialog from "../Profile/AccountSettings";
import { useDispatch, useSelector } from "react-redux";
import { profileSelector } from "../../redux/selectors/selectors";
import { logout } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ onMenuClick }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = React.useState(false);
  const user = useSelector(profileSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accountLogout = () => {
    dispatch(logout());
    navigate("/auth", { replace: true });
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewProfile = () => {
    setProfileOpen(true);
    handleMenuClose();
  };

  const handleLogout = () => {
    console.log("Logging out...");
    accountLogout();
  };

  const handleAccountSettings = () => {
    setAccountSettingsOpen(true);
    handleMenuClose();
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* <Tooltip title="Notifications">
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Tooltip> */}
            <Tooltip title={`${user?.firstName} ${user?.lastName}`}>
              <Avatar
                src={user?.userImg}
                alt={`${user?.firstName} ${user?.lastName}`}
                sx={{
                  ml: 2,
                  cursor: "pointer",
                  bgcolor: theme.palette.primary.main,
                }}
                onClick={handleAvatarClick}
              >
                {user?.firstName.charAt(0)}
              </Avatar>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
              <MenuItem onClick={handleAccountSettings}>
                Account Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <EditProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
      />

      <AccountSettingsDialog
        open={accountSettingsOpen}
        onClose={() => setAccountSettingsOpen(false)}
        user={user}
      />
    </>
  );
};

export default AdminHeader;
