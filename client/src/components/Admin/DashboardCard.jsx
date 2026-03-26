import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)",
  borderRadius: "12px",
  background: "white",
  transition: "transform 0.2s ease-in-out",
  // "&:hover": {
  //   transform: "translateY(-4px)",
  //   boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  // },
}));

const DashboardCard = ({
  title,
  value,
  icon,
  color,
  progress = null,
  loading,
}) => {
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={2}>
          {loading ? (
            <Skeleton variant="text" width={100} />
          ) : (
            <Typography variant="h6" component="div" color="text.secondary">
              {title}
            </Typography>
          )}
          {loading ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : (
            <Box
              sx={{
                backgroundColor: `${color}`,
                color: "#fff",
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
          )}
        </Box>
        {loading ? (
          <Skeleton variant="text" width={60} />
        ) : (
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
        )}
        {progress !== null && !loading && (
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
        {loading && <Skeleton variant="text" width={200} />}
      </CardContent>
    </StyledCard>
  );
};

export default DashboardCard;
