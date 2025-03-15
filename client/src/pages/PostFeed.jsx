import React, { useState } from "react";
import {
  Card,
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Divider,
  alpha,
  Paper,
} from "@mui/material";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ChatBubbleOutlineOutlined,
  BookmarkBorderOutlined,
  MoreHoriz,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

const PostFeed = () => {
  // Sample post data
  const post = {
    _id: "67c2124b71c0b7c7f016ca70",
    user: "67c06bc8e500fb815ffa1149",
    userName: "Chef Jamie",
    topic: "Sample Post2",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima reprehenderit voluptatum qui harum laborum ex aliquid ullam animi sit neque. Sint autem laborum et saepe aliquid aut. Iste, quis architecto. voluptatum qui harum laborum ex aliquid ullam animi sit neque. Sint autem laborum et saepe aliquid aut. Iste, quis architecto.",
    tags: ["sample", "Weds_cooking", "home_cook"],
    comments: [
      "67c2a13900aa74c69d2a45c0",
      "67c2a14000aa74c69d2a45c6",
      "67c2a14700aa74c69d2a45cc",
    ],
    upvotes: ["67c0358ee500fb815ffa1145"],
    downvotes: [],
    createdAt: "2025-02-28T19:45:15.907Z",
  };

  // State for interactions
  const [liked, setLiked] = useState(post.upvotes.length > 0);
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Parse the tags
  const tagArray = post.tags.flatMap((tag) => tag.split(","));

  // Format time ago
  const getTimeAgo = () => {
    const postDate = new Date(post.createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  // Generate unique color based on topic text
  const generateColor = (text) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Generate accent color for the card
  const accentColor = generateColor(post.topic);
  const accentColorLight = alpha(accentColor, 0.1);

  // Truncate description
  const maxLength = 120;
  const needsTruncation = post.description.length > maxLength;
  const displayText = expanded
    ? post.description
    : needsTruncation
    ? `${post.description.substring(0, maxLength)}...`
    : post.description;

  return (
    <Box
      sx={{ marginTop: "9rem" }}
      width="100%"
      display="flex"
      justifyContent="center"
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: 500,
          borderRadius: 4,
          position: "relative",
          overflow: "visible",
          transition: "all 0.3s ease",
          border: "1px solid",
          borderColor: "grey.100",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            transform: "translateY(-2px)",
          },
          p: 0,
        }}
      >
        {/* Accent color top border */}
        <Box
          sx={{
            height: 6,
            width: "100%",
            bgcolor: accentColor,
            borderRadius: "16px 16px 0 0",
          }}
        />

        {/* Main content container */}
        <Box sx={{ p: 3 }}>
          {/* Header section */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {/* Colorful avatar */}
              <Avatar
                sx={{
                  bgcolor: accentColorLight,
                  color: accentColor,
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {post.userName.charAt(0)}
              </Avatar>

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, lineHeight: 1.2 }}
                >
                  {post.userName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getTimeAgo()} • {post.comments.length} comments
                </Typography>
              </Box>
            </Box>

            <IconButton size="small">
              <MoreHoriz fontSize="small" />
            </IconButton>
          </Box>

          {/* Unique pattern decoration based on topic */}
          <Box
            sx={{
              height: 60,
              mb: 2,
              borderRadius: 2,
              position: "relative",
              overflow: "hidden",
              bgcolor: accentColorLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Dynamic pattern */}
            {Array.from({ length: 12 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  width: 40 + i * 5,
                  height: 40 + i * 5,
                  borderRadius: "50%",
                  border: "1px solid",
                  borderColor: alpha(accentColor, 0.2),
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}

            {/* Topic title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: accentColor,
                zIndex: 1,
                textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                px: 2,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {post.topic}
            </Typography>
          </Box>

          {/* Content */}
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.6,
              mb: 2,
              color: "text.primary",
            }}
          >
            {displayText}
            {needsTruncation && (
              <Typography
                component="span"
                sx={{
                  cursor: "pointer",
                  color: accentColor,
                  fontWeight: "bold",
                  ml: 1,
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show less" : "Read more"}
              </Typography>
            )}
          </Typography>

          {/* Tags */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {tagArray.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  borderRadius: "8px",
                  bgcolor: alpha(accentColor, 0.08),
                  color: accentColor,
                  fontWeight: 500,
                  border: "1px solid",
                  borderColor: alpha(accentColor, 0.2),
                  "&:hover": {
                    bgcolor: alpha(accentColor, 0.15),
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Action footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid",
            borderColor: "grey.100",
            p: 1,
          }}
        >
          <Box sx={{ display: "flex" }}>
            {/* Vote controls */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: 1,
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 2,
                overflow: "hidden",
                height: 32,
              }}
            >
              <IconButton
                size="small"
                sx={{
                  borderRadius: 0,
                  height: "100%",
                  color: post.upvotes.length > 0 ? accentColor : "inherit",
                }}
              >
                <ArrowUpward fontSize="small" />
              </IconButton>
              <Typography
                variant="body2"
                sx={{
                  px: 1.5,
                  fontWeight: "bold",
                  userSelect: "none",
                }}
              >
                {post.upvotes.length - post.downvotes.length}
              </Typography>
              <IconButton
                size="small"
                sx={{
                  borderRadius: 0,
                  height: "100%",
                  color: post.downvotes.length > 0 ? "error.main" : "inherit",
                }}
              >
                <ArrowDownward fontSize="small" />
              </IconButton>
            </Box>

            {/* Comments */}
            <IconButton size="small" sx={{ ml: 2 }} aria-label="comments">
              <ChatBubbleOutlineOutlined fontSize="small" />
            </IconButton>
          </Box>

          <Box>
            {/* Save */}
            <IconButton
              size="small"
              onClick={() => setBookmarked(!bookmarked)}
              sx={{
                color: bookmarked ? accentColor : "inherit",
              }}
            >
              <BookmarkBorderOutlined fontSize="small" />
            </IconButton>

            {/* Like */}
            <IconButton
              size="small"
              onClick={() => setLiked(!liked)}
              sx={{
                color: liked ? "error.main" : "inherit",
              }}
            >
              {liked ? (
                <FavoriteOutlined fontSize="small" />
              ) : (
                <FavoriteBorderOutlined fontSize="small" />
              )}
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default PostFeed;
