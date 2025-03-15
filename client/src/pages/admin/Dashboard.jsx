// src/pages/Dashboard.js
import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FlagIcon from "@mui/icons-material/Flag";
import PeopleIcon from "@mui/icons-material/People";
import DashboardCard from "../../components/Admin/DashboardCard";
import PageHeader from "../../components/Admin/PageHeader";

// Sample data for statistics
const generateRecipeData = [
  { month: "Jan", count: 120 },
  { month: "Feb", count: 150 },
  { month: "Mar", count: 200 },
  { month: "Apr", count: 180 },
  { month: "May", count: 220 },
  { month: "Jun", count: 250 },
];

const recipeCategoriesData = [
  { name: "Italian", value: 25 },
  { name: "Mexican", value: 18 },
  { name: "Asian", value: 22 },
  { name: "American", value: 15 },
  { name: "Mediterranean", value: 20 },
];

const reportStatusData = [
  { name: "Pending", value: 5 },
  { name: "Resolved", value: 12 },
  { name: "Rejected", value: 8 },
];

const COLORS = ["#ca3341", "#9bbd4c", "#457B9D", "#F4A261", "#2A9D8F"];

const Dashboard = () => {
  return (
    <Box>
      <PageHeader
        title="Dashboard"
        description="Overview of your recipe recommendation system"
      />

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Recipes"
            value="1,245"
            icon={<RestaurantIcon />}
            color="primary"
            progress={75}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Open Reports"
            value="5"
            icon={<FlagIcon />}
            color="error"
            progress={20}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Users"
            value="3,842"
            icon={<PeopleIcon />}
            color="success"
            progress={90}
          />
        </Grid>

        {/* Recipe Generation Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recipe Generation Trends
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={generateRecipeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill="#ca3341"
                      name="Recipes Generated"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recipe Categories */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recipe Categories
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={recipeCategoriesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {recipeCategoriesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle2">
                  Campaign Image Updated
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You updated the campaign image for "Summer Grilling" - 15
                  minutes ago
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle2">New Batch Generated</Typography>
                <Typography variant="body2" color="text.secondary">
                  25 Mediterranean diet recipes were generated - 2 hours ago
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle2">Report Resolved</Typography>
                <Typography variant="body2" color="text.secondary">
                  You marked the report for "Spicy Tuna Roll" as resolved - 4
                  hours ago
                </Typography>
              </Box>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <Button color="primary">View All Activity</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Report Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Report Statistics
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {reportStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "Pending"
                              ? "#F4A261"
                              : entry.name === "Resolved"
                              ? "#2A9D8F"
                              : "#ca3341"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FlagIcon />}
                >
                  Manage Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
