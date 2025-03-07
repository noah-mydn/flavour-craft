import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StarIcon from "@mui/icons-material/Star";
import React from "react";
import theme from "../../theme/theme";
import {
  Favorite,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";

const RecipeCard = (props) => {
  const {
    title,
    image,
    rating,
    restaurant,
    time,
    calories,
    tags = [],
    onAddClick,
  } = props;
  return (
    <Box m={2}>
      <Card
        sx={{
          maxWidth: 220,
          height: "100%",
          borderRadius: 4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "visible",
          background: "#FFF",
        }}
      >
        {/* Rating badge */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
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
            {rating}
          </Typography>
        </Box>

        {/* Food image */}
        <CardMedia
          component="img"
          height="140"
          image="./thumbnail-removebg.png"
          alt="recipe thumbnail"
          sx={{
            objectFit: "contain",
            backgroundColor: "#FFF6E5",
            p: 2,
          }}
        />

        <CardContent sx={{ pb: 1 }}>
          {/* Title and Restaurant */}
          <Typography variant="h6" component="h2" fontWeight="bold" noWrap>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {restaurant}
          </Typography>

          {/* Time and Calories */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <AccessTimeIcon
              fontSize="small"
              sx={{ mr: 0.5, color: "text.secondary", fontSize: 16 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1.5 }}>
              30 mins
            </Typography>
          </Box>

          {/* Tags as Chips */}
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  height: 24,
                  mr: 0.5,
                  mb: 0.5,
                  bgcolor: "#f0f0f0",
                }}
              />
            ))}
          </Stack>
        </CardContent>

        {/* Add button */}
        <Box sx={{ position: "absolute", bottom: 10, right: 10 }}>
          <IconButton
            size="small"
            onClick={onAddClick}
            sx={{
              //bgcolor: theme.palette.primary.main,
              color: "white",
              //"&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
          >
            <FavoriteBorderOutlined
              sx={{
                color: theme.palette.primary.light,
              }}
            />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
};

export default RecipeCard;
