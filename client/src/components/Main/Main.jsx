import React from "react";

import { HomeContainer } from "../../styles/ContainerStyles";
import RecipeCarousel from "../Recipes/MainPage/Carousel";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import PopularRecipeCard from "../Recipes/PopularRecipes";
import RecipeCard from "../Recipes/RecipeCard";
import { useRecipe } from "../../hooks/useRecipe";
import Carousel from "../Recipes/MainPage/Carousel";
import RecipeOfTheDay from "../Recipes/MainPage/RecipeOfTheDay";
import { Greeting } from "../Recipes/MainPage/Greeting";

export const Main = () => {
  const theme = useTheme();
  const {
    fetchPersonalizedRecipes,
    fetchTrendingRecipes,
    personalizedRecipes,
    trendingRecipes,
  } = useRecipe();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const handleViewRecipe = () => {
    console.log("View recipe clicked");
  };

  const createNewPostWithHashTag = () => {};

  React.useEffect(() => {
    fetchTrendingRecipes(1, 4);
    fetchPersonalizedRecipes(1, 5);
  }, []);
  return (
    <React.Fragment>
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

          <RecipeOfTheDay />
        </HomeContainer>
      </Box>
    </React.Fragment>
  );
};
