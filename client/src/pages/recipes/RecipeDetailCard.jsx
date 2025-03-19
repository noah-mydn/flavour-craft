import React, { useState, useEffect } from "react";
import Flag from "react-world-flags";
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
  IconButton,
  Tabs,
  Tab,
  useMediaQuery,
  Breadcrumbs,
  Link,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { Favorite, FavoriteBorderOutlined } from "@mui/icons-material";
import { useRecipe } from "../../hooks/useRecipe";
import theme from "../../theme/theme";
import { useParams } from "react-router-dom";
import cuisineFlags from "../../constants/flags";
import { useSelector } from "react-redux";
import { profileSelector } from "../../redux/selectors/selectors";
import RecipeCardSkeleton from "./RecipeDetailCardSkeleton";

const RecipeDetail = () => {
  const recipeId = useParams()?.recipeId;
  const profile = useSelector(profileSelector);

  const {
    fetchRecipeInfo,
    recipe,
    handleSaveRecipe,
    recipeLoading,
    rateRecipe,
  } = useRecipe();
  const [activeTab, setActiveTab] = useState(0);

  const [rate, setRate] = useState(0);

  React.useEffect(() => {
    const initialRating = profile?.ratedRecipes.find(
      (recipe) => recipe.recipeId === recipeId
    )?.rating;

    setRate(initialRating || 0);
  }, [profile, recipeId]);

  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const saved = profile?.savedRecipes?.includes(recipeId);
    console.log("RECIPE SAVED:", saved);

    setSaved(saved);
  }, [profile, recipeId]);

  const likeRecipe = () => {
    handleSaveRecipe(recipeId);

    setSaved(!saved);
  };

  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRateRecipe = (event) => {
    rateRecipe(recipeId, event.target.value).then(() => {
      fetchRecipeInfo(recipeId);
    });
  };

  React.useEffect(() => {
    if (recipeId) {
      fetchRecipeInfo(recipeId);
    }
  }, []);

  return (
    <Box
      mx={isMobile || isTablet ? 0 : 8}
      py={isMobile || isTablet ? 0 : 4}
      my={isMobile || isTablet ? 0 : 3}
    >
      <Container maxWidth="lg" sx={{ mt: 16, mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginY: 2 }}>
          <Link
            color="text.secondary"
            href="/recipes"
            sx={{ textDecoration: "none", cursor: "pointer" }}
          >
            Recipes
          </Link>
          <Link
            color="secondary.dark"
            sx={{ textDecoration: "none", cursor: "pointer" }}
          >
            {recipe?.name}
          </Link>
        </Breadcrumbs>
        {recipeLoading && !recipe && (
          <RecipeCardSkeleton isMobile={isMobile} isTablet={isTablet} />
        )}
        {!recipeLoading && recipe && (
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
                    position="relative"
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Box
                      sx={{ position: "absolute", top: 10, left: 15 }}
                      display="flex"
                      flexWrap="wrap"
                    >
                      {recipe?.dietaryPreferences.map((pref) => {
                        return (
                          <Chip
                            label={pref}
                            size="small"
                            sx={{
                              fontSize: "0.7rem",
                              height: 24,
                              mr: 0.7,
                              mb: 0.5,
                              bgcolor: theme.palette.secondary.dark,
                              color: "#fff",
                            }}
                          />
                        );
                      })}
                    </Box>
                    <Box
                      component="img"
                      sx={{
                        width: "100%",
                        maxWidth: "350px",
                        height: "auto",
                        borderRadius: 2,
                        objectFit: "contain",
                      }}
                      alt={recipe?.name}
                      src={recipe?.thumbnail}
                    />{" "}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6} position="relative">
                  <Box sx={{ position: "absolute", top: 30, right: 10 }}>
                    <IconButton
                      size="small"
                      onClick={likeRecipe}
                      sx={{
                        color: "white",
                      }}
                    >
                      {saved ? (
                        <Favorite color="primary" />
                      ) : (
                        <FavoriteBorderOutlined
                          sx={{
                            color: theme.palette.primary.light,
                          }}
                        />
                      )}
                    </IconButton>
                  </Box>
                  <Box mt={5}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      {recipe?.name}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      {recipe?.shortDescription}
                    </Typography>
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
                    {/* Rating */}
                    <Box
                      sx={{ display: "flex", alignItems: "center", my: 2.2 }}
                    >
                      <Rating
                        value={rate}
                        precision={1}
                        max={5}
                        sx={{ color: "#FFD700" }}
                        onChange={handleRateRecipe}
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

                      <Flag
                        code={cuisineFlags[recipe?.cuisineTypes[0]]}
                        style={{
                          width: 25,
                          height: 15,
                          marginRight: 4,
                        }}
                      />
                      <Typography variant="body2">
                        {recipe?.cuisineTypes?.[0]}
                      </Typography>
                    </Box>

                    {/* Dietary Preferences Tags */}
                    <Box sx={{ mt: 2 }}>
                      {recipe?.tags?.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            mr: 1,
                            mb: 1,
                            backgroundColor: theme.palette.text.secondary,
                            color: "#fff",
                          }}
                        />
                      ))}
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
                        <ListItem
                          key={ingredient?.id || index}
                          sx={{ py: 0.5 }}
                        >
                          <ListItemText
                            primary={
                              ingredient?.quantity + " " + ingredient?.name
                            }
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
        )}
      </Container>
    </Box>
  );
};

export default RecipeDetail;
