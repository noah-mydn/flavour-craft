import {
  Box,
  Breadcrumbs,
  Grid,
  Pagination,
  useMediaQuery,
  useTheme,
  Typography,
  Button,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RecipeCardSkeleton from "./RecipeDetailCardSkeleton";
import RecipeCard from "../../components/Recipes/RecipeCard";
import {
  profileSelector,
  recipeLoadingSelector,
} from "../../redux/selectors/selectors";

import { Link } from "react-router-dom";
import { fetchRecipeById } from "../../redux/apiClients/recipeAPI";

const SavedRecipes = () => {
  const profile = useSelector(profileSelector);
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = React.useState(1);
  const theme = useTheme();
  const dispatch = useDispatch();
  const recipeLoading = useSelector(recipeLoadingSelector);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageRecipes = recipes.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchSavedRecipes = async () => {
    if (!profile?.savedRecipes?.length) return;

    try {
      const fetchPromises = profile.savedRecipes.map((id) =>
        dispatch(fetchRecipeById(id))
      );

      const results = await Promise.all(fetchPromises);
      //console.log(results);
      // Filter successful recipes
      const successfulRecipes = results
        ?.filter((res) => res?.payload)
        ?.map((res) => res.payload);
      //console.log(successfulRecipes);
      setRecipes(successfulRecipes);
    } catch (error) {
      console.error("Failed to fetch saved recipes:", error);
    }
  };

  useEffect(() => {
    fetchSavedRecipes();
  }, [profile?.savedRecipes]);

  const hasNoRecipes = !recipeLoading && (!recipes || recipes.length === 0);

  return (
    <Box mt={16} mx={isMobile ? 2 : isTablet ? 4 : 8}>
      <Grid container direction="column" spacing={3}>
        {/* Breadcrumbs and Sort/Filter Section */}
        <Grid
          item
          container
          justifyContent="space-between"
          alignItems="center"
          px={3}
        >
          <Breadcrumbs aria-label="breadcrumb" sx={{ marginY: 2 }}>
            <Link
              color="text.secondary"
              to="/recipes"
              sx={{ textDecoration: "none", cursor: "pointer" }}
            >
              Recipes
            </Link>
            <Link
              color="secondary.dark"
              sx={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Saved
            </Link>
          </Breadcrumbs>
        </Grid>

        {/* Show empty state when no recipes */}
        {!recipeLoading && !profile?.savedRecipes.length === 0 ? (
          <Grid item container justifyContent="center">
            <Grid item xs={12} md={10} lg={8}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                py={8}
                px={4}
                sx={{
                  backgroundColor: "rgba(245, 250, 255, 0.6)",
                  borderRadius: 4,
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                  minHeight: "60vh",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    mb: 4,
                  }}
                >
                  <BookmarkIcon
                    sx={{
                      fontSize: isMobile ? 80 : 120,
                      color: theme.palette.primary.main,
                      opacity: 0.2,
                    }}
                  />
                  <SearchIcon
                    sx={{
                      fontSize: isMobile ? 40 : 60,
                      color: theme.palette.secondary.main,
                      position: "absolute",
                      bottom: 0,
                      right: -20,
                    }}
                  />
                </Box>

                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  component="h1"
                  fontWeight="bold"
                  color="primary.dark"
                  gutterBottom
                >
                  Your Recipe Collection is Empty
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: "80%",
                    mb: 4,
                    fontSize: isMobile ? 16 : 18,
                  }}
                >
                  You haven't saved any recipes yet! Browse our collection of
                  delicious dishes and save your favorites to access them
                  anytime.
                </Typography>

                <Button
                  component={Link}
                  to="/recipes"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SearchIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontSize: isMobile ? 14 : 16,
                    fontWeight: "bold",
                    boxShadow: theme.shadows[4],
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  Discover Recipes
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <>
            {/* Recipe Cards Grid */}
            <Grid
              item
              container
              spacing={4}
              justifyContent="center"
              alignContent="center"
              justifyItems="center"
              alignItems="center"
            >
              {recipeLoading
                ? Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <Grid item key={`skeleton-${index}`} md={12} lg={6}>
                        <RecipeCardSkeleton />
                      </Grid>
                    ))
                : currentPageRecipes?.map((recipe) => (
                    <Grid item key={recipe._id} xs={10} lg={6}>
                      <RecipeCard recipe={recipe} />
                    </Grid>
                  ))}
            </Grid>

            {/* Pagination */}
            <Grid item container justifyContent="center">
              {recipes.length > 0 && (
                <Pagination
                  count={Math.ceil(recipes.length / itemsPerPage)}
                  page={page}
                  color="primary"
                  size="large"
                  onChange={handlePageChange}
                />
              )}
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default SavedRecipes;
