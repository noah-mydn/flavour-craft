import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Typography, Box, useMediaQuery, useTheme } from "@mui/material";

const LineGraphData = ({ data, title }) => {
  const theme = useTheme();
  const dates = data.map((item) => item.date);
  const postsData = data.map((item) => item.totalPosts);
  const commentsData = data.map((item) => item.totalComments);

  const maxValue = Math.max(...postsData, ...commentsData);
  const yAxisMax = Math.ceil(maxValue * 1.2);

  // More granular responsive breakpoints
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isXsMobile = useMediaQuery(theme.breakpoints.down("xs"));

  // Determine chart dimensions based on screen size
  const getChartWidth = () => {
    if (isDesktop) return 520;
    if (isTablet) return 480;
    if (isMobile) return 340;
    if (isXsMobile) return 280;
    return 300; // Fallback
  };

  const getChartHeight = () => {
    if (isMobile) return 250;
    return 300;
  };

  // Handle date label display for smaller screens
  const formatDateLabels = () => {
    if (isMobile && dates.length > 5) {
      // For mobile, show fewer date labels to prevent overcrowding
      const visibleIndices = [];
      const step = Math.ceil(dates.length / 4);
      for (let i = 0; i < dates.length; i += step) {
        visibleIndices.push(i);
      }

      return dates.map((date, index) =>
        visibleIndices.includes(index) ? date : ""
      );
    }
    return dates;
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden", // Prevent horizontal scrolling
        px: isMobile ? 1 : 2, // Padding adjustment for mobile
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        color="primary.main"
        mt={2}
        sx={{
          fontSize: isMobile ? "1rem" : "1.25rem",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          overflow: "auto", // Allow horizontal scrolling only when needed
        }}
      >
        <LineChart
          height={getChartHeight()}
          width={getChartWidth()}
          margin={{
            top: 20,
            right: isMobile ? 30 : 40,
            bottom: isMobile ? 35 : 50,
            left: isMobile ? 40 : 50,
          }}
          series={[
            {
              data: postsData,
              label: "Posts",
              color: "#3f51b5",
              curve: "linear",
              showMark: !isMobile,
            },
            {
              data: commentsData,
              label: "Comments",
              color: "#f50057",
              curve: "linear",
              showMark: !isMobile,
            },
          ]}
          xAxis={[
            {
              data: formatDateLabels(),
              scaleType: "point",
              label: "Date",

              tickLabelStyle: {
                angle: 0,
                textAnchor: isMobile ? "start" : "middle",
                fontSize: isMobile ? 10 : 12,
              },
            },
          ]}
          yAxis={[
            {
              min: 0,
              max: yAxisMax,
              label: "Count",
              tickNumber: isMobile ? 5 : 8, // Fewer ticks on mobile
            },
          ]}
          sx={{
            ".MuiLineElement-root": {
              strokeWidth: isMobile ? 2 : 3,
            },
            ".MuiMarkElement-root": {
              stroke: "white",
              scale: isMobile ? "0.1" : "0.2",
              strokeWidth: isMobile ? 1 : 2,
            },
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          }}
          slotProps={{
            legend: {
              position: {
                vertical: "top",
                horizontal: isMobile ? "center" : "right",
              },
              itemGap: isMobile ? 8 : 12,
              fontSize: isMobile ? 12 : 14,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default LineGraphData;
