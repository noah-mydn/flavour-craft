import React from "react";

import { HomeContainer } from "../../styles/ContainerStyles";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Carousel from "../Recipes/MainPage/Carousel";
import RecipeOfTheDay from "../Recipes/MainPage/RecipeOfTheDay";
import { Greeting } from "../Recipes/MainPage/Greeting";

import { useRecipe } from "../../hooks/useRecipe";

export const Main = () => {
  const theme = useTheme();
  const {
    trendingRecipes,
    fetchTrendingRecipes,
    fetchRecipeOfTheDay,
    recipeOfTheDay,
    recipeDayLoading,
  } = useRecipe();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    fetchTrendingRecipes();
    fetchRecipeOfTheDay();
  }, []);

  const createNewPostWithHashTag = () => {};

  return (
    <>
      <Box
        mt={isMobile ? 16 : isTablet ? 14 : 10}
        component="img"
        src={isMobile ? "./banner-mobile.png" : "./banner-desktop.png"}
        alt="hashtag campaign banner"
        onClick={createNewPostWithHashTag}
      />
      <Box my={3} mx={isMobile ? 0 : 10}>
        <HomeContainer>
          <Greeting />

          <Carousel recipes={trendingRecipes} heading="Trending Recipes" />

          <Box mt={7}>
            <RecipeOfTheDay recipe={recipeOfTheDay} />
          </Box>
        </HomeContainer>
      </Box>
    </>
  );
};
