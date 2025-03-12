import React from "react";
import {
  Card,
  Box,
  Skeleton,
  useMediaQuery,
  CardContent,
  Stack,
} from "@mui/material";
import theme from "../../theme/theme";

const RecipeCardSkeleton = ({ width }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: isTablet ? "auto" : "180px",
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
        background: "#FFF",
        width: width ? width : "100%",
        mb: 2,
      }}
    >
      {/* Image skeleton */}
      <Box
        sx={{
          position: "relative",
          width: isMobile ? "100%" : isTablet ? "40%" : "35%",
          minWidth: isMobile ? "100%" : "180px",
        }}
      >
        <Skeleton
          variant="rectangular"
          height={isMobile ? "200px" : "100%"}
          width="100%"
          animation="wave"
          sx={{
            height: isMobile ? "200px" : "180px",
            backgroundColor: "#f5f5f5",
          }}
        />

        {/* Rating badge skeleton */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
          }}
        >
          <Skeleton variant="rounded" width={50} height={24} animation="wave" />
        </Box>

        {/* Category chip skeleton */}
        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <Skeleton variant="rounded" width={60} height={24} animation="wave" />
        </Box>
      </Box>

      {/* Content section skeleton */}
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
          {/* Title skeleton */}
          <Skeleton
            variant="text"
            width="80%"
            height={28}
            animation="wave"
            sx={{ mb: 1 }}
          />

          {/* Time and cuisine type skeleton */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mb: 2,
            }}
          >
            <Skeleton variant="text" width={80} height={24} animation="wave" />
            <Skeleton variant="text" width={80} height={24} animation="wave" />
          </Stack>

          {/* Dietary preferences skeleton */}
          <Stack direction="row" spacing={1} mt={1}>
            <Skeleton
              variant="rounded"
              width={70}
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
              width={70}
              height={24}
              animation="wave"
            />
          </Stack>
        </CardContent>

        {/* Save button skeleton */}
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
