import React from "react";
import {
  Box,
  Grid,
  Pagination,
  alpha,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Typography,
} from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { ContentContainer } from "../../styles/ContainerStyles";

import PostCard from "./PostCard";
import { useDispatch, useSelector } from "react-redux";
import {
  postListSelector,
  postsLoadingSelector,
  postsPaginationSelector,
} from "../../redux/selectors/selectors";
import { fetchPosts } from "../../redux/apiClients/postsAPI";
import AddPost from "./AddPost";

const CompactPosts = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const postsList = useSelector(postListSelector);
  const loading = useSelector(postsLoadingSelector);
  const pagination = useSelector(postsPaginationSelector);
  const [page, setPage] = React.useState(1);
  const [sortOrder, setSortOrder] = React.useState("recent");
  const pageSize = 10;

  React.useEffect(() => {
    dispatch(fetchPosts({ page, pageSize, sort: sortOrder }));
    console.log("POSTS:", postsList);
  }, [dispatch, page, sortOrder]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    setPage(1);
  };

  const isTopTrending = (post, index) => {
    return sortOrder === "trending" && index < 3;
  };

  return (
    <ContentContainer>
      <Grid container spacing={4}>
        <Grid item xs={12} justifyItems="center" alignContent="center">
          <AddPost />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel id="sort-order-label">Sort By</InputLabel>
              <Select
                labelId="sort-order-label"
                id="sort-order"
                value={sortOrder}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="recent">Recent</MenuItem>
                <MenuItem value="popular">Popular</MenuItem>
                <MenuItem value="trending">Trending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} alignContent="center">
          {postsList?.map((post, index) => (
            <Box key={post._id} sx={{ position: "relative", mb: 2 }}>
              {isTopTrending(post, index) && (
                <Chip
                  icon={<WhatshotIcon fontSize="small" color="#fff" />}
                  label="Trending"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    zIndex: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.8),
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "0.7rem",
                    transform: "rotate(3deg)",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: 0,
                      left: 0,
                      background: alpha(theme.palette.primary.main, 0.15),
                      borderRadius: "inherit",
                      animation: "pulse 2s infinite",
                    },
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.05)" },
                      "100%": { transform: "scale(1)" },
                    },
                  }}
                />
              )}
              <PostCard post={post} />
            </Box>
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
          {postsList.length === 0 && !loading && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary" gutterBottom>
                {sortOrder === "trending"
                  ? "No posts are trending at the moment"
                  : "No posts available"}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </ContentContainer>
  );
};

export default CompactPosts;
