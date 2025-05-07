import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  alpha,
  useTheme,
  Avatar,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  commentLoadingSelector,
  commentSelector,
  commentsSelector,
  userSelector,
} from "../../redux/selectors/selectors";

import {
  setComment,
  clearComment,
  setComments,
} from "../../redux/reducers/postListSlice.js";
import { formatTimeAgo } from "../../utils/timeFormatter";
import {
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  editComment,
  fetchComments,
  addComment,
  removeComment,
  fetchPostById,
} from "../../redux/apiClients/postsAPI.js";

const CommentSection = ({ postId, isAdmin }) => {
  const theme = useTheme();
  const user = useSelector(userSelector);
  const comments = useSelector(commentsSelector);
  const comment = useSelector(commentSelector);
  const commentMode = useSelector((state) => state.postList.commentMode);
  const commentsLoading = useSelector(
    (state) => state.postList.commentsLoading
  );
  const commentLoading = useSelector((state) => state.postList.commentLoading);
  const dispatch = useDispatch();

  const [newComment, setNewComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleOpenMenu = (event, commentItem) => {
    setAnchorEl(event.currentTarget);
    setActiveCommentId(commentItem._id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveCommentId(null);
  };

  const handleEditClick = (commentItem) => {
    dispatch(setComment({ comment: commentItem, mode: "edit" }));
    handleCloseMenu();
  };

  const handleDeleteClick = async (commentItem) => {
    dispatch(setComment({ comment: commentItem, mode: "delete" }));
    setDeleteDialogOpen(true);
    handleCloseMenu();
    await dispatch(fetchComments(postId));
  };

  const handleCancelEdit = () => {
    dispatch(clearComment());
  };

  const handleSaveEdit = async (commentItem) => {
    console.log("This is commentItem:", commentItem);
    dispatch(setComment(commentItem));

    if (comment?.content?.trim()) {
      console.log("After saving it to state cmmt:", comment);
      dispatch(
        editComment({
          postId,
          commentId: comment._id,
          content: comment.content,
        })
      );
      await dispatch(fetchComments(postId));
    }
  };

  const confirmDelete = async () => {
    if (comment?._id) {
      dispatch(removeComment({ postId, commentId: comment._id }));
      if (!commentLoading) {
        setDeleteDialogOpen(false);
        dispatch(clearComment());
        await dispatch(fetchPostById(postId));
        await dispatch(fetchComments(postId));
      }
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const tempComment = {
        _id: Date.now().toString(),
        content: newComment,
        author: user,
        createdAt: new Date().toISOString(),
      };

      dispatch(setComments([...comments, tempComment]));

      dispatch(addComment({ postId, comment: newComment })).then(() => {
        dispatch(fetchComments(postId));
      });

      setNewComment("");
    }
  };

  const isUserComment = (cmmt) => {
    console.log(cmmt);
    return cmmt?.author._id === user._id;
  };

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  return (
    <>
      <Box mt={2}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            color: theme.palette.text.primary,
            mb: 2,
          }}
        >
          Comments
        </Typography>

        {/* Add comment form */}
        {!isAdmin && (
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
            <Box display="flex" gap={1.5} alignItems="center">
              <Avatar
                sx={{ width: 36, height: 36 }}
                src={user?.userImg || "../avatar.png"}
              />
              <Box sx={{ flexGrow: 1, display: "flex" }}>
                <TextField
                  fullWidth
                  placeholder="Add a comment..."
                  variant="outlined"
                  size="small"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px 0 0 20px",
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.5
                      ),
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  sx={{
                    borderRadius: "0 20px 20px 0",
                    minWidth: "auto",
                  }}
                >
                  <SendIcon fontSize="small" />
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Existing comments with improved design */}
        {comments && comments.length > 0 && (
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 0.3),
              borderRadius: 2,
              p: 2,
              overflowY: "auto",
              maxHeight: 300,
            }}
          >
            {comments.map((commentItem, index) => (
              <Box
                key={commentItem._id}
                sx={{
                  mb: index !== comments.length - 1 ? 2 : 0,
                  pb: index !== comments.length - 1 ? 2 : 0,
                  borderBottom:
                    index !== comments.length - 1
                      ? `1px solid ${alpha(theme.palette.divider, 0.3)}`
                      : "none",
                  position: "relative",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.2),
                  },
                }}
              >
                <Box display="flex" gap={1.5} alignItems="flex-start">
                  <Avatar
                    sx={{ width: 38, height: 38 }}
                    src={commentItem?.author?.userImg || "../avatar.png"}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            color: theme.palette.text.primary,
                          }}
                        >
                          {commentItem?.author?.firstName}{" "}
                          {commentItem?.author?.lastName}
                        </Typography>
                        {isUserComment(commentItem) && (
                          <Typography
                            variant="caption"
                            sx={{
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                              color: theme.palette.primary.main,
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              fontSize: "0.65rem",
                              fontWeight: 500,
                            }}
                          >
                            You
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.7rem",
                        }}
                      >
                        {formatTimeAgo(commentItem?.createdAt)}
                      </Typography>
                    </Box>

                    {commentMode === "edit" &&
                    comment?._id === commentItem._id ? (
                      <Box sx={{ mt: 1, position: "relative" }}>
                        <TextField
                          fullWidth
                          multiline
                          minRows={2}
                          value={comment?.content || commentItem.content}
                          onChange={(e) =>
                            dispatch(
                              setComment({
                                comment: {
                                  ...comment,
                                  content: e.target.value,
                                },
                                mode: "edit",
                              })
                            )
                          }
                          variant="outlined"
                          size="small"
                          autoFocus
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: alpha(
                                theme.palette.background.paper,
                                0.5
                              ),
                            },
                          }}
                        />
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          gap={1}
                          mt={1}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={handleCancelEdit}
                            startIcon={<CloseIcon fontSize="small" />}
                            sx={{
                              borderRadius: "8px",
                              fontWeight: 500,
                              textTransform: "none",
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            disableElevation
                            onClick={() => handleSaveEdit(commentItem)}
                            startIcon={<CheckIcon fontSize="small" />}
                            disabled={commentLoading}
                            sx={{
                              borderRadius: "8px",
                              fontWeight: 500,
                              textTransform: "none",
                            }}
                          >
                            {commentLoading ? "Saving..." : "Save"}
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha(theme.palette.text.primary, 0.85),
                          fontSize: "0.825rem",
                          mt: 0.5,
                          lineHeight: 1.5,
                        }}
                      >
                        {commentItem.content}
                      </Typography>
                    )}
                  </Box>

                  {/* Actions menu for user's own comments */}
                  {isUserComment(commentItem) &&
                    !(
                      commentMode === "edit" && comment?._id === commentItem._id
                    ) && (
                      <Box>
                        <Tooltip title="Comment options">
                          <IconButton
                            size="small"
                            onClick={(e) => handleOpenMenu(e, commentItem)}
                            sx={{
                              opacity: 0.7,
                              "&:hover": { opacity: 1 },
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Menu
                          anchorEl={anchorEl}
                          open={
                            Boolean(anchorEl) &&
                            activeCommentId === commentItem._id
                          }
                          onClose={handleCloseMenu}
                          TransitionComponent={Fade}
                          sx={{
                            "& .MuiPaper-root": {
                              borderRadius: 2,
                              boxShadow: theme.shadows[4],
                              minWidth: 150,
                            },
                          }}
                        >
                          <MenuItem
                            onClick={() => handleEditClick(commentItem)}
                            sx={{ gap: 1.5, py: 1 }}
                          >
                            <EditIcon fontSize="small" color="primary" />
                            <Typography variant="body2">Edit</Typography>
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleDeleteClick(commentItem)}
                            sx={{ gap: 1.5, py: 1 }}
                          >
                            <DeleteIcon fontSize="small" color="error" />
                            <Typography variant="body2" color="error.main">
                              Delete
                            </Typography>
                          </MenuItem>
                        </Menu>
                      </Box>
                    )}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {(!comments || comments.length === 0) && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontStyle: "italic",
              textAlign: "center",
              py: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.3),
              borderRadius: 2,
            }}
          >
            No comments yet. Be the first to comment!
          </Typography>
        )}

        {commentLoading && comments?.length === 0 && (
          <Box>
            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                display="flex"
                gap={1.5}
                alignItems="flex-start"
                mb={2}
              >
                <Skeleton variant="circular" width={38} height={38} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="30%" height={16} />
                  <Skeleton variant="text" width="90%" height={14} />
                  <Skeleton variant="text" width="80%" height={14} />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: "100%",
            maxWidth: 360,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontWeight: 600,
            fontSize: "1.1rem",
            color: theme.palette.error.main,
          }}
        >
          Delete Comment
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disableElevation
            disabled={commentLoading}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              ml: 1,
            }}
          >
            {commentLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommentSection;
