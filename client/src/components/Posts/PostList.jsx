// File: PostList.js
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  IconButton,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatDate } from "../../utils/timeFormatter";

const PostList = ({ posts, onPostClick }) => {
  return (
    <Box>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onPostClick={onPostClick} />
      ))}
    </Box>
  );
};

const PostCard = ({ post, onPostClick }) => {
  const isUpvoted = post.upvotes && post.upvotes.length > 0;
  const isDownvoted = post.downvotes && post.downvotes.length > 0;

  const formattedDate = formatDate(post.createdAt);

  // Truncate description for preview
  const truncatedDescription =
    post.description.length > 150
      ? post.description.substring(0, 150) + "..."
      : post.description;

  return (
    <Card sx={{ mb: 4, borderRadius: 2 }} elevation={2}>
      <CardHeader
        avatar={
          <Avatar src={post.user.avatar} aria-label="user avatar">
            {post.user.name.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={post.user.name}
        subheader={formattedDate}
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {post.topic}
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          {truncatedDescription}
        </Typography>

        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {Array.isArray(post.tags[0])
              ? post.tags[0]
                  .split(",")
                  .map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))
              : post.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
          </Box>
        )}
      </CardContent>

      {post.images && post.images.length > 0 && (
        <Box sx={{ px: 2, pb: 2 }}>
          {post.images.length === 1 ? (
            <CardMedia
              component="img"
              height="300"
              image={post.images[0]}
              alt={post.topic}
              sx={{ borderRadius: 1 }}
            />
          ) : (
            <Grid container spacing={1}>
              {post.images.map((image, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image}
                    alt={`${post.topic} ${index + 1}`}
                    sx={{ borderRadius: 1 }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
      <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            aria-label="upvote"
            color={isUpvoted ? "primary" : "default"}
          >
            {isUpvoted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.upvotes ? post.upvotes.length : 0}
          </Typography>

          <IconButton
            aria-label="downvote"
            color={isDownvoted ? "error" : "default"}
            sx={{ ml: 1 }}
          >
            {isDownvoted ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.downvotes ? post.downvotes.length : 0}
          </Typography>

          <IconButton aria-label="comment" sx={{ ml: 1 }}>
            <CommentIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.comments ? post.comments.length : 0}
          </Typography>
        </Box>

        <Box>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <Button size="small" onClick={() => onPostClick(post._id)}>
            View Details
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default PostList;
