import React from "react";
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
  alpha,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  FavoriteBorderOutlined,
  Favorite,
} from "@mui/icons-material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import theme from "../../theme/theme";
import { normalizeTime } from "../../utils/timeFormatter";
import { useDispatch, useSelector } from "react-redux";
import { profileSelector } from "../../redux/selectors/selectors";
import { useNavigate } from "react-router-dom";
import { useRecipe } from "../../hooks/useRecipe";

const RecipeCard = ({ recipe, recipeId }) => {
  const navigate = useNavigate();
  const profile = useSelector(profileSelector);
  const { handleSaveRecipe } = useRecipe();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const calculatedMaxHeight = isMobile ? 380 : isTablet ? 430 : 450;

  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const saved = profile?.savedRecipes?.includes(recipe?._id);
    setSaved(saved);
  }, [profile, recipe]);

  const likeRecipe = () => {
    let success = handleSaveRecipe(recipe?._id);
    if (success) {
      setSaved(!saved);
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
        background: "#FFF",
        mb: 2,
        width: "100%",
        maxHeight: calculatedMaxHeight,
        height: 370,
        margin: "0 auto",
      }}
    >
      {/* Food image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 200,
        }}
      >
        <CardMedia
          component="img"
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

        {/* Tags chip */}
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
                bgcolor: theme.palette.secondary.dark,
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
          position: "relative",
          p: 2,
          flex: 1,
        }}
      >
        <CardContent sx={{ flex: "1 0 auto", p: 1 }}>
          <Typography
            variant="body1"
            component="h2"
            fontWeight="bold"
            gutterBottom
          >
            {truncateText(recipe?.name, 35)}
          </Typography>

          {/* Time and Cuisine Type */}
          <Stack
            direction="column"
            spacing={1}
            sx={{
              mb: 1,
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            {/* Time section */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              <Typography
                variant="body2"
                component="span"
                sx={{ fontWeight: 500 }}
              >
                {normalizeTime(recipe?.cookingTime)}
              </Typography>

              <Box
                sx={{
                  borderRight: "1px solid",
                  borderColor: "divider",
                  height: 24,
                  mx: 1,
                }}
              />

              {/* <MenuBookIcon sx={{ fontSize: 18 }} />
              <Typography
                variant="body2"
                component="span"
                sx={{ fontWeight: 500 }}
              >
                {recipe?.ingredients?.length} ingredients
              </Typography> */}
              {/* Cuisine Type */}
              <Typography
                variant="body2"
                component="span"
                sx={{ fontWeight: 500, color: "text.secondary" }}
              >
                {(recipe?.cuisineTypes && recipe?.cuisineTypes[0]) || "Unknown"}
              </Typography>
            </Stack>
          </Stack>

          {/* Dietary Preferences */}
          <Stack
            direction="row"
            spacing={0.5}
            mt={1}
            flexWrap="wrap"
            useFlexGap
          >
            {recipe?.dietaryPreferences?.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: "medium",
                  height: 24,
                  mr: 0.5,
                  mb: 0.5,
                  color: theme.palette.info.main,
                  // border: `1px solid ${theme.palette.secondary.dark}`,
                  bgcolor: alpha(theme.palette.info.light, 0.1),
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
          <IconButton size="small" onClick={likeRecipe}>
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
