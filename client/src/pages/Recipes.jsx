import {
  Box,
  Breadcrumbs,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Pagination,
  Select,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import TopNavigationBar from "../components/Navigations/TopNavigationBar";
import { useRecipe } from "../hooks/useRecipe";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingRecipesSelector,
  paginationSelector,
  recipesListSelector,
} from "../redux/selectors/selectors";
import RecipeCard from "../components/Recipes/RecipeCard";
import RecipeCardSkeleton from "../components/Recipes/RecipeCardSkeleton";
import { fetchRecipes } from "../redux/apiClients/recipeAPI";

const Recipes = () => {
  const theme = useTheme();
  const { page } = useRecipe();
  const recipes = useSelector(recipesListSelector);
  const loading = useSelector(loadingRecipesSelector);
  const pagination = useSelector(paginationSelector);
  const dispatch = useDispatch();

  const { handlePageChange, filterRecipeOption } = useRecipe();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { sortValue, handleSortChange } = filterRecipeOption;

  React.useEffect(() => {
    dispatch(fetchRecipes({ sortValue: "all", page }, 10));
  }, []);
  console.log("Recipes:", recipes);
  return (
    <React.Fragment>
      <TopNavigationBar />
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
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginTop: 4 }}>
              <Link
                color="text.secondary"
                //href="/recipes"
                sx={{ textDecoration: "none", cursor: "pointer" }}
              >
                Recipes
              </Link>
              <Link
                color="text.secondary"
                //href="/recipes"
                sx={{
                  textDecoration: "none",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {sortValue}
              </Link>
            </Breadcrumbs>
            <Box
              display="flex"
              justifyContent={isMobile ? "center" : "flex-end"}
              width="100%"
              mt={isMobile ? 7 : 3}
            >
              <Stack direction={isMobile ? "column" : "row"} spacing={3}>
                <FormControl sx={{ width: "150px", maxWidth: "225px" }}>
                  <InputLabel id="sort-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-label"
                    id="sort-select"
                    label="Sort By"
                    size="small"
                    value={sortValue}
                    onChange={handleSortChange}
                  >
                    <MenuItem value="all" selected>
                      Most Recent
                    </MenuItem>
                    <MenuItem value="popular">Most Popular</MenuItem>
                    <MenuItem value="mostViewed">Most Viewed</MenuItem>
                    <MenuItem value="personalized">Personalized</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
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
              : recipes?.map((recipe) => (
                  <Grid item key={recipe._id} xs={10} lg={6}>
                    <RecipeCard recipe={recipe} />
                  </Grid>
                ))}
          </Grid>

          {/* Pagination */}
          <Grid item container justifyContent="center">
            <Pagination
              count={pagination?.totalPages || 1}
              color="primary"
              size="large"
              onChange={handlePageChange}
            />
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default Recipes;
