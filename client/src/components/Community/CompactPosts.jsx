import React from "react";
import { Box, alpha, useTheme } from "@mui/material";

import { ContentContainer } from "../../styles/ContainerStyles";

import AddPost from "./AddPost";
import PostCard from "./PostCard";
import { useDispatch, useSelector } from "react-redux";
import { postListSelector } from "../../redux/selectors/selectors";
import { fetchPosts } from "../../redux/apiClients/postsAPI";

const CompactPosts = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const postsList = useSelector(postListSelector);

  React.useEffect(() => {
    dispatch(fetchPosts());
    console.log("POSTS:", postsList);
  }, [dispatch]);

  return (
    <ContentContainer>
      <Box
        mx={{ sm: 0, md: 4, lg: 8 }}
        sx={{
          height: "100%",
          overflowX: "hidden",
          overflowY: "auto",
          pb: 3,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            borderRadius: "6px",
          },
        }}
      >
        <Box my={2.5}>
          <AddPost />
        </Box>

        <Box display="flex" flexDirection="column" gap={2.5} mx={2}>
          {postsList?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Box>
      </Box>
    </ContentContainer>
  );
};

export default CompactPosts;
