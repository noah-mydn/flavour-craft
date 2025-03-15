// File: PostDetail.js
import React, { useState } from "react";
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
  Divider,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import { formatDate } from "../../utils/timeFormatter";

const PostDetail = ({ post, onBack }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(
    post.comments.map((c) =>
      typeof c === "object"
        ? c
        : { _id: c, content: "This is a comment", user: "Anonymous" }
    )
  );

  const isUpvoted = post.upvotes && post.upvotes.length > 0;
  const isDownvoted = post.downvotes && post.downvotes.length > 0;

  const formattedDate = formatDate(post.createdAt);

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          _id: `new-${Date.now()}`,
          content: comment,
          user: "You",
          createdAt: new Date().toISOString(),
        },
      ]);
      setComment("");
    }
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
        Back to Feed
      </Button>

      <Card sx={{ mb: 4, borderRadius: 2 }} elevation={3}>
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
          <Typography variant="h5" component="h1" gutterBottom>
            {post.topic}
          </Typography>

          <Typography variant="body1" paragraph>
            {post.description}
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
            <Grid container spacing={2}>
              {post.images.map((image, index) => (
                <Grid
                  item
                  xs={12}
                  md={post.images.length === 1 ? 12 : 6}
                  key={index}
                >
                  <CardMedia
                    component="img"
                    height={post.images.length === 1 ? 400 : 300}
                    image={image}
                    alt={`${post.topic} ${index + 1}`}
                    sx={{ borderRadius: 1 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
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
              sx={{ ml: 2 }}
            >
              {isDownvoted ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {post.downvotes ? post.downvotes.length : 0}
            </Typography>

            <IconButton aria-label="share" sx={{ ml: 2 }}>
              <ShareIcon />
            </IconButton>
          </Box>
        </CardActions>

        <Divider />

        <CardContent>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <CommentIcon sx={{ mr: 1 }} />
            Comments ({comments.length})
          </Typography>

          <Box sx={{ display: "flex", mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Add a comment..."
              variant="outlined"
              size="small"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              sx={{ mr: 1 }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleAddComment}
              disabled={!comment.trim()}
            >
              Post
            </Button>
          </Box>

          <List>
            {comments.map((comment, index) => (
              <React.Fragment key={comment._id}>
                {index > 0 && <Divider component="li" variant="inset" />}
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>{comment.user.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.user}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {comment.content}
                        </Typography>
                        {comment.createdAt && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ display: "block", mt: 1 }}
                          >
                            {formatDate(comment.createdAt)}
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostDetail;
