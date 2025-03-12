import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Skeleton,
  IconButton,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { FavoriteBorderOutlined } from "@mui/icons-material";

const RecipeCardSkeleton = ({ isMobile, isTablet }) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Grid container spacing={3}>
          {/* Image Skeleton */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Skeleton
              variant="rectangular"
              width={isMobile ? "80%" : isTablet ? "100%" : "100%"}
              height={400}
              sx={{ borderRadius: 2, maxWidth: 350 }}
            />
          </Grid>

          {/* Text Content Skeleton */}
          <Grid item xs={12} md={6} position="relative">
            {/* Save Button Skeleton */}
            <Box sx={{ position: "absolute", top: 30, right: 10 }}>
              <IconButton>
                <FavoriteBorderOutlined sx={{ color: "lightgray" }} />
              </IconButton>
            </Box>

            <Box mt={5}>
              {/* Title */}
              <Skeleton width="60%" height={50} />

              {/* Short Description */}
              <Skeleton
                width="100%"
                height={120}
                sx={{ mt: 1, mb: 0, py: 0, px: 0, display: "block" }}
              />

              {/* Ratings */}
              <Box
                sx={{
                  alignItems: "center",
                  mt: 2,
                  mb: 0,
                  py: 0,
                  px: 0,
                  display: "block",
                }}
              >
                <Skeleton
                  width="100%"
                  height={60}
                  sx={{ mt: 1, mb: 0, py: 0, px: 0, display: "block" }}
                />
              </Box>

              {/* Cooking Time and Cuisine Type */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Skeleton width={80} height={20} />
                <Skeleton
                  width={80}
                  height={20}
                  sx={{ ml: 2, mb: 0, py: 0, px: 0, display: "block" }}
                />
              </Box>

              {/* Dietary Preferences Tags */}
              <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Skeleton variant="rounded" width={60} height={20} />
                <Skeleton variant="rounded" width={60} height={20} />
                <Skeleton variant="rounded" width={60} height={20} />
              </Box>

              {/* Nutrition Facts */}
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: 350,
                }}
              >
                {Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <Box key={index} sx={{ textAlign: "center" }}>
                      <Skeleton width={40} height={20} />
                      <Skeleton width={50} height={30} />
                    </Box>
                  ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box mt={2} display="flex" flexDirection="column">
          <Stack direction="row" spacing={1} m={0} p={0}>
            <Skeleton width={170} height={40}></Skeleton>
            <Skeleton width={170} height={40}></Skeleton>
          </Stack>
          <Skeleton width="90%" height={400} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCardSkeleton;
