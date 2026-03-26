import React from "react";
import {
  Card,
  CardContent,
  Box,
  Skeleton,
  Stack,
  useMediaQuery,
} from "@mui/material";
import theme from "../../theme/theme";

const RecipeCardSkeleton = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const calculatedMaxHeight = isMobile ? 380 : isTablet ? 430 : 450;

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
      {/* Skeleton for image */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        animation="wave"
      />

      {/* Skeleton for content */}
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
          {/* Title skeleton */}
          <Skeleton variant="text" width="70%" height={30} animation="wave" />

          {/* Time and cuisine skeleton */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 1 }}>
            <Skeleton
              variant="circular"
              width={20}
              height={20}
              animation="wave"
            />
            <Skeleton variant="text" width={60} height={24} animation="wave" />
            <Skeleton variant="text" width={80} height={24} animation="wave" />
          </Stack>

          {/* Dietary preferences skeleton */}
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" useFlexGap>
            <Skeleton
              variant="rounded"
              width={60}
              height={24}
              animation="wave"
            />
            <Skeleton
              variant="rounded"
              width={70}
              height={24}
              animation="wave"
            />
            <Skeleton
              variant="rounded"
              width={80}
              height={24}
              animation="wave"
            />
          </Stack>
        </CardContent>

        {/* Favorite button skeleton */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
          }}
        >
          <Skeleton
            variant="circular"
            width={32}
            height={32}
            animation="wave"
          />
        </Box>
      </Box>
    </Card>
  );
};

export default RecipeCardSkeleton;
