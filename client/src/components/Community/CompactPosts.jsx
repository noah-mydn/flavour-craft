import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  alpha,
  useTheme,
  Fade,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ActionButton,
  AnimatedChip,
  ContentContainer,
  GradientCard,
} from "../../styles/ContainerStyles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddPost from "./AddPost";
import { QuestionAnswerTwoTone } from "@mui/icons-material";
import { formatTimeAgo } from "../../utils/timeFormatter";

// Sample data
const posts = [
  {
    _id: "67c366ae7cf68f1afe8e8628",
    user: {
      _id: "67c06bc8e500fb815ffa1149",
      name: "Suzy Ting",
      avatar: "",
    },
    topic: "Is it okay to eat expired biscuits?",
    description:
      "I found some biscuits in my pantry that expired 2 months ago, but they still look and smell fine. Are they safe to eat? I hate to waste food but I'm also concerned about food safety. Have any of you eaten expired foods without issues?",
    tags: ["food", "safety", "expiration"],
    comments: [],
    upvotes: Array(18).fill("user"),
    downvotes: [],
    createdAt: "2025-03-14T09:57:34.830Z",
  },
  {
    _id: "67c366ae7cf68f1afe8e8629",
    user: {
      _id: "67c06bc8e500fb815ffa1150",
      name: "Alex Johnson",
      avatar: "",
    },
    topic: "Best curry recipe for beginners?",
    description:
      "I'm looking to make a curry for the first time and would appreciate recommendations for an easy yet authentic recipe to start with. I have most basic spices but not sure about technique.",
    tags: ["indian", "burmese", "chicken", "curry"],
    comments: ["comment1", "comment2", "comment3"],
    upvotes: Array(24).fill("user"),
    downvotes: [],
    createdAt: "2025-03-15T08:30:00.000Z",
  },
];

// Get a random pastel color for avatar based on name
const getAvatarColor = (name) => {
  const colors = [
    "#FFD6E0", // Pastel Pink
    "#FFEFCF", // Pastel Yellow
    "#D1F0E0", // Pastel Green
    "#D5E4F7", // Pastel Blue
    "#E9D6F4", // Pastel Purple
    "#F9E0BB", // Pastel Orange
  ];

  // Simple hash function to get consistent color for same name
  const hash = name.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + acc;
  }, 0);

  return colors[hash % colors.length];
};

const PostCard = ({ post }) => {
  const theme = useTheme();
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Calculate if post description is long enough to truncate
  const isLongDescription = post.description.length > 20;

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
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: getAvatarColor(post.user.name),
                fontWeight: 600,
                color: theme.palette.getContrastText(
                  getAvatarColor(post.user.name)
                ),
                boxShadow: `0 4px 10px ${alpha(
                  getAvatarColor(post.user.name),
                  0.5
                )}`,
              }}
            >
              {post.user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: theme.palette.primary.primary,
                  lineHeight: 1.2,
                }}
              >
                {post.user.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                {/* <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: theme.palette.success.main,
                    opacity: 0.8,
                  }}
                /> */}
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                  }}
                >
                  {formatTimeAgo(post.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Topic section */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.05rem",
            color: theme.palette.text.primary,
            mb: 1.5,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            fontFamily: theme.typography.fontFamily[0],
          }}
        >
          {post.topic}
        </Typography>

        {/* Description section */}
        <Typography
          variant="body2"
          sx={{
            color: alpha(theme.palette.text.primary, 0.8),
            fontSize: "0.875rem",
            lineHeight: 1.6,
            mb: isLongDescription && !expanded ? 0.5 : 2,
            overflow: isLongDescription && !expanded ? "hidden" : "visible",
            display: isLongDescription && !expanded ? "-webkit-box" : "block",
            WebkitLineClamp: isLongDescription && !expanded ? 2 : "unset",
            WebkitBoxOrient: "vertical",
          }}
        >
          {post.description}{" "}
          {isLongDescription && (
            <span
              onClick={() => setExpanded(!expanded)}
              style={{
                color: theme.palette.info.main,
                cursor: "pointer",
                fontStyle: "italic",
                textDecoration: "underline",
              }}
            >
              {!expanded && "Read more"}
            </span>
          )}
        </Typography>

        {/* Read more button */}

        {/* Tags section */}
        <Box
          display="flex"
          flexWrap="wrap"
          gap={1}
          mt={isLongDescription ? 1 : 0}
          mb={2}
        >
          {post.tags.map((tag, idx) => (
            <AnimatedChip key={idx} label={`#${tag}`} size="small" clickable />
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
            <ActionButton active={liked} onClick={() => setLiked(!liked)}>
              <Fade in={liked}>
                <FavoriteIcon
                  fontSize="small"
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 0.75,
                    fontSize: "1.1rem",
                    animation: liked ? "pulse 0.5s" : "none",
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.3)" },
                      "100%": { transform: "scale(1)" },
                    },
                  }}
                />
              </Fade>
              <Fade in={!liked}>
                <FavoriteBorderIcon
                  fontSize="small"
                  sx={{
                    color: alpha(theme.palette.text.primary, 0.7),
                    mr: 0.75,
                    fontSize: "1.1rem",
                    position: liked ? "absolute" : "static",
                    opacity: liked ? 0 : 1,
                  }}
                />
              </Fade>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: liked ? 600 : 500,
                  color: liked
                    ? theme.palette.primary.main
                    : alpha(theme.palette.text.primary, 0.7),
                }}
              >
                {post.upvotes.length}
              </Typography>
            </ActionButton>

            <ActionButton>
              <QuestionAnswerTwoTone
                fontSize="small"
                sx={{
                  color: alpha(theme.palette.text.primary, 0.7),
                  mr: 0.75,
                  fontSize: "1.1rem",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: alpha(theme.palette.text.primary, 0.7),
                }}
              >
                {post.comments.length}
              </Typography>
            </ActionButton>
          </Box>
        </Box>
      </CardContent>
    </GradientCard>
  );
};

const CompactPosts = () => {
  const theme = useTheme();

  return (
    <ContentContainer>
      <Box
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
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Box>
      </Box>
    </ContentContainer>
  );
};

export default CompactPosts;
