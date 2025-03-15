import React from "react";
import { Box, Typography, Button } from "@mui/material";

const PageHeader = ({ title, description }) => {
  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="h3" component="h1">
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary" mt={1}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
