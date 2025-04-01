// src/pages/Dashboard.js
import React from "react";
import { Box, Grid, useTheme } from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FlagIcon from "@mui/icons-material/Flag";
import PeopleIcon from "@mui/icons-material/People";
import DashboardCard from "../../components/Admin/DashboardCard";
import PageHeader from "../../components/Admin/PageHeader";
import { useReport } from "../../hooks/admin/useReport";
import { DetailCard } from "../../styles/ContainerStyles";
import PieChartData from "../../components/reports/PieChartData";
import LineGraphData from "../../components/reports/LineGraphData";
import BarChartData from "../../components/reports/BarChartData";

const Dashboard = () => {
  const theme = useTheme();
  const {
    stats,
    engagementData,
    generationTrendsData,
    selectedPeriod,
    handleFilterChange,
    generationLoading,
  } = useReport();
  return (
    <Box sx={{ p: { xs: 0, md: 3 }, maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Dashboard"
        description="Overview of your recipe recommendation system"
      />

      <Grid container spacing={3}>
        {/* Stats Cards */}

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Users"
            value={stats?.users}
            icon={<PeopleIcon />}
            color={theme.palette.info.main}
            progress={(stats?.users / 100) * 100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Recipes"
            value={stats?.recipes}
            icon={<MenuBookIcon />}
            color={theme.palette.success.main}
            progress={(stats?.recipes / 100) * 100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Cuisines"
            value={stats?.cuisines}
            icon={<FlagIcon />}
            color={theme.palette.warning.main}
            progress={(stats?.cuisines / 100) * 100}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Dietary Options"
            value={stats?.dietaryOptions}
            icon={<RestaurantIcon />}
            color={theme.palette.primary.main}
            progress={(stats?.dietaryOptions / 100) * 100}
          />
        </Grid>

        {/* Recipe Generation Trend */}
        <Grid item xs={12} mt={2}>
          <DetailCard
            sx={{
              boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)",
              borderRadius: "12px",
            }}
          >
            <BarChartData
              title="Recipe Generation Trends"
              data={generationTrendsData}
              loading={generationLoading}
            />
          </DetailCard>
        </Grid>

        {/* Community Trend Chart */}
        <Grid item xs={12} lg={6} mt={2}>
          <DetailCard
            sx={{
              boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)",
              borderRadius: "12px",
            }}
          >
            <LineGraphData
              data={engagementData}
              title="Community Engagment Trends (Last 7 days)"
            />
          </DetailCard>
        </Grid>

        {/* Recipe Categories */}
        <Grid item xs={12} lg={6} mt={2}>
          <DetailCard
            sx={{
              boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)",
              borderRadius: "12px",
            }}
          >
            <PieChartData
              data={stats?.cuisineDistribution}
              title="Cuisine Distribution (%)"
            />
          </DetailCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
