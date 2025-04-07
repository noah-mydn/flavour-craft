import React from "react";

import { HomeContainer } from "../../styles/ContainerStyles";
import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import Carousel from "../Recipes/MainPage/Carousel";
import RecipeOfTheDay from "../Recipes/MainPage/RecipeOfTheDay";
import { Greeting } from "../Recipes/MainPage/Greeting";

import { useRecipe } from "../../hooks/useRecipe";
import { useCampaign } from "../../hooks/admin/useCampaign";
import LabelOnBanner from "./LabelOnBanner";

export const Main = () => {
  const theme = useTheme();
  const {
    trendingRecipes,
    fetchTrendingRecipes,
    fetchRecipeOfTheDay,
    recipeOfTheDay,
  } = useRecipe();
  const { activeCampaign, loading, error } = useCampaign();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    fetchTrendingRecipes();
    fetchRecipeOfTheDay();
  }, []);

  return (
    <>
      {!loading && !error && activeCampaign && (
        <Box position="relative" mt={isMobile ? 12 : isTablet ? 10 : 8}>
          <Box
            component="img"
            src={
              isMobile
                ? activeCampaign?.mobileImage
                : activeCampaign?.desktopImage
            }
            alt={activeCampaign?.title}
          />

          <LabelOnBanner isMobile={isMobile} campaign={activeCampaign} />
        </Box>
      )}
      {loading && (
        <Skeleton
          animation="wave"
          variant="rectangular"
          width="100%"
          height={isMobile ? 500 : 400}
        />
      )}
      <Box mb={3} mt={isMobile ? 3 : 12} mx={isMobile ? 0 : 10}>
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
