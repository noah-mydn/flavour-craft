import { Box } from "@mui/material";
import React from "react";
import { LogoArea } from "../styles/ContainerStyles";

const Home = () => {
  return (
    <Box padding={4} display="flex" justifyContent="space-between">
      <img src="./logo.png" alt="Logo" width={130} height={60} alt="logo" />
    </Box>
  );
};

export default Home;
