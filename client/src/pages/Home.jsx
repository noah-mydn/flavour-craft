import { Box } from "@mui/material";
import React from "react";
import { LogoArea, HomeContainer } from "../styles/ContainerStyles";
import Preferences from "../components/Preferences/Preferences";

const Home = ({ isMobile }) => {
  return (
    <>
      {/* <Box padding={4} display="flex" justifyContent="space-between">
        <img src="./logo.png" alt="Logo" width={130} height={60} />
      </Box> */}
      <HomeContainer>
        <Preferences isMobile={isMobile} />
      </HomeContainer>
    </>
  );
};

export default Home;
