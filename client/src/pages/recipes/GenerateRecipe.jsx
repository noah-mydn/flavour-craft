import React, { useContext, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Link,
  useMediaQuery,
  Container,
  Grid,
  Divider,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import theme from "../../theme/theme";
import { useDispatch, useSelector } from "react-redux";
import { fetchCuisines } from "../../redux/apiClients/cuisineAPI";
import { fetchDietaryOptions } from "../../redux/apiClients/dietaryAPI";
import IngredientFilterUI from "../../components/Ingredients/IngredientInspection";
import RecipeCard from "../../components/Recipes/RecipeCard";
import AIRecipeLoading from "./AIRecipeLoading";
import { useGenerate } from "../../hooks/useGenerate";
import { GenerateRecipeContext } from "../../context/GenerateRecipeContext";
import { fetchAllRecipes } from "../../redux/apiClients/recipeAPI";
import { useRecipe } from "../../hooks/useRecipe";
import GeneratedRecipeCard from "../../components/Recipes/GeneratedRecipeCard";
import RecipeCardHorizontal from "../../components/Recipes/RecipeCardHorizontal";
import {
  loadingRecipesSelector,
  recipesListSelector,
} from "../../redux/selectors/selectors";

const GenerateRecipe = () => {
  const dispatch = useDispatch();

  // States for recipe generation
  const {
    handleGenerateRecipe,
    generateLoading,
    errorGeneration,
    generatedRecipe,
  } = useContext(GenerateRecipeContext);

  // Media queries for responsive design
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const recipes = useSelector(recipesListSelector);
  const loading = useSelector(loadingRecipesSelector);

  React.useEffect(() => {
    dispatch(fetchCuisines());
    dispatch(fetchDietaryOptions());
  }, [dispatch]);

  return (
    <Box
      sx={{
        marginTop: isMobile ? "13rem" : "10rem",
        marginBottom: "2rem",
        mx: { xs: 2, sm: 4 },
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ marginBottom: 3, marginLeft: 1 }}
      >
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
          Generate By Ingredients
        </Link>
      </Breadcrumbs>

      <Container maxWidth="xl" disableGutters>
        <Grid container spacing={3}>
          {/* Left column for ingredient filter */}
          <Grid item xs={12} md={5} lg={4}>
            {/* Wrap the IngredientFilterUI and modify it to use a callback for generation */}
            <Box sx={{ height: "100%" }}>
              <IngredientFilterUI onGenerateClick={handleGenerateRecipe} />
            </Box>
          </Grid>

          {/* Divider - vertical for desktop/tablet, horizontal for mobile */}
          <Grid
            item
            xs={12}
            md="auto"
            sx={{ display: "flex", alignItems: "stretch" }}
          >
            {isMobile ? (
              <Divider flexItem sx={{ width: "100%", my: 2 }} />
            ) : (
              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            )}
          </Grid>

          {/* Right column for recipe results */}
          <Grid item xs={12} md={6} lg={7}>
            <Paper
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                //bgcolor: theme.palette.background.default,
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Generated Recipes
              </Typography>

              {/* Loading state */}
              {generateLoading && <AIRecipeLoading />}

              {/* Error state */}
              {errorGeneration && !generateLoading && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="error" gutterBottom>
                    {errorGeneration}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGenerateRecipe}
                    sx={{ mt: 2 }}
                  >
                    Try Again
                  </Button>
                </Box>
              )}

              {/* Empty state */}
              {!generateLoading &&
                !errorGeneration &&
                generatedRecipe?.length === 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      flexGrow: 1,
                      p: 4,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                    >
                      Select ingredients and/or preferences, then click "Let's
                      Generate" to create recipe suggestion.
                    </Typography>
                  </Box>
                )}

              {/* Recipe results */}
              {!generateLoading &&
                !errorGeneration &&
                generatedRecipe?.length > 0 && (
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    justifyItems="center"
                    alignItems="center"
                    alignContent="center"
                  >
                    {generatedRecipe?.map((recipe, index) => (
                      <Grid item xs={12} lg={6} key={recipe._id || index}>
                        <RecipeCardHorizontal recipe={recipe} />
                      </Grid>
                    ))}
                  </Grid>
                )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default GenerateRecipe;
