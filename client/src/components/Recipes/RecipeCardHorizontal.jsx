import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  FavoriteBorderOutlined,
  Favorite,
} from "@mui/icons-material";
import React from "react";
import theme from "../../theme/theme";
import { normalizeTime } from "../../utils/timeFormatter";
import { useRecipe } from "../../hooks/useRecipe";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selectors";
import { useNavigate } from "react-router-dom";

const RecipeCardHorizontal = ({ recipe, width }) => {
  const { saveRecipe } = useRecipe();
  const navigate = useNavigate();
  const user = useSelector(userSelector);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [saved, setSaved] = React.useState(
    user?.savedRecipes?.includes(recipe._id)
  );

  React.useEffect(() => {
    setSaved(user?.savedRecipes?.includes(recipe._id));
  }, [user, recipe._id]);

  const handleSaveRecipe = () => {
    saveRecipe(recipe?._id);
    setSaved(!saved);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 3,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        overflow: "hidden",
        width: width ? width : "100%",
        background: "#FFF",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      {/* Recipe Image */}
      <CardMedia
        component="img"
        image={
          recipe?.thumbnail
            ? recipe?.thumbnail
            : "../recipe-thumbnail-fallback.png"
        }
        alt={recipe?.name}
        sx={{
          width: isMobile ? "120px" : "160px",
          height: "auto",
          objectFit: "cover",
          cursor: "pointer",
          transition: "opacity 0.3s",
          "&:hover": { opacity: 0.9 },
        }}
        onClick={() => navigate(`/recipes/${recipe?._id}`)}
      />

      {/* Content Section */}
      <CardContent sx={{ flex: "1", padding: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Recipe Name */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {recipe?.name}
          </Typography>

          {/* Save Button */}
          <IconButton
            size="small"
            onClick={handleSaveRecipe}
            sx={{ color: saved ? theme.palette.primary.main : "grey.600" }}
          >
            {saved ? <Favorite /> : <FavoriteBorderOutlined />}
          </IconButton>
        </Stack>

        {/* Rating & Cooking Time */}
        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#FFF8E1",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            <StarIcon sx={{ color: "#FFD700", fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2" fontWeight="500">
              {recipe?.ratings?.average}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 16 }} />

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <AccessTimeIcon sx={{ fontSize: 18, color: "grey.600" }} />
            <Typography variant="body2" fontWeight="500" color="text.secondary">
              {normalizeTime(recipe?.cookingTime)}
            </Typography>
          </Stack>
        </Stack>

        {/* Cuisine Type & Dietary Preferences */}
        <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap">
          <Chip
            label={recipe?.cuisineTypes[0]}
            size="small"
            sx={{
              bgcolor: theme.palette.secondary.main,
              color: "#FFF",
              fontSize: "0.75rem",
            }}
          />
          {recipe?.dietaryPreferences?.slice(0, 2).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                bgcolor: theme.palette.primary.dark,
                color: "#FFF",
                fontSize: "0.75rem",
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RecipeCardHorizontal;
