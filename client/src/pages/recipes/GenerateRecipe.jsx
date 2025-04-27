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
  Paper,
} from "@mui/material";
import theme from "../../theme/theme";
import { useDispatch } from "react-redux";
import { fetchCuisines } from "../../redux/apiClients/cuisineAPI";
import { fetchDietaryOptions } from "../../redux/apiClients/dietaryAPI";
import IngredientFilterUI from "../../components/Ingredients/IngredientInspection";
import AIRecipeLoading from "./AIRecipeLoading";
import { GenerateRecipeContext } from "../../context/GenerateRecipeContext";
import GeneratedRecipeCard from "../../components/Recipes/GeneratedRecipeCard";

const GenerateRecipe = () => {
  const dispatch = useDispatch();

  const {
    handleGenerateRecipe,
    generateLoading,
    errorGeneration,
    generatedRecipe,
  } = useContext(GenerateRecipeContext);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    dispatch(fetchCuisines());
    dispatch(fetchDietaryOptions());
  }, [dispatch]);

  return (
    <Box
      sx={{
        marginTop: isMobile ? "13rem" : "10rem",
        marginBottom: "2rem",
        mx: { xs: 2, sm: 4, md: 12 },
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
          <Grid item xs={12} md={12} lg={4}>
            <Box sx={{ height: "100%" }}>
              <IngredientFilterUI loading={generateLoading} />
            </Box>
          </Grid>

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

          {/*recipe results */}
          <Grid item md={12} lg={7}>
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
              {/* {!generateLoading &&
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
                )} */}

              {/* Recipe results */}
              {!generateLoading &&
                !errorGeneration &&
                generatedRecipe?.length > 0 && (
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-around"
                    justifyItems="center"
                    alignItems="center"
                    alignContent="center"
                    gap={2}
                  >
                    <Grid item xs={12}>
                      <Box>
                        <GeneratedRecipeCard recipe={generatedRecipe[0]} />
                      </Box>
                    </Grid>
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
