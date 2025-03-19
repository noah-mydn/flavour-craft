import { Box, IconButton, useTheme } from "@mui/material";
import React from "react";
import { ContentContainer, Wrapper } from "../../styles/ContainerStyles";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchComments, fetchPostById } from "../../redux/apiClients/postsAPI";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import DetailedPostCard from "./DetailedPostCard";

const Post = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const postId = useParams().postId;

  const fetchData = async () => {
    await dispatch(fetchPostById(postId));
    await dispatch(fetchComments(postId));
  };

  React.useEffect(() => {
    fetchData();
  }, [postId, dispatch]);

  return (
    <Wrapper>
      <Box display="flex" justifyContent="center" mt={5}>
        <ContentContainer>
          <Box
            px={2}
            pb={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box width={{ xs: "100%", sm: "90%", md: "85%", lg: "70%" }}>
              <DetailedPostCard postId={postId} />
            </Box>
          </Box>
        </ContentContainer>
      </Box>
    </Wrapper>
  );
};

export default Post;
