import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Typography, Box, useMediaQuery, useTheme } from "@mui/material";

const LineChartData = ({ data, title }) => {
  const themeContext = useTheme();

  const isSmallScreen = useMediaQuery(themeContext.breakpoints.down("sm"));
  const isExtraSmall = useMediaQuery(themeContext.breakpoints.down("xs"));
  const isLargeScreen = useMediaQuery(themeContext.breakpoints.up("lg"));
  const isMidScreen = useMediaQuery(
    themeContext.breakpoints.between("sm", "lg")
  );

  const dateList = data.map((entry) => entry.date);
  const postCounts = data.map((entry) => entry.totalPosts);
  const commentCounts = data.map((entry) => entry.totalComments);

  const highestPoint = Math.max(...postCounts, ...commentCounts);
  const dynamicMaxY = Math.ceil(highestPoint * 1.2);

  const calculateChartWidth = () => {
    if (isLargeScreen) return 520;
    if (isMidScreen) return 480;
    if (isSmallScreen) return 340;
    if (isExtraSmall) return 280;
    return 300;
  };

  const calculateChartHeight = () => (isSmallScreen ? 250 : 300);

  const getReducedDateLabels = () => {
    if (isSmallScreen && dateList.length > 5) {
      const shownIndices = [];
      const interval = Math.ceil(dateList.length / 4);
      for (let i = 0; i < dateList.length; i += interval) {
        shownIndices.push(i);
      }
      return dateList.map((label, idx) =>
        shownIndices.includes(idx) ? label : ""
      );
    }
    return dateList;
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        px: isSmallScreen ? 1 : 2,
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
          fontSize: isSmallScreen ? "1rem" : "1.25rem",
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          overflow: "auto",
        }}
      >
        <LineChart
          height={calculateChartHeight()}
          width={calculateChartWidth()}
          margin={{
            top: 20,
            right: isSmallScreen ? 30 : 40,
            bottom: isSmallScreen ? 35 : 50,
            left: isSmallScreen ? 40 : 50,
          }}
          series={[
            {
              data: postCounts,
              label: "Posts",
              color: "#3f51b5",
              curve: "linear",
              showMark: !isSmallScreen,
            },
            {
              data: commentCounts,
              label: "Comments",
              color: "#f50057",
              curve: "linear",
              showMark: !isSmallScreen,
            },
          ]}
          xAxis={[
            {
              data: getReducedDateLabels(),
              scaleType: "point",
              label: "Date",
              tickLabelStyle: {
                angle: 0,
                textAnchor: isSmallScreen ? "start" : "middle",
                fontSize: isSmallScreen ? 10 : 12,
              },
            },
          ]}
          yAxis={[
            {
              min: 0,
              max: dynamicMaxY,
              label: "Count",
              tickNumber: isSmallScreen ? 5 : 8,
            },
          ]}
          sx={{
            ".MuiLineElement-root": {
              strokeWidth: isSmallScreen ? 2 : 3,
            },
            ".MuiMarkElement-root": {
              stroke: "white",
              scale: isSmallScreen ? "0.1" : "0.2",
              strokeWidth: isSmallScreen ? 1 : 2,
            },
            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
          }}
          slotProps={{
            legend: {
              position: {
                vertical: "top",
                horizontal: isSmallScreen ? "center" : "right",
              },
              itemGap: isSmallScreen ? 8 : 12,
              fontSize: isSmallScreen ? 12 : 14,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default LineChartData;
