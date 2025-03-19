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
import { useSelector } from "react-redux";
import {
  commentsSelector,
  postByIdSelector,
  postsLoadingSelector,
} from "../../redux/selectors/selectors";

import PostAuthorInfo from "../DetailedPost/PostAuthorInfo";
import CommentSection from "../DetailedPost/CommentSection";
import PostImageGallery from "../DetailedPost/PostImageGallery";
import { Link } from "react-router-dom";

const DetailedPostCard = ({ postId }) => {
  const theme = useTheme();
  const post = useSelector(postByIdSelector);
  const loading = useSelector(postsLoadingSelector);
  const comments = useSelector(commentsSelector);
  const [liked, setLiked] = useState(false);

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
          {post?.topic}
        </Link>
      </Breadcrumbs>
      <DetailCard>
        <CardContent sx={{ position: "relative", zIndex: 1, p: 2.5 }}>
          {/* Author and post content */}
          <PostAuthorInfo post={post} loading={loading} />

          {/* Images section */}
          {!loading && <PostImageGallery images={post?.images} />}

          {/* Tags section */}
          <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
            {loading
              ? [...Array(3)].map((_, i) => (
                  <Skeleton key={i} variant="rounded" width={60} height={25} />
                ))
              : post?.tags.map((tag, idx) => (
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
                  <ActionButton active={liked} onClick={() => setLiked(!liked)}>
                    <Fade in={liked}>
                      <FavoriteIcon
                        fontSize="small"
                        sx={{ color: theme.palette.primary.main, mr: 0.75 }}
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
                      sx={{ fontSize: "0.8rem", fontWeight: liked ? 600 : 500 }}
                    >
                      {post?.upvotes?.length}
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
                      {comments?.length || post?.comments?.length}
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
