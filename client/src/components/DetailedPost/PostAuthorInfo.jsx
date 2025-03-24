import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  useTheme,
  Skeleton,
  Divider,
  alpha,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { formatTimeAgo } from "../../utils/timeFormatter";
import { useSelector, useDispatch } from "react-redux";
import {
  postLoadingSelector,
  profileSelector,
} from "../../redux/selectors/selectors";
import { Edit, DeleteOutline, MoreVert } from "@mui/icons-material";

import PostDialog from "../Community/PostDialog";
import { usePostDetail } from "../../hooks/community/usePostDetail";
import { useNavigate } from "react-router-dom";

const PostAuthorInfo = ({ post, loading, onEdit }) => {
  const theme = useTheme();

  const user = useSelector(profileSelector);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isAuthorMe = post?.author?._id === user?._id;
  const postLoading = useSelector(postLoadingSelector);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const { removePost } = usePostDetail();
  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    handleCloseMenu();
    setOpenEditDialog(true);
  };

  const handleDeletePost = async () => {
    handleCloseMenu();
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    console.log("User ID:", user._id);
    console.log("Author ID:", post.author._id);
    removePost(post?._id, deleteAndNavigate);
  };

  const deleteAndNavigate = () => {
    setOpenDeleteDialog(false);
    navigate("/forum");
  };

  return (
    <React.Fragment>
      <Box>
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
          {!loading && isAuthorMe && (
            <IconButton
              size="small"
              onClick={handleOpenMenu}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          )}
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
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              minWidth: 150,
              borderRadius: 2,
              mt: 0.5,
            },
          },
        }}
      >
        <MenuItem onClick={handleEditPost} sx={{ py: 1.5 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Edit fontSize="small" />
            <Typography variant="body2">Edit Post</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleDeletePost} sx={{ py: 1.5 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <DeleteOutline fontSize="small" />
            <Typography variant="body2">Delete Post</Typography>
          </Box>
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              width: "100%",
              maxWidth: 360,
            },
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
          Delete Post
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
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
            disabled={postLoading}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              ml: 1,
            }}
          >
            {postLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <PostDialog
        isEdit={true}
        open={openEditDialog}
        editedPost={post}
        onClose={() => setOpenEditDialog(false)}
      />
    </React.Fragment>
  );
};

export default PostAuthorInfo;
