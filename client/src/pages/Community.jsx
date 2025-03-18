import { Box, useMediaQuery } from "@mui/material";
import React from "react";

import { Wrapper } from "../styles/ContainerStyles";

import theme from "../theme/theme";
import CompactPosts from "../components/Community/CompactPosts";
import { useSelector } from "react-redux";
import { postsLoadingSelector } from "../redux/selectors/selectors";

const Community = () => {
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loading = useSelector(postsLoadingSelector);
  return (
    <Wrapper>
      <Box display="flex" justifyContent="center">
        <Box
          mx={isMobile ? 1 : isTablet ? 2 : 6}
          mt={5}
          width={
            loading ? (isMobile ? "100%" : isTablet ? "90%" : "85%") : "auto"
          }
        >
          <CompactPosts />
        </Box>
      </Box>
    </Wrapper>
  );
};

export default Community;
