import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  useMediaQuery,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  FavoriteBorderOutlined,
  Favorite,
} from "@mui/icons-material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import React from "react";
import theme from "../../theme/theme";
import { normalizeTime } from "../../utils/timeFormatter";
import { useDispatch, useSelector } from "react-redux";
import { profileSelector } from "../../redux/selectors/selectors";
import { useNavigate } from "react-router-dom";
import { useRecipe } from "../../hooks/useRecipe";

const RecipeCard = ({ recipe, recipeId }) => {
  const navigate = useNavigate();
  const profile = useSelector(profileSelector);
  const { saveRecipe } = useRecipe();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [saved, setSaved] = React.useState(
    profile?.savedRecipes?.includes(recipe._id)
  );

  React.useEffect(() => {
    setSaved(profile?.savedRecipes?.includes(recipe._id));
  }, [profile]);

  const handleSaveRecipe = () => {
    saveRecipe(recipe?._id);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: isMobile ? "auto" : isTablet ? "160px" : "150px",
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
        background: "#FFF",
        mb: 2,
        width: "100%",
      }}
    >
      {/* Food image */}
      <Box
        sx={{
          position: "relative",
          width: isMobile ? "100%" : isTablet ? "40%" : "35%",
          minWidth: isMobile ? "100%" : "180px",
        }}
      >
        <CardMedia
          component="img"
          height={isMobile ? "200px" : "100%"}
          image={
            recipe?.thumbnail
              ? recipe?.thumbnail
              : "../recipe-thumbnail-fallback.png"
          }
          onClick={() => navigate(`/recipes/${recipe?._id}`)}
          alt="recipe thumbnail"
          sx={{
            objectFit: "cover",
            backgroundColor: "#FFEFDD",
            height: "100%",
            cursor: "pointer",
          }}
        />

        {/* Rating badge */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "#FFF",
            borderRadius: 4,
            px: 1,
            py: 0.5,
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <StarIcon sx={{ color: "#FFD700", fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2" fontWeight="medium">
            {recipe?.ratings?.average.toFixed(1)}
          </Typography>
        </Box>

        {/* Category chip */}
        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          {recipe?.tags?.length > 0 && (
            <Chip
              label={recipe?.tags[0]}
              size="small"
              sx={{
                fontSize: "0.7rem",
                height: 24,
                mr: 0.5,
                mb: 0.5,
                bgcolor: theme.palette.primary.main,
                color: "#fff",
              }}
            />
          )}
        </Box>
      </Box>

      {/* Content section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "100%" : "65%",
          position: "relative",
          p: 2,
        }}
      >
        <CardContent sx={{ flex: "1 0 auto", p: 1 }}>
          <Typography
            variant="body1"
            component="h2"
            fontWeight="bold"
            gutterBottom
          >
            {recipe?.name}
          </Typography>

          {/* Time and Cuisine Type */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              mb: 1,
              display: "inline-flex",
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            {/* Time section with clock icon */}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              <Typography
                variant="body2"
                component="span"
                sx={{ fontWeight: 500 }}
              >
                {normalizeTime(recipe?.cookingTime)}
              </Typography>
            </Stack>

            {/* Vertical divider */}
            <Box
              sx={{
                borderRight: "1px solid",
                borderColor: "divider",
                height: 24,
                mx: 1,
              }}
            />
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <MenuBookIcon sx={{ fontSize: 18 }} />
              <Typography
                variant="body2"
                component="span"
                sx={{ fontWeight: 500 }}
              >
                {recipe?.ingredients?.length} ingredients
              </Typography>
            </Stack>
            {/* Vertical divider */}
            <Box
              sx={{
                borderRight: "1px solid",
                borderColor: "divider",
                height: 24,
                mx: 1,
              }}
            />

            <Typography
              variant="body2"
              component="span"
              sx={{ fontWeight: 500 }}
            >
              {(recipe?.cuisineTypes && recipe?.cuisineTypes[0]) || "Unknown"}
            </Typography>
          </Stack>

          {/* Dietary Preferences */}
          <Stack
            direction="row"
            spacing={0.5}
            mt={1}
            flexWrap="wrap"
            useFlexGap
          >
            {recipe?.dietaryPreferences?.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  fontSize: "0.75rem",
                  height: 24,
                  mr: 0.5,
                  mb: 0.5,
                  color: "#fff",
                  border: `1px solid ${theme.palette.secondary.dark}`,
                  bgcolor: theme.palette.secondary.dark,
                }}
              />
            ))}
          </Stack>
        </CardContent>

        {/* Save button */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
          }}
        >
          <IconButton size="small" onClick={handleSaveRecipe}>
            {saved ? (
              <Favorite color="primary" />
            ) : (
              <FavoriteBorderOutlined color="primary" sx={{ opacity: 0.5 }} />
            )}
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default RecipeCard;
