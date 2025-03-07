import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import React from "react";

const RecipeCarousel = () => {
  const [recipeCard, setRecipeCard] = React.useState([]);
  const [recipeCardIndex, setRecipeCardIndex] = React.useState(0);
  const [slideDir, setSlideDir] = React.useState("left");

  const recipeCardsPerPage = 4;
  const duplicateCards = Array.from({ length: 10 }, (_, i) => <Card key={1} />);
  const containerWidth = recipeCardsPerPage * 250;

  const goNext = () => {
    setSlideDir("left");
    setRecipeCardIndex(recipeCardIndex + 1);
  };

  const goPrev = () => {
    setSlideDir("right");
    setRecipeCardIndex(recipeCardIndex - 1);
  };

  React.useEffect(() => {
    setRecipeCard(duplicateCards);
  }, []);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      marginTop="7.5rem"
    >
      <Stack spacing={1} alignItems="center" marginBottom="60px">
        <Typography variant="h4">Trending Recipes</Typography>
        <Typography variant="body1" color="text.secondary">
          Explore new dishes and level-up your taste{" "}
        </Typography>
      </Stack>

      <Box
        bgcolor="red"
        display="flex"
        flexDirection="column"
        alignItems="center"
        alignContent="center"
        justifyContent="center"
        height="400px"
      >
        <IconButton
          onClick={goPrev}
          sx={{ margin: 4 }}
          disabled={recipeCardIndex === 0}
        >
          <NavigateBefore />
        </IconButton>
        <Box width={containerWidth} height="100%"></Box>
        <IconButton
          onClick={goNext}
          sx={{ margin: 4 }}
          disabled={
            recipeCardIndex >=
            Math.ceil((recipeCard.length || 0) / recipeCardsPerPage) - 1
          }
        >
          <NavigateNext />
        </IconButton>
      </Box>
    </Stack>
  );
};

export default RecipeCarousel;
