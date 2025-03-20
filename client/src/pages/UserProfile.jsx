import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import {
  Edit,
  Restaurant,
  Bookmark,
  Create,
  Settings,
  GridView,
  Add,
  FoodBank,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { profileSelector } from "../redux/selectors/selectors";

import { Link, useNavigate } from "react-router-dom";
import EditProfileDialog from "../components/Profile/EditProfileDialog";
import { getCurrentUserProfile } from "../redux/apiClients/userAPI";

const UserProfile = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(profileSelector);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = React.useState(0);
  const [editProfileOpen, setEditProfileOpen] = React.useState(false);

  React.useEffect(() => {
    dispatch(getCurrentUserProfile());
    console.log(user);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEditProfileClose = (refreshData) => {
    setEditProfileOpen(false);
    if (refreshData) {
      dispatch(getCurrentUserProfile());
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ marginTop: "5rem" }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Profile Header */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: theme.palette.primary.light,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Background accent */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 80,
                    background: theme.palette.primary.light,

                    zIndex: 0,
                  }}
                />

                <Stack
                  direction={isMobile ? "column" : "row"}
                  spacing={4}
                  alignItems="center"
                  sx={{
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={user?.userImg}
                      alt={`${user?.firstName} ${user?.lastName}`}
                      sx={{
                        width: 110,
                        height: 110,
                        border: `4px solid ${theme.palette.background.paper}`,
                        mt: isMobile ? 4 : 2,
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      mt: isMobile ? 2 : 0,
                      flex: 1,
                      textAlign: isMobile ? "center" : "left",
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      fontFamily={theme.typography.fontFamily[1]}
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      {user?.firstName} {user?.lastName}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ mt: 1, color: "#eeefef" }}
                    >
                      {user?.email}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ mt: 0.5, color: "#eeefef" }}
                    >
                      Member since {formatDate(user?.createdAt)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditProfileOpen(true)}
                    sx={{
                      borderRadius: 2,
                      mt: isMobile ? 2 : 0,
                      textTransform: "none",
                      background: theme.palette.secondary.dark,
                    }}
                  >
                    Edit Profile
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Tab
                    icon={<GridView fontSize="small" />}
                    iconPosition="start"
                    label="Overview"
                    sx={{ textTransform: "none" }}
                  />
                  <Tab
                    icon={<Restaurant fontSize="small" />}
                    iconPosition="start"
                    label="My Recipes"
                    sx={{ textTransform: "none" }}
                  />
                  <Tab
                    icon={<Bookmark fontSize="small" />}
                    iconPosition="start"
                    label="Saved"
                    sx={{ textTransform: "none" }}
                  />
                </Tabs>

                <Box sx={{ p: 4 }}>
                  {tabValue === 0 && (
                    <Stack spacing={4}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Cuisine Preferences
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          {user?.cuisinePreferences?.length > 0 ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                mt: 1,
                              }}
                            >
                              {user?.cuisinePreferences?.map(
                                (cuisine, index) => (
                                  <Chip
                                    key={cuisine?._id}
                                    label={cuisine?.name}
                                    //color="primary"
                                    //variant="outlined"
                                    sx={{
                                      borderRadius: 15,
                                      color: "#fff",
                                      background: theme.palette.secondary.dark,
                                    }}
                                  />
                                )
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No cuisines preferences is set.
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Dietary Restrictions
                        </Typography>
                        {user?.dietaryRestrictions?.length > 0 ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              mt: 1,
                            }}
                          >
                            {user?.dietaryRestrictions?.map((diet, index) => (
                              <Chip
                                key={diet._id}
                                label={diet.name}
                                //color="primary"
                                //variant="outlined"
                                sx={{
                                  borderRadius: 15,
                                  color: "#fff",
                                  background: theme.palette.secondary.dark,
                                }}
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No dietary restrictions specified.
                          </Typography>
                        )}
                      </Box>

                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Account Activity
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={6} md={4}>
                            <Card
                              elevation={0}
                              sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: theme.palette.success.light,
                                color: theme.palette.success.contrastText,
                              }}
                            >
                              <Typography variant="h4" fontWeight="bold">
                                {user?.savedRecipes.length}
                              </Typography>
                              <Typography variant="body2">
                                Saved Recipes
                              </Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={4}>
                            <Card
                              elevation={0}
                              sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: theme.palette.info.light,
                                color: theme.palette.info.contrastText,
                              }}
                            >
                              <Typography variant="h4" fontWeight="bold">
                                {user?.ratedRecipes.length}
                              </Typography>
                              <Typography variant="body2">
                                Rated Recipes
                              </Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={4}>
                            <Card
                              elevation={0}
                              sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: theme.palette.warning.main,
                                color: theme.palette.warning.contrastText,
                              }}
                            >
                              <Typography variant="h4" fontWeight="bold">
                                {user?.myRecipeGenerations.length}
                              </Typography>
                              <Typography variant="body2">Generated</Typography>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    </Stack>
                  )}

                  {tabValue === 1 && (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                      <FoodBank
                        sx={{
                          fontSize: 64,
                          color: "text.secondary",
                          opacity: 0.5,
                        }}
                      />
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        {user?.myRecipeGenerations?.length} Generated Recipes
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        View your entire AI generated recipe collection
                        <Link
                          style={{
                            padding: 0,
                            minWidth: "auto",
                            textTransform: "none",
                            color: theme.palette.primary.main,
                            textDecoration: "underline",
                          }}
                          to="/recipes/me/generated"
                        >
                          &nbsp;here
                        </Link>
                      </Typography>
                    </Box>
                  )}

                  {tabValue === 2 && (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                      <Bookmark
                        sx={{
                          fontSize: 64,
                          color: "text.secondary",
                          opacity: 0.5,
                        }}
                      />
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        {user?.savedRecipes.length} Saved Recipes
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        View your saved recipe collection
                        <Link
                          style={{
                            padding: 0,
                            minWidth: "auto",
                            textTransform: "none",
                            color: theme.palette.primary.main,
                            textDecoration: "underline",
                          }}
                          to="/recipes/me/saved"
                        >
                          &nbsp;here
                        </Link>
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Side Panel */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={2}>
                    <Button
                      variant="text"
                      fullWidth
                      startIcon={<Create />}
                      onClick={() => navigate("/generate")}
                      sx={{
                        justifyContent: "flex-start",
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                    >
                      Generate New Recipe
                    </Button>
                    <Button
                      variant="text"
                      fullWidth
                      startIcon={<Restaurant />}
                      sx={{
                        justifyContent: "flex-start",
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                      onClick={() => navigate("/recipes")}
                    >
                      Browse Recipes
                    </Button>
                    <Button
                      variant="text"
                      fullWidth
                      startIcon={<Settings />}
                      sx={{
                        justifyContent: "flex-start",
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                    >
                      Account Settings
                    </Button>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {editProfileOpen && (
        <EditProfileDialog
          open={editProfileOpen}
          onClose={handleEditProfileClose}
          user={user}
        />
      )}
    </React.Fragment>
  );
};

export default UserProfile;
