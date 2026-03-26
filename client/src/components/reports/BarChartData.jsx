import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
  CircularProgress,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useReport } from "../../hooks/admin/useReport";

const BarChartData = () => {
  const theme = useTheme();
  const {
    selectedPeriod,
    selectedMonth,
    months,
    periods,
    generationTrendsData,
    generationLoading,
    handleFilterChange,
    handleMonthChange,
  } = useReport();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [initialMonthlyLoad, setInitialMonthlyLoad] = React.useState(false);

  const handlePeriodChangeWithValidation = (event) => {
    const newPeriod = event.target.value;
    if (newPeriod === "monthly") {
      setInitialMonthlyLoad(true);
      const currentMonth = months[new Date().getMonth()];
      handleFilterChange(event);
      setTimeout(() => {
        handleMonthChange({ target: { value: currentMonth } });
        setInitialMonthlyLoad(false);
      }, 500);
    } else {
      handleFilterChange(event);
    }
  };

  const formatChartData = () => {
    if (!generationTrendsData || generationTrendsData.length === 0) {
      return { xLabels: [], datasets: [] };
    }

    let xLabels = [];
    let data = [];

    if (selectedPeriod === "last7") {
      xLabels = generationTrendsData.map((item) => item.date);
      data = generationTrendsData.map((item) => item.count);
    } else if (selectedPeriod === "this-year") {
      xLabels = generationTrendsData.map((item) => item.month);
      data = generationTrendsData.map((item) => item.count);
    } else if (selectedPeriod === "monthly" && selectedMonth) {
      xLabels = generationTrendsData.map((item) => {
        const parts = item.date?.split(" ");
        return parts && parts.length > 1 ? parts[1] : item.date;
      });
      data = generationTrendsData.map((item) => item.count);
    }

    return { xLabels, data };
  };

  const { xLabels, data } = formatChartData();
  const shouldShowChart =
    data?.length > 0 &&
    !(selectedPeriod === "monthly" && !selectedMonth) &&
    !initialMonthlyLoad;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Filters */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        sx={{
          mb: 3,
          justifyContent: isMobile ? "center" : "flex-end",
          alignItems: isMobile ? "center" : "flex-start",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="period-select-label">Period</InputLabel>
          <Select
            labelId="period-select-label"
            id="period-select"
            value={selectedPeriod}
            label="Period"
            onChange={handlePeriodChangeWithValidation}
          >
            {periods.map((period) => (
              <MenuItem key={period.value} value={period.value}>
                {period.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedPeriod === "monthly" && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth}
              label="Month"
              onChange={handleMonthChange}
              disabled={initialMonthlyLoad}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>

      {/* Title */}
      <Typography
        variant={isMobile ? "subtitle1" : "h6"}
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        color="primary.main"
        mt={2}
      >
        Recipe Generation Trends
      </Typography>

      {/* Chart or Loading */}
      {generationLoading || initialMonthlyLoad ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 250,
          }}
        >
          <CircularProgress />
        </Box>
      ) : shouldShowChart ? (
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            height: isMobile ? 300 : 400,
          }}
        >
          <BarChart
            dataset={data.map((value, index) => ({
              value,
              category: xLabels[index],
            }))}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "category",
                label:
                  selectedPeriod === "this-year"
                    ? "Month"
                    : selectedPeriod === "monthly"
                    ? "Day"
                    : "Date",
              },
            ]}
            series={[
              {
                dataKey: "value",
                label: "Recipes Generated",
                color: theme.palette.secondary.dark,
                valueFormatter: (value) => value.toString(),
              },
            ]}
            height={isMobile ? 300 : 420}
            margin={{
              top: 30,
              bottom: isMobile ? 70 : 50,
              left: isMobile ? 30 : 60,
              right: 10,
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 250,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {selectedPeriod === "monthly" && !selectedMonth
              ? "Please select a month to view data"
              : "No data available"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BarChartData;
