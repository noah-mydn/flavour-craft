import React from "react";

import { HomeContainer } from "../../styles/ContainerStyles";
import RecipeCarousel from "../Recipes/RecipeCarousel";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import PopularRecipeCard from "../Recipes/PopularRecipes";
import RecipeCard from "../Recipes/RecipeCard";

export const Main = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleViewRecipe = () => {
    console.log("View recipe clicked");
  };

  const createNewPostWithHashTag = () => {};
  return (
    <React.Fragment>
      <Box
        mt={isMobile ? 12 : 10}
        component="img"
        src={isMobile ? "./banner-mobile.png" : "./banner-desktop.png"}
        alt="hashtag campaign banner"
        onClick={createNewPostWithHashTag}
      />
      <HomeContainer>
        <Typography
          m={2}
          fontWeight="bold"
          variant={isMobile ? "h5" : "h4"}
          color="primary"
        >
          Just For You
        </Typography>
        {/* <PopularRecipeCard
          title="Caramel Cake Pancakes"
          description="If you're a fan of caramel cake, then you'll love our Caramel Cake Pancakes. We complete these over-the-top pancakes with Caramel Syrup."
          rating={5}
          image="https://example.com/pancake-image.jpg" // Replace with your actual image path
          handsOnTime="30 min"
          totalTime="40 min"
          yield="40 min" // In the image this is shown as 40 min, though typically yield would be servings
          backgroundColor="#f3e5f5" // Light purple color similar to image background
          onViewRecipe={handleViewRecipe}
        /> */}
        <RecipeCard />
      </HomeContainer>
    </React.Fragment>
  );
};
