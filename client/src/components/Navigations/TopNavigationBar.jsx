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
  Popper,
  Paper,
  TextField,
  Tooltip,
  useMediaQuery,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState, useRef } from "react";
import {
  NavigationLink,
  NavigationListItemBtn,
} from "../../styles/ContainerStyles";
import theme from "../../theme/theme";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selectors";
import {
  Favorite,
  Forum,
  Home,
  LocalDining,
  Search,
  ExpandMore,
  ExpandLess,
  ChevronRight,
  ArrowBack,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";

const TopNavigationBar = () => {
  const user = useSelector(userSelector);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for hover menus
  const [recipeMenuOpen, setRecipeMenuOpen] = useState(false);
  const [recipeMenuAnchorEl, setRecipeMenuAnchorEl] = useState(null);
  const [cuisineMenuOpen, setCuisineMenuOpen] = useState(false);
  const [cuisineMenuAnchorEl, setCuisineMenuAnchorEl] = useState(null);

  // State for mobile menu navigation
  const [mobileMenuLevel, setMobileMenuLevel] = useState("main"); // 'main', 'recipes', 'cuisines'
  const [mobileMenuTitle, setMobileMenuTitle] = useState("Main Menu");

  const accountLogout = () => {
    dispatch(logout());
  };

  const cuisineTypes = [
    "Italian",
    "Chinese",
    "Indian",
    "Mexican",
    "Japanese",
    "Thai",
    "Mediterranean",
    "French",
  ];

  const recipeSubMenuItems = [
    { label: "All Recipes", link: "/recipes" },
    { label: "Generate Recipes", link: "/generate" },
    { label: "Recipes by Cuisine", link: "/recipes/cuisine", hasSubmenu: true },
  ];

  const showUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const hideUserMenu = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (state) => () => {
    if (!state) {
      // Reset to main menu when drawer is closed
      setMobileMenuLevel("main");
      setMobileMenuTitle("Menu");
    }
    setDrawerOpen(state);
  };

  const handleRecipeHover = (event) => {
    setRecipeMenuAnchorEl(event.currentTarget);
    setRecipeMenuOpen(true);
  };

  const handleCuisineHover = (event) => {
    setCuisineMenuAnchorEl(event.currentTarget);
    setCuisineMenuOpen(true);
  };

  const handleRecipeLeave = () => {
    setRecipeMenuOpen(false);
  };

  const handleCuisineLeave = () => {
    setCuisineMenuOpen(false);
  };

  const navigateToRecipeMenu = () => {
    setMobileMenuLevel("recipes");
    setMobileMenuTitle("Recipes");
  };

  const navigateToCuisineMenu = () => {
    setMobileMenuLevel("cuisines");
    setMobileMenuTitle("Recipes by Cuisine");
  };

  const navigateBack = () => {
    if (mobileMenuLevel === "cuisines") {
      setMobileMenuLevel("recipes");
      setMobileMenuTitle("Recipes");
    } else if (mobileMenuLevel === "recipes") {
      setMobileMenuLevel("main");
      setMobileMenuTitle("Main Menu");
    }
  };

  const NavTabs = [
    { label: "Home", link: "/home", icon: <Home /> },
    {
      label: "Recipes",
      link: "/recipes",
      icon: <LocalDining />,
      hasSubmenu: true,
    },
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
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon color="primary" />
              </IconButton>

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
                <Box
                  key={nav.link}
                  onMouseEnter={nav.hasSubmenu ? handleRecipeHover : null}
                  onMouseLeave={nav.hasSubmenu ? handleRecipeLeave : null}
                  sx={{ position: "relative" }}
                >
                  <NavigationLink
                    mx={2}
                    color="primary"
                    fontWeight="bolder"
                    href={nav.link}
                  >
                    {nav.label}
                  </NavigationLink>

                  {/* Recipe Submenu for Desktop */}
                  {nav.hasSubmenu && recipeMenuOpen && (
                    <Popper
                      open={recipeMenuOpen}
                      anchorEl={recipeMenuAnchorEl}
                      placement="bottom-start"
                      sx={{ zIndex: 1300 }}
                    >
                      <Paper
                        elevation={3}
                        sx={{
                          mt: 1,
                          width: 200,
                          bgcolor: theme.palette.background.default,
                        }}
                      >
                        <List>
                          {recipeSubMenuItems.map((item) => (
                            <Box
                              key={item.link}
                              onMouseEnter={
                                item.hasSubmenu ? handleCuisineHover : null
                              }
                              onMouseLeave={
                                item.hasSubmenu ? handleCuisineLeave : null
                              }
                            >
                              <ListItem
                                component="a"
                                href={item.link}
                                sx={{
                                  textDecoration: "none",
                                  color: theme.palette.secondary.dark,
                                  "&:hover": {
                                    bgcolor: theme.palette.primary.light,
                                    color: theme.palette.common.white,
                                  },
                                }}
                              >
                                <ListItemText primary={item.label} />
                                {item.hasSubmenu && <ChevronRight />}
                              </ListItem>

                              {/* Cuisine Submenu for Desktop */}
                              {item.hasSubmenu && cuisineMenuOpen && (
                                <Popper
                                  open={cuisineMenuOpen}
                                  anchorEl={cuisineMenuAnchorEl}
                                  placement="right-start"
                                  sx={{ zIndex: 1301 }}
                                >
                                  <Paper
                                    elevation={3}
                                    sx={{
                                      ml: 1,
                                      width: 200,
                                      bgcolor: theme.palette.background.default,
                                    }}
                                  >
                                    <List>
                                      {cuisineTypes.map((cuisine) => (
                                        <ListItem
                                          key={cuisine}
                                          component="a"
                                          href={`/recipes/cuisine/${cuisine.toLowerCase()}`}
                                          sx={{
                                            textDecoration: "none",
                                            color: theme.palette.secondary.dark,
                                            "&:hover": {
                                              bgcolor:
                                                theme.palette.primary.light,
                                              color: theme.palette.common.white,
                                            },
                                          }}
                                        >
                                          <ListItemText primary={cuisine} />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Paper>
                                </Popper>
                              )}
                            </Box>
                          ))}
                        </List>
                      </Paper>
                    </Popper>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Search Bar */}
          {!isMobile && (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
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

      {/* Mobile Drawer with Menu Levels */}
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

        {/* Drawer Header with Back Button */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={2}
          py={1}
          sx={{
            bgcolor: theme.palette.secondary.main,
            color: "white",
          }}
        >
          {mobileMenuLevel !== "main" && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={navigateBack}
              sx={{ mr: 1 }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h6" component="div" textAlign="center">
            {mobileMenuTitle}
          </Typography>
        </Box>

        <Divider />

        {/* Main Menu */}
        {mobileMenuLevel === "main" && (
          <List sx={{ width: 250 }}>
            {NavTabs.map((nav) => (
              <ListItem
                key={nav.link}
                sx={{
                  "&:hover": { background: "transparent" },
                  px: 1,
                }}
              >
                {nav.hasSubmenu ? (
                  <ListItemButton
                    onClick={navigateToRecipeMenu}
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
                        color: theme.palette.secondary.dark,
                      }}
                    >
                      {nav.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={nav.label}
                      sx={{
                        color: theme.palette.secondary.dark,
                        fontWeight: "bold",
                      }}
                    />
                    <ChevronRight />
                  </ListItemButton>
                ) : (
                  <ListItemButton
                    component="a"
                    href={nav.link}
                    onClick={toggleDrawer(false)}
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
                        color: theme.palette.secondary.dark,
                      }}
                    >
                      {nav.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={nav.label}
                      sx={{
                        color: theme.palette.secondary.dark,
                        fontWeight: "bold",
                      }}
                    />
                  </ListItemButton>
                )}
              </ListItem>
            ))}
          </List>
        )}

        {/* Recipes Submenu */}
        {mobileMenuLevel === "recipes" && (
          <List sx={{ width: 250 }}>
            {recipeSubMenuItems.map((item) => (
              <ListItem
                key={item.link}
                sx={{
                  "&:hover": { background: "transparent" },
                  px: 1,
                }}
              >
                {item.hasSubmenu ? (
                  <ListItemButton
                    onClick={navigateToCuisineMenu}
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
                    <ListItemText
                      primary={item.label}
                      sx={{
                        color: theme.palette.secondary.dark,
                        fontWeight: "bold",
                      }}
                    />
                    <ChevronRight />
                  </ListItemButton>
                ) : (
                  <ListItemButton
                    component="a"
                    href={item.link}
                    onClick={toggleDrawer(false)}
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
                    <ListItemText
                      primary={item.label}
                      sx={{
                        color: theme.palette.secondary.dark,
                        fontWeight: "bold",
                      }}
                    />
                  </ListItemButton>
                )}
              </ListItem>
            ))}
          </List>
        )}

        {/* Cuisines Submenu */}
        {mobileMenuLevel === "cuisines" && (
          <List sx={{ width: 250 }}>
            {cuisineTypes.map((cuisine) => (
              <ListItem
                key={cuisine}
                sx={{
                  "&:hover": { background: "transparent" },
                  px: 1,
                }}
              >
                <ListItemButton
                  component="a"
                  href={`/recipes/cuisine/${cuisine.toLowerCase()}`}
                  onClick={toggleDrawer(false)}
                  sx={{
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: theme.palette.primary.light,
                      "& .MuiTypography-root": {
                        color: theme.palette.common.white,
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={cuisine}
                    sx={{
                      color: theme.palette.secondary.dark,
                      fontWeight: "bold",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>

      {/* User Menu */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={hideUserMenu}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
      >
        <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
        <MenuItem onClick={accountLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default TopNavigationBar;
