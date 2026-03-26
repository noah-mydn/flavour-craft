import React from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Container,
  useMediaQuery,
  useTheme,
  CardMedia,
  alpha,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  LocalDining as CuisineIcon,
  Restaurant as IngredientsIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import Flag from "react-world-flags";
import cuisineFlags from "../../constants/flags";
import { DetailCard } from "../../styles/ContainerStyles";

const GeneratedRecipeCard = ({ recipe }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  return (
    <DetailCard
      sx={{
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        borderRadius: 3,
      }}
    >
      {/* Main content layout */}
      <Grid container>
        {/* Left side - Image */}
        <Grid item xs={12} md={6} lg={5}>
          <Box sx={{ position: "relative", height: "100%" }}>
            <CardMedia
              component="img"
              src={recipe?.thumbnail}
              alt={recipe?.name}
              sx={{
                width: "100%",
                height: isMobile ? 240 : "100%",
                objectFit: "cover",
              }}
            />
            {/* Tags chips */}
            <Box sx={{ position: "absolute", top: 15, left: 10 }}>
              {recipe?.dietaryPreferences?.map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    height: 24,
                    mr: 0.5,
                    mb: 0.5,
                    bgcolor: theme.palette.secondary.dark,
                    color: "#fff",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Right side - Info */}
        <Grid item xs={12} md={6} lg={7} px={2}>
          <Box sx={{ p: 1 }}>
            {/* Recipe Name */}
            <Typography
              variant="h5"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                mb: 2,
                color: theme.palette.text.primary,
              }}
            >
              {recipe.name}
            </Typography>

            {/* Nutritional info */}
            <Paper
              elevation={0}
              sx={{
                bgcolor: "transparent",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: 350,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle2" color="primary">
                    Calories
                  </Typography>
                  <Typography variant="body1">
                    {recipe?.nutritionalInfo?.calories}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle2" color="primary">
                    Fat
                  </Typography>
                  <Typography variant="body1">
                    {recipe?.nutritionalInfo?.fat}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle2" color="primary">
                    Carbs
                  </Typography>
                  <Typography variant="body1">
                    {recipe?.nutritionalInfo?.carbs}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle2" color="primary">
                    Protein
                  </Typography>
                  <Typography variant="body1">
                    {recipe?.nutritionalInfo?.protein}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Dietary Tags */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                {recipe.tags?.map((pref, index) => (
                  <Chip
                    key={index}
                    label={pref}
                    size="small"
                    sx={{
                      mr: 1,
                      mb: 1,
                      color: "#fff",
                      backgroundColor: theme.palette.text.secondary,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom section - Full width */}
      <Box
        sx={{
          pb: 3,
          pt: isMobile ? 0 : 1,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          // display: "flex",
          // justifyContent: "center",
          // flexDirection: "column",
          // alignItems: "center",
          width: "100%",
        }}
      >
        {/* Quick Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 1 },
            my: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: theme.palette.text.secondary,
            }}
          >
            <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2">{recipe.cookingTime}</Typography>
          </Box>

          {!isMobile && (
            <Box
              sx={{
                borderRight: "1px solid",
                borderColor: "divider",
                height: 20,
                mx: 1,
              }}
            />
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: theme.palette.text.secondary,
            }}
          >
            <IngredientsIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2">
              {recipe.ingredients?.length} Ingredients
            </Typography>
          </Box>

          {!isMobile && (
            <Box
              sx={{
                borderRight: "1px solid",
                borderColor: "divider",
                height: 20,
                mx: 1,
              }}
            />
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: theme.palette.text.secondary,
            }}
          >
            <Flag
              code={
                cuisineFlags[
                  recipe?.cuisineTypes?.length > 0 && recipe?.cuisineTypes[0]
                ]
              }
              style={{
                width: 24,
                height: 16,
                marginRight: 8,
              }}
            />
            <Typography variant="body2">
              {recipe?.cuisineTypes?.length > 0
                ? recipe.cuisineTypes[0]
                : "Unknown"}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            //px: { sm: 0, md: 6 },
            lineHeight: 1.6,
          }}
        >
          {recipe.shortDescription}
        </Typography>

        {/* Action Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size={isMobile ? "medium" : "large"}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              boxShadow: 2,
            }}
            onClick={() => navigate(`/recipes/${recipe?._id}`)}
          >
            View Full Recipe
          </Button>
        </Box>
      </Box>
    </DetailCard>
  );
};

export default GeneratedRecipeCard;
