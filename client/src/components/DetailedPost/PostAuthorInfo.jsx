import React from "react";
import {
  Avatar,
  Box,
  Typography,
  useTheme,
  Skeleton,
  Divider,
  alpha,
} from "@mui/material";
import { formatTimeAgo } from "../../utils/timeFormatter";

const PostAuthorInfo = ({ post, loading }) => {
  const theme = useTheme();

  return (
    <>
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
      <Divider sx={{ mb: 1 }} />
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

      {/* Description section - full content */}
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={100}
          sx={{ borderRadius: 1 }}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: alpha(theme.palette.text.primary, 0.8),
            fontSize: "0.875rem",
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          {post?.description}
        </Typography>
      )}
    </>
  );
};

export default PostAuthorInfo;
