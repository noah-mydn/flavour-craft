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
  TextField,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import { NavigationLink } from "../../styles/ContainerStyles";
import theme from "../../theme/theme";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selectors";
import {
  Favorite,
  Forum,
  Home,
  LocalDining,
  Search,
} from "@mui/icons-material";

const TopNavigationBar = () => {
  const user = useSelector(userSelector);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
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
        sx={{
          zIndex: 99,
          pb: isMobile ? 1 : 0,
          //background: theme.palette.info.light,
          // background: "#faf8f5"
          background: "linear-gradient(to left, #F5E1C8, #FFFFFF)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          {isTablet && !isMobile && (
            <Box display="flex" gap={1}>
              {/* Mobile Menu Button */}

              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon color="primary" />
              </IconButton>

              {/* Logo */}

              <Box display="flex" justifyContent="center">
                <img src="../logo.png" alt="Logo" width={130} height={60} />
              </Box>
            </Box>
          )}
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
          {(isMobile || isDesktop) && (
            <Box display="flex" justifyContent="center">
              <img src="../logo.png" alt="Logo" width={130} height={60} />
            </Box>
          )}
          {/* Desktop Navigation */}
          {isDesktop && (
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

          {/* Search Bar */}

          {!isMobile && (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              //value={searchQuery}
              //onChange={handleSearchChange}
              sx={{
                width: isMobile ? 250 : 350,
                bgcolor: "transparent",

                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.secondary.dark,
                    borderRadius: 20,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary.main,
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <Search
                      sx={{ color: theme.palette.secondary.dark, mr: 1 }}
                    />
                  ),
                },
              }}
            />
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
        <Box display="flex" justifyContent="center" alignItems="center">
          {isMobile && (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              //value={searchQuery}
              //onChange={handleSearchChange}
              sx={{
                width: 350,
                bgcolor: "transparent",

                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.secondary.dark,
                    borderRadius: 20,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary.main,
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <Search
                      sx={{ color: theme.palette.secondary.dark, mr: 1 }}
                    />
                  ),
                },
              }}
            />
          )}
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
          <img src="../logo.png" alt="Logo" width={130} height={60} />
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
