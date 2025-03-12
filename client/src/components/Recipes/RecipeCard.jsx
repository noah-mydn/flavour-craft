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
  Skeleton,
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

const RecipeCard = ({ recipe, width }) => {
  const { saveRecipe } = useRecipe();
  const navigate = useNavigate();
  const user = useSelector(userSelector);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
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
        height: isMobile
          ? "440px"
          : isTablet
          ? "410px"
          : isDesktop
          ? "415px"
          : "435px",
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
        background: "#FFF",
        width: width ? width : "auto",
        mb: 2,
      }}
    >
      <Box sx={{ position: "absolute", top: 10, right: 10 }}>
        <Chip
          label={recipe.tags[0]}
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
      </Box>

      <Box sx={{ position: "absolute", bottom: 0, right: 10 }}>
        <IconButton
          size="small"
          onClick={handleSaveRecipe}
          sx={{
            color: "white",
          }}
        >
          {saved ? (
            <Favorite color="primary" />
          ) : (
            <FavoriteBorderOutlined
              sx={{
                color: theme.palette.primary.light,
              }}
            />
          )}
        </IconButton>
      </Box>

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
          {recipe?.ratings?.average}
        </Typography>
      </Box>

      {/* Food image */}
      <CardMedia
        component="img"
        height={100}
        image={
          recipe?.thumbnail
            ? recipe?.thumbnail
            : "../recipe-thumbnail-fallback.png"
        }
        onClick={() => navigate(`/recipes/${recipe?._id}`)}
        loading={
          <Skeleton
            variant="rectangle"
            height={140}
            width={220}
            animation="wave"
          />
        }
        alt="recipe thumbnail"
        sx={{
          objectFit: "cover",
          backgroundColor: "#FFEFDD",
          p: 2,
        }}
      />

      <CardContent sx={{ pb: 1 }}>
        <Typography
          variant="body1"
          component="h2"
          fontWeight="bold"
          noWrap={false}
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
            //bgcolor: "background.paper",
            //borderRadius: 2,
            //p: 1,
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

          <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
            {recipe?.cuisineTypes[0]}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap" useFlexGap>
          {recipe?.dietaryPreferences?.slice(0, 2).map((tag, index) => (
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
    </Card>
  );
};

export default RecipeCard;
