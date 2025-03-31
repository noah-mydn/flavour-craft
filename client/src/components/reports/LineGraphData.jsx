import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Typography, Box, useMediaQuery } from "@mui/material";
import theme from "../../theme/theme";

const LineGraphData = ({ data, title }) => {
  const dates = data.map((item) => item.date);
  const postsData = data.map((item) => item.totalPosts);
  const commentsData = data.map((item) => item.totalComments);

  const maxValue = Math.max(...postsData, ...commentsData);
  const yAxisMax = Math.ceil(maxValue * 1.2);

  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        color="primary.main"
        mt={3}
      >
        {title}
      </Typography>
      <LineChart
        height={300}
        width={isTablet ? 480 : 520}
        series={[
          {
            data: postsData,
            label: "Posts",
            color: "#3f51b5",
            curve: "linear",
            showMark: true,
          },
          {
            data: commentsData,
            label: "Comments",
            color: "#f50057",
            curve: "linear",
            showMark: true,
          },
        ]}
        xAxis={[
          {
            data: dates,
            scaleType: "point",
            label: "Date",
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: yAxisMax,
            label: "Count",
          },
        ]}
        sx={{
          ".MuiLineElement-root": {
            strokeWidth: 3,
          },
          ".MuiMarkElement-root": {
            stroke: "white",
            scale: "0.2",
            strokeWidth: 2,
          },
        }}
        slotProps={{
          legend: {
            position: {
              vertical: "top",
              horizontal: "right",
            },
          },
        }}
      />
    </Box>
  );
};

export default LineGraphData;
