import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { userSelector } from "../../../redux/selectors/selectors";
import { useSelector } from "react-redux";
import TimeBasedRecipeGrid from "./TimeBasedRecipeCard";
import { useRecipe } from "../../../hooks/useRecipe";
import TimeBasedRecipeCategories from "./TimeBasedCategorySelector";
import FilteredRecipesGrid from "./TimeBasedCategorySelector";

export const Greeting = () => {
  const [heading, setHeading] = React.useState("");
  const [bodyText, setBodyText] = React.useState("");
  const hour = new Date().getHours();

  const user = useSelector(userSelector);
  const { getTimedBasedRecipe, time, timeBasedRecipes } = useRecipe();

  React.useEffect(() => {
    getTimedBasedRecipe();
  }, []);

  const getGreetingText = () => {
    if (hour >= 5 && hour < 11) {
      setHeading("Good Morning");
      setBodyText("Ready to discover some tasty recipes?");
    } else if (hour >= 11 && hour < 17) {
      setHeading("Good Afternoon");
      setBodyText("Looking for delicious lunch meals?");
    } else if (hour >= 17 && hour < 21) {
      setHeading("Good Evening");
      setBodyText("Let's find a perfect recipe for tonight!");
    } else {
      setHeading("Nighty");
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
        {heading}, {user?.firstName}
      </Typography>
      <Typography variant="subtitle1" color="#bbb">
        {bodyText}
      </Typography>
      <FilteredRecipesGrid recipes={timeBasedRecipes} />
    </>
  );
};
