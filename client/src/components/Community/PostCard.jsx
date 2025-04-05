import React from "react";
import {
  Avatar,
  Box,
  CardContent,
  Typography,
  alpha,
  useTheme,
  Skeleton,
  useMediaQuery,
} from "@mui/material";

import { AnimatedChip, GradientCard } from "../../styles/ContainerStyles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { QuestionAnswerTwoTone } from "@mui/icons-material";
import { formatTimeAgo } from "../../utils/timeFormatter";
import { useSelector } from "react-redux";
import { postsLoadingSelector } from "../../redux/selectors/selectors";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const theme = useTheme();
  const loading = useSelector(postsLoadingSelector);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <GradientCard sx={{ minHeight: "80px", overflow: "hidden" }}>
      <CardContent
        sx={{
          position: "relative",
          zIndex: 1,
          p: 2,
          height: "100%",
          "&:last-child": { pb: 2 },
          cursor: "pointer",
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "column" : "row",
        }}
        onClick={() => navigate("/post/" + post?._id)}
      >
        {/* Left section - Avatar */}
        {/* <Box mr={2}>
          {loading ? (
            <Skeleton variant="circular" width={32} height={32} />
          ) : (
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={post?.author?.userImg || "../avatar.png"}
            />
          )}
        </Box> */}

        {/* Middle section - Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* Title row with username */}
          <Box
            sx={{
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              mb: 0.5,
              overflow: "hidden",
              flexDirection: isMobile ? "column" : "row",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              {loading ? (
                <Skeleton variant="text" width={200} height={24} />
              ) : (
                <Box display="flex">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: theme.palette.text.primary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "90%",
                    }}
                  >
                    {post?.topic}
                  </Typography>

                  {!isMobile && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        color: alpha(theme.palette.text.secondary, 0.9),
                        ml: isMobile ? 0 : 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      • {post?.author?.firstName} {post?.author?.lastName}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Time - stays at right */}
              {!isMobile ? null : loading ? (
                <Skeleton variant="text" width={50} height={16} />
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(theme.palette.text.secondary, 0.8),
                    fontSize: "0.7rem",
                  }}
                >
                  {formatTimeAgo(post?.createdAt)}
                </Typography>
              )}
            </Box>
            {isMobile && (
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.7rem",
                  color: alpha(theme.palette.text.secondary, 0.9),
                  ml: isMobile ? 0 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                • {post?.author?.firstName} {post?.author?.lastName}
              </Typography>
            )}
          </Box>

          {/* Tags row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 1,
              overflow: "hidden",
              width: "100%",
            }}
          >
            <Box display="flex" gap={1} overflow="hidden" flexWrap="wrap">
              {loading ? (
                [...Array(2)].map((_, i) => (
                  <Skeleton key={i} variant="rounded" width={50} height={20} />
                ))
              ) : (
                <>
                  {post?.tags?.slice(0, 3).map((tag, idx) => (
                    <AnimatedChip
                      key={idx}
                      label={`#${tag}`}
                      size="small"
                      sx={{
                        height: "20px",
                        "& .MuiChip-label": {
                          px: 1,
                          fontSize: "0.65rem",
                        },
                      }}
                    />
                  ))}
                  {post?.tags?.length > 3 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha(theme.palette.text.secondary, 0.8),
                        alignSelf: "center",
                      }}
                    >
                      +{post.tags.length - 3}
                    </Typography>
                  )}
                </>
              )}
            </Box>

            {/* Stats for mobile - under tags */}
            {!isMobile ? null : (
              <Box display="flex" gap={1.5} mt={0.5}>
                {loading ? (
                  [...Array(2)].map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rounded"
                      width={30}
                      height={16}
                    />
                  ))
                ) : (
                  <>
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ color: alpha(theme.palette.text.secondary, 0.8) }}
                    >
                      <FavoriteIcon
                        sx={{
                          fontSize: "0.8rem",
                          mr: 0.5,
                          color: theme.palette.primary.light,
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="primary.light"
                        sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                      >
                        {post?.upvotes?.length || 0}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ color: alpha(theme.palette.text.secondary, 0.8) }}
                    >
                      <QuestionAnswerTwoTone
                        sx={{
                          fontSize: "0.8rem",
                          mr: 0.5,
                          color: theme.palette.success.main,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                        color="success.main"
                      >
                        {post?.comments?.length || 0}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Right section - Stats and time (desktop only) */}
        {isMobile ? null : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              ml: 2,
              minWidth: "80px",
            }}
          >
            {/* Time */}
            {loading ? (
              <Skeleton variant="text" width={50} height={16} />
            ) : (
              <Typography
                variant="caption"
                sx={{
                  color: alpha(theme.palette.text.secondary, 0.8),
                  fontSize: "0.7rem",
                  mb: 0.5,
                }}
              >
                {formatTimeAgo(post?.createdAt)}
              </Typography>
            )}

            {/* Stats */}
            <Box display="flex" gap={1.5}>
              {loading ? (
                [...Array(2)].map((_, i) => (
                  <Skeleton key={i} variant="rounded" width={30} height={16} />
                ))
              ) : (
                <>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ color: alpha(theme.palette.text.secondary, 0.8) }}
                  >
                    <FavoriteIcon
                      sx={{
                        fontSize: "0.8rem",
                        mr: 0.5,
                        color: theme.palette.primary.light,
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="primary.light"
                      sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                    >
                      {post?.upvotes?.length || 0}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ color: alpha(theme.palette.text.secondary, 0.8) }}
                  >
                    <QuestionAnswerTwoTone
                      sx={{
                        fontSize: "0.8rem",
                        mr: 0.5,
                        color: theme.palette.success.main,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                      color="success.main"
                    >
                      {post?.comments?.length || 0}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </GradientCard>
  );
};

export default PostCard;
