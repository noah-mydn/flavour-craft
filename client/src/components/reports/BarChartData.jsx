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
    fetchRecipeGenerationTrend,
  } = useReport();

  // Prevent API call until month is selected
  const [initialMonthlyLoad, setInitialMonthlyLoad] = React.useState(false);

  // Handle period change with special handling for monthly
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

  // Format data for the chart
  const formatChartData = () => {
    if (!generationTrendsData || generationTrendsData?.length === 0) {
      return { xLabels: [], datasets: [] };
    }

    let xLabels = [];
    let data = [];

    if (selectedPeriod === "last7") {
      // For last 7 days, use date labels
      xLabels = generationTrendsData.map((item) => item.date);
      data = generationTrendsData.map((item) => item.count);
    } else if (selectedPeriod === "this-year") {
      // For yearly view, use month labels
      xLabels = generationTrendsData.map((item) => item.month);
      data = generationTrendsData.map((item) => item.count);
    } else if (selectedPeriod === "monthly" && selectedMonth) {
      // For monthly view, correctly use date property
      xLabels = generationTrendsData.map((item) => {
        // Extract day from date string (e.g. "Mar 3" -> "3")
        const parts = item.date?.split(" ");
        return parts && parts.length > 1 ? parts[1] : item.date;
      });
      data = generationTrendsData.map((item) => item.count);
    }

    return { xLabels, data };
  };

  const { xLabels, data } = formatChartData();

  const getLabel = () => {
    if (selectedPeriod === "last7") {
      return "Recipe Generation - Last 7 Days";
    } else if (selectedPeriod === "this-year") {
      return "Recipe Generation - This Year";
    } else if (selectedPeriod === "monthly" && selectedMonth) {
      return `Recipe Generation - ${selectedMonth} ${new Date().getFullYear()}`;
    }
    return "Recipe Generation Trends";
  };

  // Determine if we should show the chart
  const shouldShowChart =
    data?.length > 0 &&
    !(selectedPeriod === "monthly" && !selectedMonth) &&
    !initialMonthlyLoad;

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 3, justifyContent: "flex-end" }}
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

      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        color="primary.main"
        mt={3}
      >
        {getLabel()}
      </Typography>

      {generationLoading || initialMonthlyLoad ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <CircularProgress />
        </Box>
      ) : shouldShowChart ? (
        <Box sx={{ height: 400, width: "100%" }}>
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
                color: theme.palette.primary.main,
                valueFormatter: (value) => value.toString(),
              },
            ]}
            height={400}
            margin={{ top: 20, bottom: 50, left: 60, right: 30 }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <Typography variant="body1" color="text.secondary">
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
