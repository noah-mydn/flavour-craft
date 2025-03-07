import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import { NavigationLink } from "../../styles/ContainerStyles";
import theme from "../../theme/theme";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selectors";
import { Favorite, Forum, Home, LocalDining } from "@mui/icons-material";

const TopNavigationBar = () => {
  const user = useSelector(userSelector);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const showUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const hideUserMenu = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (state) => () => {
    setDrawerOpen(state);
  };

  const NavTabs = [
    { label: "Home", link: "/home", icon: <Home /> },
    { label: "Recipes", link: "/recipes", icon: <LocalDining /> },
    { label: "Favourites", link: "/favourites", icon: <Favorite /> },
    { label: "Community", link: "/forum", icon: <Forum /> },
  ];

  return (
    <>
      <AppBar
        elevation={0}
        position="fixed"
        sx={{ zIndex: 99, background: "#faf8f5" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon color="primary" />
            </IconButton>
          )}

          {/* Logo */}
          <Box display="flex" justifyContent="center">
            <img src="./logo.png" alt="Logo" width={130} height={60} />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box display="flex" gap={2} justifyContent="flex-end">
              {NavTabs.map((nav) => (
                <NavigationLink
                  key={nav.link}
                  mx={2}
                  color="primary"
                  fontWeight="bolder"
                  href={nav.link}
                >
                  {nav.label}
                </NavigationLink>
              ))}
            </Box>
          )}

          {/* User Profile Avatar */}
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Tooltip title={user?.firstName}>
              <Avatar
                sx={{ bgcolor: theme.palette.primary.light, cursor: "pointer" }}
                src={user?.userImg}
                onClick={showUserMenu}
              />
            </Tooltip>
          </Box>
        </Box>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.default,
          },
        }}
      >
        <Box display="flex" justifyContent="center" py={2}>
          <img src="./logo.png" alt="Logo" width={130} height={60} />
        </Box>

        <Divider />
        <List sx={{ width: 250 }}>
          {NavTabs.map((nav) => (
            <ListItem
              button
              key={nav.link}
              component="a"
              href={nav.link}
              onClick={toggleDrawer(false)}
              sx={{
                "&:hover": { background: "transparent" },
              }}
            >
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: theme.palette.primary.light,
                    "& .MuiTypography-root": {
                      color: theme.palette.common.white,
                    },
                    "& .MuiSvgIcon-root": {
                      color: theme.palette.common.white,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: theme.palette.primary.main,
                  }}
                >
                  {nav.icon}
                </ListItemIcon>
                <ListItemText
                  primary={nav.label}
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* User Menu */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={hideUserMenu}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
      >
        <MenuItem>My Profile</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default TopNavigationBar;
