import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Rating,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const PopularRecipeCard = (props) => {
  const {
    title,
    description,
    rating = 5,
    image,
    handsOnTime,
    totalTime,
    yield: recipeYield,
    onViewRecipe,
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: "100%",
          borderRadius: 1,
          overflow: "hidden",
          boxShadow: 1,
          height: isMobile ? 520 : 220,
        }}
      >
        <CardMedia
          component="img"
          image="./thumbnail.png"
          sx={{
            width: isMobile ? "100%" : "20%",
            height: "auto",
            objectFit: "cover",
          }}
          alt="recipe-thumbnail"
        />

        <CardContent
          sx={{
            flex: 1,
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              fontWeight="bold"
            >
              {title}
            </Typography>

            <Rating value={rating} readOnly sx={{ mb: 1 }} />

            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>

          <Box>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Yield
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {recipeYield}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={onViewRecipe}
              sx={{
                bgcolor: "#ff9800",
                "&:hover": {
                  bgcolor: "#f57c00",
                },
                px: 3,
                borderRadius: 1,
              }}
            >
              VIEW RECIPE
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PopularRecipeCard;
