import { Box, Typography } from "@mui/material";
import React from "react";
import theme from "../../theme/theme";
import { setPost } from "../../redux/reducers/postSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
const LabelOnBanner = ({ isMobile, isTablet, campaign }) => {
  const { title, hashtag } = campaign;
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const createPostWithHashtag = () => {
    dispatch(
      setPost({
        tags: [hashtag],
      })
    );

    navigate("/post?openDialog=true");
  };

  return (
    <Box
      component="div"
      onClick={createPostWithHashtag}
      sx={{
        cursor: "pointer",
        position: "absolute",
        top: isMobile ? "18%" : "50%",
        left: isMobile ? "50%" : isTablet ? "40%" : "50%",
        transform: isMobile ? "translate(-50%, -50%)" : "translate(20%, -50%)",
        width: isMobile ? "80%" : isTablet ? "40%" : "30%",
        textAlign: "center",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography
          variant={isMobile ? "h3" : "h1"}
          //component="h2"
          color="#fff"
          fontFamily={theme.typography.fontFamily[0]}
          fontWeight="bold"
          fontSize={isMobile ? "2.5rem" : "3.5rem"}
          mb={2}
        >
          JOIN
        </Typography>

        <Typography
          variant={isMobile ? "body1" : "h6"}
          component="p"
          color="#eee"
          fontWeight="bold"
          mb={isMobile ? 0 : 1}
        >
          #{hashtag}
        </Typography>

        <Box
          mt={2}
          bgcolor="primary.main"
          color="white"
          py={0.8}
          px={2}
          sx={{
            color: theme.palette.getContrastText(theme.palette.primary.main),
          }}
          textTransform={"uppercase"}
          fontFamily={theme.typography.fontFamily[0]}
          borderRadius={50}
          display="inline-block"
          fontSize={isMobile ? "0.75rem" : "0.875rem"}
        >
          THIS WEEK'S THEME: {title}
        </Box>
      </Box>
    </Box>
  );
};

export default LabelOnBanner;
