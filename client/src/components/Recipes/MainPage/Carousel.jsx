import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, useMediaQuery } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import theme from "../../../theme/theme";

import RecipeCard from "../RecipeCard";

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <Box
      sx={{
        position: "absolute",
        right: "-40px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <ArrowForwardIosIcon sx={{ fontSize: 40, color: "#ccc" }} />
    </Box>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <Box
      sx={{
        position: "absolute",
        left: "-40px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <ArrowBackIosNewIcon sx={{ fontSize: 40, color: "#ccc" }} />
    </Box>
  );
};

const Carousel = ({ recipes, infinite }) => {
  const isDesktop = useMediaQuery(theme.breakpoints.down("xl"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const settings = {
    dots: true,
    infinite: infinite,
    speed: 500,
    slidesToShow: isMobile ? 1.5 : isTablet ? 3.7 : isDesktop ? 4.5 : 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.5,
        },
      },
    ],
  };

  return (
    <React.Fragment>
      <Box my={3}>
        <Slider {...settings}>
          {recipes?.map((recipe) => (
            <Box key={recipe._id} px={1} py={3}>
              <RecipeCard recipe={recipe} />
            </Box>
          ))}
        </Slider>
      </Box>
    </React.Fragment>
  );
};

export default Carousel;
