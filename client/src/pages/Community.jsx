import { Box, Divider, useMediaQuery } from "@mui/material";
import React from "react";

import AddPost from "../components/Community/AddPost";
import Post from "../components/Community/Post";
import { Wrapper } from "../styles/ContainerStyles";
import CompactPosts from "../components/Community/CompactPosts";
import theme from "../theme/theme";

const Community = () => {
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Wrapper>
      <Box
        display="flex"
        justifyContent={isTablet ? "center" : "space-between"}
      >
        {!isTablet && (
          <Box width="70%">
            <CompactPosts />
          </Box>
        )}

        {!isTablet && (
          <Divider orientation="vertical" sx={{ height: "auto", mx: 1 }} />
        )}

        <Box
          width={isMobile ? "100%" : isTablet ? "80%" : "100%"}
          display="flex"
          flexDirection="column"
          justifyContent={isTablet ? "center" : "space-between"}
        >
          <AddPost />
          <Post />
        </Box>
      </Box>
    </Wrapper>
  );
};

export default Community;
