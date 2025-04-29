import React from "react";
import { Box, Typography, useTheme, useMediaQuery, Grid } from "@mui/material";

import { userSelector } from "../../../redux/selectors/selectors";
import { useSelector } from "react-redux";

import { useRecipe } from "../../../hooks/useRecipe";
import RecipeCard from "../RecipeCard";
import CarouselRecpieCard from "./CarouselRecipeCard";
import Carousel from "./Carousel";

export const Greeting = ({ heading }) => {
  const [greeting, setGreeting] = React.useState("");
  const [bodyText, setBodyText] = React.useState("");
  const hour = new Date().getHours();
  const theme = useTheme();

  const user = useSelector(userSelector);
  const { getTimedBasedRecipe, time, timeBasedRecipes } = useRecipe();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    getTimedBasedRecipe();
  }, []);

  console.log(timeBasedRecipes);

  const getGreetingText = () => {
    if (hour >= 5 && hour < 11) {
      setGreeting("Good Morning");
      setBodyText("Ready to discover some tasty recipes?");
    } else if (hour >= 11 && hour < 17) {
      setGreeting("Good Afternoon");
      setBodyText("Looking for delicious lunch meals?");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening");
      setBodyText("Let's find a perfect recipe for tonight!");
    } else {
      setGreeting("Nighty");
      setBodyText("Looking for quick and easy late night snacks?");
    }
  };

  React.useEffect(() => {
    getGreetingText();
  }, []);

  return (
    <>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="primary.main"
        gutterBottom
      >
        {greeting}, {user?.firstName}
      </Typography>
      <Typography variant="subtitle1" color="#bbb">
        {bodyText}
      </Typography>

      <Box my={3}>
        <Typography
          fontWeight="bold"
          width="100%"
          variant={isMobile ? "h5" : "h4"}
          color="primary.light"
          gutterBottom
          textAlign="center"
          fontFamily={theme.typography.fontFamily[0]}
        >
          "{heading}"
        </Typography>
        <Carousel recipes={timeBasedRecipes} infinite={false} />
      </Box>
    </>
  );
};
