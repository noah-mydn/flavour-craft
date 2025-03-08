import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  Container,
  Paper,
  IconButton,
  Tabs,
  Tab,
  useMediaQuery,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { FavoriteBorderOutlined } from "@mui/icons-material";
import { useRecipe } from "../../hooks/useRecipe";
import theme from "../../theme/theme";
import { useParams } from "react-router-dom";

const RecipeDetail = () => {
  const { fetchRecipeInfo, recipe } = useRecipe();
  const [activeTab, setActiveTab] = useState(0);
  const recipeId = useParams().recipeId;

  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (recipeId) {
      fetchRecipeInfo(recipeId);
    }
  }, [fetchRecipeInfo, recipeId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 16, mb: 4 }}>
      <Card elevation={2}>
        <CardContent>
          {/* Recipe Image and Title Section */}
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              md={6}
              alignContent="center"
              alignItems="center"
              justifyContent="center"
              justifyItems="center"
            >
              <Box
                component="img"
                sx={{
                  width: isMobile ? "80%" : isTablet ? "100%" : "100%", // Adjust based on screen size
                  maxWidth: "350px", // Prevents it from becoming too large
                  height: "auto",
                  borderRadius: 2,
                  objectFit: "contain",
                }}
                alt={recipe?.name}
                src={recipe?.thumbnail}
              />
            </Grid>

            <Grid item xs={12} md={6} position="relative">
              <Box sx={{ position: "absolute", top: 30, right: 10 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                  }}
                >
                  <FavoriteBorderOutlined
                    sx={{
                      color: theme.palette.primary.light,
                    }}
                  />
                </IconButton>
              </Box>
              <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {recipe?.name}
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                  {recipe?.shortDescription}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Rating
                    value={recipe?.ratings?.average}
                    readOnly
                    precision={0.5}
                    sx={{ color: "#FFD700" }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    {recipe?.ratings?.average?.toFixed(1)}
                  </Typography>
                </Box>

                {/* Cooking Time and Cuisine Type */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {recipe?.cookingTime}
                  </Typography>
                  <RestaurantIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {recipe?.cuisineTypes?.[0]}
                  </Typography>
                </Box>

                {/* Dietary Preferences Tags */}
                <Box sx={{ mt: 2 }}>
                  {recipe?.dietaryPreferences?.map((pref, index) => (
                    <Chip
                      key={index}
                      label={pref}
                      size="small"
                      sx={{
                        mr: 1,
                        mb: 1,
                        backgroundColor: theme.palette.secondary.dark,
                        color: "#fff",
                      }}
                    />
                  ))}
                </Box>

                {/* Nutrition Facts */}
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    maxWidth: 350,
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" color="primary">
                      Calories
                    </Typography>
                    <Typography variant="body1">
                      {recipe?.nutritionalInfo?.calories}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" color="primary">
                      Fat
                    </Typography>
                    <Typography variant="body1">
                      {recipe?.nutritionalInfo?.fat}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" color="primary">
                      Carbs
                    </Typography>
                    <Typography variant="body1">
                      {recipe?.nutritionalInfo?.carbs}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle2" color="primary">
                      Protein
                    </Typography>
                    <Typography variant="body1">
                      {recipe?.nutritionalInfo?.protein}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Stepper for Ingredients and Instructions */}
          <Box>
            {/* Tab Headers */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="recipe tabs"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.primary.main,
                  height: 3,
                },
                borderBottom: 1,
                borderColor: "divider",
                mb: 2,
              }}
            >
              <Tab
                label={
                  <Typography
                    variant="body1"
                    component="span"
                    sx={{
                      fontWeight: activeTab === 0 ? "bold" : "normal",
                      color:
                        activeTab === 0
                          ? theme.palette.primary.main
                          : "inherit",
                    }}
                  >
                    INGREDIENTS
                  </Typography>
                }
                sx={{
                  "&.Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
              <Tab
                label={
                  <Typography
                    variant="body1"
                    component="span"
                    sx={{
                      fontWeight: activeTab === 1 ? "bold" : "normal",
                      color:
                        activeTab === 1
                          ? theme.palette.primary.main
                          : "inherit",
                    }}
                  >
                    COOKING INSTRUCTIONS
                  </Typography>
                }
                sx={{
                  "&.Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Tabs>

            {/* Tab Panels */}
            <Box role="tabpanel" hidden={activeTab !== 0} sx={{ p: 2 }}>
              {activeTab === 0 && (
                <List>
                  {recipe?.ingredients?.map((ingredient, index) => (
                    <ListItem key={ingredient?.id || index} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={ingredient?.quantity + " " + ingredient?.name}
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontSize: "1rem",
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Box role="tabpanel" hidden={activeTab !== 1} sx={{ p: 2 }}>
              {activeTab === 1 && (
                <List>
                  {recipe?.cookingInstructions?.map((step, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={`${index + 1}. ${step}`}
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontSize: "1rem",
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecipeDetail;
