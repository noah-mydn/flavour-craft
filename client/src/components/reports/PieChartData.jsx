import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useMediaQuery, Box, Typography, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";

const PieChartData = ({ data, title }) => {
  const theme = useTheme();

  const colors = [
    theme?.palette?.info?.main,
    theme?.palette?.success?.main,
    theme?.palette?.warning?.main,
    theme?.palette?.error?.main,
    theme?.palette?.secondary?.main,
    theme?.palette?.primary?.dark,
  ];

  return (
    <React.Fragment>
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={6}
        sx={{ p: 3 }}
      >
        {/* Pie Chart */}
        <Box>
          <PieChart
            height={250}
            width={250}
            margin={{ right: 0, left: 0 }}
            series={[
              {
                data: data.map((item, index) => ({
                  id: index,
                  value: item.count,
                  label: item._id,
                })),
                innerRadius: 40,
                arcLabel: (params) => `${params.label}`,
                arcLabelMinAngle: 10,
                arcLabelRadius: "70%",
                paddingAngle: 1,
                cornerRadius: 5,
              },
            ]}
            slotProps={{
              legend: { hidden: true },
              popper: {
                sx: {
                  "& .MuiChartsTooltip-paper": {
                    "& .MuiChartsTooltip-labelCell": {
                      color: theme.palette.text.primary,
                    },
                  },
                },
              },
            }}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontWeight: "bold",
                fontSize: "0.75rem",
              },
            }}
            colors={colors}
          />
        </Box>

        {/* Legend */}
        <Box mt={2}>
          {data.map((item, index) => (
            <Stack key={item._id} direction="row" mt={1} alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors[index % colors.length],
                  borderRadius: "50%",
                  mr: 1,
                }}
              />
              <Typography variant="body2">
                {item._id} ({parseFloat(item.percentage).toFixed(1)}%)
              </Typography>
            </Stack>
          ))}
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default PieChartData;
