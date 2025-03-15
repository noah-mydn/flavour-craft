import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  borderRadius: "12px",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  },
}));

const DashboardCard = ({ title, value, icon, color, progress = null }) => {
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="div" color="text.secondary">
            {title}
          </Typography>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              color: color,
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" component="div" fontWeight="bold">
          {value}
        </Typography>
        {progress !== null && (
          <Box mt={2}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(0,0,0,0.05)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  backgroundColor: color,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default DashboardCard;
