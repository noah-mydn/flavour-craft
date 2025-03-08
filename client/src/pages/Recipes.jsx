import {
  Box,
  Pagination,
  Typography,
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
      <Box mt={16}>
        <Box py={3} mx={isMobile ? 0 : 10}>
          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
          >
            Available Recipes
          </Typography>
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            my={3}
          >
            {recipes?.map((recipe) => {
              return (
                <RecipeCard
                  recipe={recipe}
                  width={isMobile ? "260px" : isTablet ? "250px" : "220px"}
                />
              );
            })}
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" mb={4}>
          <Pagination
            count={pagination?.totalPages || 1}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default Recipes;
