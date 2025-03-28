import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import TopNavigationBar from "../components/Navigations/TopNavigationBar";
import { useRecipe } from "../hooks/useRecipe";
import { useDispatch, useSelector } from "react-redux";
import {
  filterExistsSelector,
  filtersSelector,
  loadingRecipesSelector,
  paginationSelector,
  recipesListSelector,
} from "../redux/selectors/selectors";
import RecipeCard from "../components/Recipes/RecipeCard";
import RecipeCardSkeleton from "../components/Recipes/RecipeCardSkeleton";
import {
  fetchFilteredRecipes,
  fetchRecipes,
} from "../redux/apiClients/recipeAPI";
import FilterSort from "../components/FilterSort/FilterSort";
import { SearchOff } from "@mui/icons-material";
import { setSortType } from "../redux/reducers/recipesSlice";
import { fetchCuisines } from "../redux/apiClients/cuisineAPI";
import { fetchDietaryOptions } from "../redux/apiClients/dietaryAPI";

const Recipes = () => {
  const theme = useTheme();
  const recipes = useSelector(recipesListSelector);
  const loading = useSelector(loadingRecipesSelector);
  const pagination = useSelector(paginationSelector);
  const filters = useSelector(filtersSelector);
  const dispatch = useDispatch();

  const { filterRecipeOption } = useRecipe();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  //Check if recipes exist
  const hasRecipes = !loading && recipes && recipes.length > 0;
  const showNoResults = !loading && (!recipes || recipes.length === 0);

  const { sortValue } = filterRecipeOption;
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  React.useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      dispatch(fetchFilteredRecipes(filters, page, pageSize));
      dispatch(setSortType(null));
    } else {
      console.log("BECAUSE OF THIS:");
      dispatch(fetchRecipes({ sortValue, page, pageSize }));
    }
  }, [filters, page, dispatch]);

  // sort changes
  React.useEffect(() => {
    if (
      (!filters || Object.keys(filters).length === 0) &&
      sortValue !== "all"
    ) {
      console.log("BECAUSE OF NO FILTERS:");
      dispatch(fetchRecipes({ sortValue, page, pageSize }));
    }
  }, [sortValue, dispatch]);

  console.log("Recipes:", recipes);
  return (
    <Box mt={16} mx={isMobile ? 2 : isTablet ? 4 : 8}>
      <Grid container direction="column" spacing={3}>
        <Grid item spacing={1} xs={11} md={8} lg={6}>
          <FilterSort page={page} pageSize={pageSize} />
        </Grid>

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
          {loading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <Grid item key={`skeleton-${index}`} md={12} lg={6}>
                    <RecipeCardSkeleton />
                  </Grid>
                ))
            : hasRecipes
            ? recipes.map((recipe) => (
                <Grid
                  item
                  key={recipe._id}
                  xs={8}
                  sm={6}
                  md={4.5}
                  lg={2.5}
                  rowSpacing={3}
                >
                  <RecipeCard recipe={recipe} />
                </Grid>
              ))
            : null}
        </Grid>

        {/* No Results UI */}
        {showNoResults && (
          <Grid item container justifyContent="center" mt={6} mb={10}>
            <Stack
              spacing={3}
              alignItems="center"
              sx={{ maxWidth: 500, textAlign: "center" }}
            >
              <SearchOff
                sx={{ fontSize: 80, color: "text.secondary", opacity: 0.7 }}
              />
              <Typography variant="h5" color="text.primary">
                No recipes found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We couldn't find any recipes that match your current filters.
                Try adjusting your filters or exploring different categories.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: 2, textTransform: "none", px: 4 }}
                onClick={() => window.location.reload()}
              >
                Clear All Filters
              </Button>
            </Stack>
          </Grid>
        )}

        {/* Pagination - only show when we have recipes */}
        {hasRecipes && (
          <Grid item container justifyContent="center" mt={4} mb={6}>
            <Pagination
              count={pagination?.totalPages || 1}
              page={page}
              color="primary"
              size="large"
              onChange={handlePageChange}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Recipes;
