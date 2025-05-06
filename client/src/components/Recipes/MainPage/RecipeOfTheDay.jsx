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
  Rating,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  LocalDining as CuisineIcon,
  Restaurant as IngredientsIcon,
  Star,
} from "@mui/icons-material";
import { DetailCard } from "../../../styles/ContainerStyles";
import { useNavigate } from "react-router-dom";
import Flag from "react-world-flags";
import cuisineFlags from "../../../constants/flags";

const RecipeOfTheDay = ({ recipe }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  return (
    <Box>
      <Typography
        fontWeight="bold"
        width="100%"
        variant={isMobile ? "h5" : "h4"}
        color="primary.light"
        gutterBottom
        textAlign="center"
        fontFamily={theme.typography.fontFamily[0]}
      >
        "Recipe of the Day"
      </Typography>

      <DetailCard
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
          gridTemplateRows: isMobile ? "auto 1fr" : "1fr",
          gap: 2,
          mt: 4,
          boxShadow: 1.5,
        }}
      >
        {/* Recipe Image */}
        <CardMedia
          component="img"
          src={recipe?.thumbnail}
          alt={recipe?.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            gridRow: isMobile ? "1 / 2" : "1 / -1",
            gridColumn: isMobile ? "1 / -1" : "1 / 2",
            position: "relative",
          }}
        />
        {/* Tags chip */}
        <Box sx={{ position: "absolute", top: 15, left: 10 }}>
          {recipe?.tags &&
            recipe?.tags?.map((tag) => {
              return (
                <Chip
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
              );
            })}
        </Box>
        {/* Recipe Details */}
        <Container
          maxWidth="md"
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            py: 4,
            px: { xs: 2, sm: 4 },
            gridRow: isMobile ? "2 / 3" : "1 / -1",
            gridColumn: isMobile ? "1 / -1" : "2 / 3",
          }}
        >
          {" "}
          {/* Recipe Name */}
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{
              textAlign: "center",
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            {recipe.name}
          </Typography>
          {/* Quick Info */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: theme.palette.text.secondary,
              }}
            >
              <AccessTimeIcon />
              <Typography variant="body2">{recipe.cookingTime}</Typography>
            </Box>
            <Box
              sx={{
                borderRight: "1px solid",
                borderColor: "divider",
                height: 24,
                mx: 1,
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: theme.palette.text.secondary,
              }}
            >
              <IngredientsIcon />
              <Typography variant="body2">
                {recipe.ingredients?.length} Ingredients
              </Typography>
            </Box>
            <Box
              sx={{
                borderRight: "1px solid",
                borderColor: "divider",
                height: 24,
                mx: 1,
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
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
                  width: 25,
                  height: 15,
                  marginRight: 4,
                }}
              />
              <Typography variant="body2">
                {recipe?.cuisineTypes?.length > 0
                  ? recipe.cuisineTypes[0]
                  : "Unknown"}
              </Typography>
            </Box>
          </Box>
          {/* Dietary Tags */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            {recipe.dietaryPreferences?.map((pref, index) => (
              <Chip
                key={index}
                label={pref}
                size="small"
                sx={{
                  color: theme.palette.info.main,
                  backgroun: alpha(theme.palette.info.main, 0.08),
                }}
              />
            ))}
          </Box>
          {/* Rating */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Rating
              value={recipe?.ratings?.average?.toFixed(1)}
              precision={1}
              max={5}
              readOnly
              sx={{ color: "#FFD700" }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {recipe?.ratings?.average?.toFixed(1)}
            </Typography>
          </Box>
          {/* Short Description */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: "center",
              mb: 3,
              px: { xs: 1, sm: 4 },
            }}
          >
            {recipe.shortDescription}
          </Typography>
          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: "auto",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
              }}
              onClick={() => navigate(`/recipes/${recipe?._id}`)}
            >
              View Full Recipe
            </Button>
          </Box>
        </Container>
      </DetailCard>
    </Box>
  );
};

export default RecipeOfTheDay;
