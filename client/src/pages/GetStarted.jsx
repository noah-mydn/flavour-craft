import React from "react";
import { Box, Typography } from "@mui/material";
import {
  HeadingsContainer,
  LogoArea,
  MainContainer,
  WelcomeButton,
} from "../styles/ContainerStyles";
import SendIcon from "@mui/icons-material/Send";
import theme from "../theme/theme";
import { useNavigate } from "react-router-dom";

const GetStarted = ({ isMobile, isTablet }) => {
  const navigate = useNavigate();

  const goToAuth = () => {
    navigate("/auth");
  };

  return (
    <>
      <LogoArea>
        <img src="./logo.png" width={130} height={60} alt="logo" />
      </LogoArea>
      <MainContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: isMobile ? "auto" : "",
            marginTop: isMobile ? "1rem" : "",
            width: isTablet ? "100%" : "auto",
          }}
        >
          <lottie-player
            src="https://lottie.host/fd4fff20-d18d-45d2-80f0-f6081d6320a5/DzmmEKPnbB.json"
            background="transparent"
            speed="1"
            style={{
              width: isMobile ? "350px" : "500px",
              height: isMobile ? "350px" : "500px",
            }}
            loop
            autoplay
            direction="1"
            mode="normal"
          ></lottie-player>
        </Box>
        <HeadingsContainer>
          <Box
            sx={{
              marginTop: isMobile ? "" : isTablet ? "2rem" : "8rem",
              marginBottom: "auto",
              display: "flex",
              flexDirection: "column",
              width: isTablet ? "100%" : "80%",
            }}
          >
            <Typography
              variant={isMobile ? "h4" : isTablet ? "h2" : "h1"}
              textAlign={isTablet ? "center" : "left"}
              fontFamily={theme.typography.fontFamily[0]}
              sx={{
                color: theme.palette.primary.dark,
                width: isTablet ? "100%" : "auto",
              }}
              fontWeight="bold"
            >
              Turn Ingredients Into Masterpieces
            </Typography>
            <Typography
              variant={isMobile ? "body2" : "body1"}
              fontFamily={theme.typography.fontFamily[1]}
              paddingTop={4}
              color="text.secondary"
              fontSize={14}
              fontWeight="400"
              textAlign={isMobile ? "justify" : ""}
              sx={{
                width: isMobile ? "100%" : isTablet ? "70%" : "auto",
                margin: "0 auto",
              }}
            >
              Discover personalized recipes, create culinary masterpieces with
              ease, and share your favorite dishes with a vibrant community.
              Simplify your cooking experience while making every meal delicious
              and memorable.
            </Typography>
          </Box>

          <WelcomeButton
            onClick={goToAuth}
            variant="contained"
            sx={{
              margin: isMobile
                ? "2rem 0 0 0"
                : isTablet
                ? "2rem auto 0 auto"
                : "2rem 0 0 0",
              width: isMobile ? "100%" : "70%",
            }}
            endIcon={<SendIcon />}
          >
            Get Started
          </WelcomeButton>
        </HeadingsContainer>
      </MainContainer>
    </>
  );
};

export default GetStarted;
