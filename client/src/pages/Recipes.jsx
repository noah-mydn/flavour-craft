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
import { useSelector } from "react-redux";
import {
  paginationSelector,
  recipesSelector,
} from "../redux/selectors/selectors";
import RecipeCard from "../components/Recipes/RecipeCard";
import SortIcon from "@mui/icons-material/Sort";
import { FilterAlt } from "@mui/icons-material";

const Recipes = () => {
  const theme = useTheme();
  const recipes = useSelector(recipesSelector);
  const pagination = useSelector(paginationSelector);

  const { fetchRecentlyAddedRecipes, page, pageSize, handlePageChange } =
    useRecipe();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    fetchRecentlyAddedRecipes(page, pageSize);
  }, [page, pageSize]);

  React.useEffect(() => {
    console.log("Recipes", recipes);
  }, []);

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
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ marginY: 2, marginLeft: 6 }}
            >
              <Link
                color="text.secondary"
                //href="/recipes"
                sx={{ textDecoration: "none", cursor: "pointer" }}
              >
                Recipes
              </Link>
              {/* <Link
                color="secondary.dark"
                sx={{ textDecoration: "none", cursor: "pointer" }}
              >
                {recipe?.name}
              </Link> */}
            </Breadcrumbs>
            <Box
              display="flex"
              justifyContent={isMobile ? "center" : "flex-end"}
              width="100%"
              mt={isMobile ? 7 : 3}
              mr={isMobile ? 0 : 3}
            >
              <Stack direction={isMobile ? "column" : "row"} spacing={3}>
                <FormControl sx={{ width: "150px", maxWidth: "225px" }}>
                  <InputLabel id="sort-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-label"
                    id="sort-select"
                    label="Sort By"
                    size="small"
                    value={10}
                  >
                    <MenuItem value={10} selected>
                      Most Recent
                    </MenuItem>
                    <MenuItem value={20}>Most Popular</MenuItem>
                    <MenuItem value={30}>Most Viewed</MenuItem>
                    <MenuItem value={30}>Most Rated</MenuItem>
                    <MenuItem value={30}>Most Favorites</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          </Grid>

          {/* Recipe Cards Grid */}
          <Grid item container justifyContent="center" spacing={3}>
            {recipes?.map((recipe) => (
              <Grid item key={recipe.id} xs={7.7} sm={4.5} md={3.5} lg={2.2}>
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
