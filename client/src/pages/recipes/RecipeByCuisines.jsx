import {
  Box,
  Breadcrumbs,
  Grid,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredRecipes } from "../../redux/apiClients/recipeAPI";
import RecipeCardSkeleton from "./RecipeDetailCardSkeleton";
import RecipeCard from "../../components/Recipes/RecipeCard";
import {
  loadingRecipesSelector,
  paginationSelector,
  recipesListSelector,
} from "../../redux/selectors/selectors";

import { Link, useParams } from "react-router-dom";
import { setFilters } from "../../redux/reducers/recipesSlice";

const RecipesByCuisines = () => {
  const [page, setPage] = React.useState(1);
  const theme = useTheme();
  //get cuisine type from params
  const cuisineType = useParams().cuisineType;

  const recipes = useSelector(recipesListSelector);
  const loading = useSelector(loadingRecipesSelector);
  const pagination = useSelector(paginationSelector);
  const dispatch = useDispatch();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  React.useEffect(() => {
    if (cuisineType) {
      let payload = { cuisineTypes: [cuisineType] };

      console.log("Payload:", payload);

      dispatch(setFilters(payload));
      dispatch(fetchFilteredRecipes({ filters: payload, page, pageSize: 10 }));
    }
    return () => {
      dispatch(setFilters({}));
    };
  }, [cuisineType, dispatch, page, 10]);

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
              {cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1)}
            </Link>
          </Breadcrumbs>
          {/* <Box
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
            </Box> */}
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
  );
};

export default RecipesByCuisines;
