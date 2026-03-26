import axios from "axios";
import { displayErrorToast } from "../../utils/toastUtil";
import { getAuthConfig } from "../../utils/authHeaders";
import React from "react";

export const useReport = () => {
  const [stats, setStats] = React.useState({
    users: 0,
    recipes: 0,
    cuisines: 0,
    dietaryOptions: 0,
    cuisineDistribution: [],
  });
  const [generationTrendsData, setGenerationTrendsData] = React.useState([]);
  const [engagementData, setEngagementData] = React.useState([]);

  const [statsLoading, setStatsLoading] = React.useState(false);
  const [engagementLoading, setEngagementLoading] = React.useState(false);
  const [generationLoading, setGenerationLoading] = React.useState(false);
  const [selectedPeriod, setSelectedPeriod] = React.useState("last7");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [selectedMonth, setSelectedMonth] = React.useState();
  const periods = [
    { value: "last7", label: "Last 7 Days" },
    { value: "this-year", label: "This Year" },
    { value: "monthly", label: "Monthly" },
  ];

  const BASE_URL = `${process.env.REACT_APP_BASE_API}/report`;

  const fetchReportStats = async () => {
    setStatsLoading(true);
    try {
      const response = await axios.get(BASE_URL + "/all", getAuthConfig());
      if (response.data.status === 200) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchEngagementTrend = async () => {
    setEngagementLoading(true);
    try {
      const response = await axios(
        BASE_URL + "/community/engagement-trend",
        getAuthConfig()
      );
      console.log(response.data);
      if (response.data.success === true) {
        setEngagementData(response.data.data);
      }
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    } finally {
      setEngagementLoading(false);
    }
  };

  const fetchRecipeGenerationTrend = async () => {
    setGenerationLoading(true);
    if (selectedPeriod === "monthly" && !selectedMonth) {
      return;
    }
    try {
      let monthlyFilter = selectedMonth ? `-${selectedMonth}` : "";
      console.log(
        BASE_URL +
          `/recipes/generation-trend?period=${selectedPeriod}${monthlyFilter}`
      );
      const response = await axios.get(
        BASE_URL +
          `/recipes/generation-trend?period=${selectedPeriod}${monthlyFilter}`,
        getAuthConfig()
      );
      console.log(response.data);
      if (response.data.status === 200) {
        setGenerationTrendsData(response.data.trends);
      }
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    const newPeriod = event.target.value;
    setSelectedPeriod(newPeriod);
    if (newPeriod !== "monthly") {
      setSelectedMonth("");
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  React.useEffect(() => {
    fetchReportStats();
    fetchEngagementTrend();

    if (selectedPeriod !== "monthly") {
      fetchRecipeGenerationTrend();
    }
  }, []);

  React.useEffect(() => {
    if (selectedPeriod !== "monthly") {
      fetchRecipeGenerationTrend();
    } else if (selectedPeriod === "monthly" && selectedMonth) {
      fetchRecipeGenerationTrend();
    } else {
    }

    console.log("GENERATION TRENDS:", generationTrendsData);
  }, [selectedPeriod, selectedMonth]);

  return {
    selectedPeriod,
    selectedMonth,
    months,
    periods,
    stats,
    generationTrendsData,
    engagementData,
    generationLoading,
    engagementLoading,
    statsLoading,
    handleFilterChange,
    handleMonthChange,
  };
};
