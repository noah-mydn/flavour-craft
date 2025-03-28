import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { AccessTime as TimeIcon, Star as StarIcon } from "@mui/icons-material";

const TimeBasedRecipeGrid = ({ recipes, time }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Helper function to get time-specific color palette
  const getTimeBasedColor = () => {
    switch (time) {
      case "morning":
        return theme.palette.primary.light;
      case "afternoon":
        return theme.palette.secondary.light;
      case "evening":
        return theme.palette.warning.light;
      case "night":
        return theme.palette.info.light;
      default:
        return theme.palette.primary.main;
    }
  };

  // Render empty state if no recipes
  if (!recipes || recipes.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No recipes found for this time of day
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, mt: 2 }}>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          mb: 2,
          textAlign: "center",
          textTransform: "capitalize",
        }}
      >
        {time} Recommendations
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {recipes.map((recipe, index) => {
          // Calculate average rating
          const averageRating = recipe.ratings
            ? Object.values(recipe.ratings).reduce((a, b) => a + b, 0) /
              Object.keys(recipe.ratings).length
            : 0;

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={recipe._id || index}
              sx={{ display: "flex" }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 3,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={recipe.thumbnail}
                  alt={recipe.name}
                  sx={{
                    objectFit: "cover",
                    filter: "brightness(0.9)",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                      }}
                    >
                      {recipe.name}
                    </Typography>

                    {averageRating > 0 && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <StarIcon sx={{ color: "gold", fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {averageRating.toFixed(1)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <TimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.cookingTime}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {recipe.dietaryPreferences?.map((pref, idx) => (
                      <Chip
                        key={idx}
                        label={pref}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TimeBasedRecipeGrid;
