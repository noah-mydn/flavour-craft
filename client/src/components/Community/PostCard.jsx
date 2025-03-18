import React, { useState } from "react";
import {
  Avatar,
  Box,
  CardContent,
  Typography,
  alpha,
  useTheme,
  Fade,
  Divider,
  Skeleton,
} from "@mui/material";

import {
  ActionButton,
  AnimatedChip,
  GradientCard,
} from "../../styles/ContainerStyles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { QuestionAnswerTwoTone } from "@mui/icons-material";
import { formatTimeAgo } from "../../utils/timeFormatter";
import { useSelector } from "react-redux";
import { postsLoadingSelector } from "../../redux/selectors/selectors";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const theme = useTheme();
  const [liked, setLiked] = useState(false);
  const loading = useSelector(postsLoadingSelector);
  const isLongDescription = post?.description?.length > 200;
  const navigate = useNavigate();

  const renderDescription = () => {
    if (!post?.description) return "";

    if (isLongDescription) {
      return (
        <>
          {post.description.slice(0, 200)}...{" "}
          <span
            onClick={() => navigate("/forum/" + post._id)}
            style={{
              color: theme.palette.info.main,
              cursor: "pointer",
              fontStyle: "italic",
              textDecoration: "underline",
            }}
          >
            Read more
          </span>
        </>
      );
    }
  };

  return (
    <GradientCard>
      <CardContent sx={{ position: "relative", zIndex: 1, p: 2.5 }}>
        {/* Author and time section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {loading ? (
              <Skeleton variant="circular" width={42} height={42} />
            ) : (
              <Avatar
                sx={{ width: 42, height: 42 }}
                src={post?.author?.userImg || "../avatar.png"}
              />
            )}
            <Box>
              {loading ? (
                <Skeleton variant="text" width={140} height={20} />
              ) : (
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: theme.palette.primary.primary,
                  }}
                >
                  {post?.author?.firstName + " " + post?.author?.lastName}
                </Typography>
              )}
              {loading ? (
                <Skeleton variant="text" width={50} height={15} />
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                  }}
                >
                  {formatTimeAgo(post?.createdAt)}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Topic section */}
        {loading ? (
          <Skeleton variant="text" width={200} height={25} />
        ) : (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: theme.palette.text.primary,
              mb: 1.5,
            }}
          >
            {post?.topic}
          </Typography>
        )}

        {/* Description section */}
        {loading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={50}
            sx={{ borderRadius: 1 }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.text.primary, 0.8),
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}
          >
            {renderDescription()}
          </Typography>
        )}

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
                    {post?.upvotes.length}
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
                    {post?.comments.length}
                  </Typography>
                </ActionButton>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </GradientCard>
  );
};

export default PostCard;
