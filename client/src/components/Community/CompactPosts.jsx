import React from "react";
import { Box, Grid, Pagination, alpha, useTheme } from "@mui/material";

import { ContentContainer } from "../../styles/ContainerStyles";

import AddPost from "./AddPost";
import PostCard from "./PostCard";
import { useDispatch, useSelector } from "react-redux";
import {
  postListSelector,
  postsPaginationSelector,
} from "../../redux/selectors/selectors";
import { fetchPosts } from "../../redux/apiClients/postsAPI";

const CompactPosts = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const postsList = useSelector(postListSelector);
  const pagination = useSelector(postsPaginationSelector);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  React.useEffect(() => {
    dispatch(fetchPosts({ page, pageSize }));
    console.log("POSTS:", postsList);
  }, [dispatch, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <ContentContainer>
      <Grid container spacing={4}>
        <Grid item xs={12} justifyItems="center" alignContent="center">
          <AddPost />
        </Grid>

        <Grid item xs={12} justifyItems="center" alignContent="center">
          {postsList?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Grid>
        <Grid item xs={12} justifyItems="center" alignContent="center" mt={3}>
          {postsList.length > 0 && (
            <Pagination
              count={pagination?.totalPages}
              page={page}
              color="primary"
              size="large"
              onChange={handlePageChange}
            />
          )}
        </Grid>
      </Grid>
    </ContentContainer>
  );
};

export default CompactPosts;
