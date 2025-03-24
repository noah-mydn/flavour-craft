import React, { useState } from "react";
import {
  Box,
  CardContent,
  alpha,
  useTheme,
  Fade,
  Divider,
  Skeleton,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import {
  ActionButton,
  AnimatedChip,
  DetailCard,
} from "../../styles/ContainerStyles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { QuestionAnswerTwoTone } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  commentsSelector,
  postByIdSelector,
  postListSelector,
  postLoadingSelector,
  postsLoadingSelector,
  profileSelector,
} from "../../redux/selectors/selectors";

import PostAuthorInfo from "../DetailedPost/PostAuthorInfo";
import CommentSection from "../DetailedPost/CommentSection";
import PostImageGallery from "../DetailedPost/PostImageGallery";
import { Link, useParams } from "react-router-dom";
import {
  fetchPostById,
  fetchPosts,
  likePost,
} from "../../redux/apiClients/postsAPI";
import { usePostDetail } from "../../hooks/community/usePostDetail";

const DetailedPostCard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const profile = useSelector(profileSelector);
  const loading = useSelector(postLoadingSelector);
  const comments = useSelector(commentsSelector);
  const [liked, setLiked] = useState(false);
  const postId = useParams().postId;
  const { getPostByPostId, detailPost } = usePostDetail();

  const handleLikePost = async () => {
    await dispatch(likePost(postId));
    setLiked(!liked);
  };

  React.useEffect(() => {
    getPostByPostId(postId);
  }, [postId]);

  React.useEffect(() => {
    dispatch(fetchPosts({ page: 1, pageSize: 100 }));
  }, []);

  React.useEffect(() => {
    let alreadyLiked = detailPost?.upvotes?.includes(profile?._id);
    console.log("Post Liked:", alreadyLiked);

    setLiked(alreadyLiked);
  }, [detailPost]);

  return (
    <React.Fragment>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginY: 2 }}>
        <Link
          color="text.secondary"
          to="/forum"
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Forum
        </Link>
        <Link
          style={{
            textDecoration: "none",
            cursor: "pointer",
            color: theme.palette.secondary.dark,
          }}
        >
          {detailPost?.topic}
        </Link>
      </Breadcrumbs>
      <DetailCard>
        <CardContent sx={{ position: "relative", zIndex: 1, p: 2.5 }}>
          {/* Author and post content */}
          <PostAuthorInfo post={detailPost} loading={loading} />

          {/* Images section */}
          {!loading && <PostImageGallery images={detailPost?.images} />}

          {/* Tags section */}
          <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
            {loading
              ? [...Array(3)].map((_, i) => (
                  <Skeleton key={i} variant="rounded" width={60} height={25} />
                ))
              : detailPost?.tags.map((tag, idx) => (
                  <AnimatedChip
                    key={idx}
                    label={`#${tag}`}
                    size="small"
                    clickable
                  />
                ))}
          </Box>

          <Divider />

          {/* Actions section */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={0.5}
            mt={1}
            mb={2}
          >
            <Box display="flex" gap={1.5}>
              {loading ? (
                [...Array(2)].map((_, i) => (
                  <Skeleton key={i} variant="rounded" width={40} height={20} />
                ))
              ) : (
                <>
                  <ActionButton active={liked} onClick={handleLikePost}>
                    <Fade in={liked}>
                      <FavoriteIcon
                        fontSize="small"
                        sx={{ color: theme.palette.primary.main }}
                      />
                    </Fade>
                    <Fade in={!liked}>
                      <FavoriteBorderIcon
                        fontSize="small"
                        sx={{
                          color: alpha(theme.palette.text.primary, 0.7),
                          mr: 0.75,
                        }}
                      />
                    </Fade>
                    <Typography
                      variant="body2"
                      color={liked ? "primary" : "textPrimary"}
                      sx={{ fontSize: "0.8rem", fontWeight: liked ? 600 : 500 }}
                    >
                      {detailPost?.upvotes?.length}
                    </Typography>
                  </ActionButton>
                  <ActionButton>
                    <QuestionAnswerTwoTone
                      fontSize="small"
                      sx={{
                        color: alpha(theme.palette.text.primary, 0.7),
                        mr: 0.75,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                    >
                      {comments?.length || detailPost?.comments?.length}
                    </Typography>
                  </ActionButton>
                </>
              )}
            </Box>
          </Box>

          {/* Comments section */}
          <CommentSection postId={postId} />
        </CardContent>
      </DetailCard>
    </React.Fragment>
  );
};

export default DetailedPostCard;
