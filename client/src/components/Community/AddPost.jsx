import React, { useState } from "react";
import {
  Box,
  Avatar,
  InputBase,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  Button,
  Divider,
  DialogActions,
  useMediaQuery,
  Paper,
  Fade,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

import theme from "../../theme/theme";
import { VisuallyHiddenInput } from "../../styles/ContainerStyles";
import { Close, CloudUpload, Add } from "@mui/icons-material";
import { useCreatePost } from "../../hooks/community/useCreatePost";
import {
  isResetSelector,
  postSelector,
  userSelector,
} from "../../redux/selectors/selectors";
import { useSelector } from "react-redux";
import HashtagInput from "./HashtagInput";

const AddPost = () => {
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useSelector(userSelector);
  const isResetState = useSelector(isResetSelector);

  const {
    showPostForm,
    images,
    handleImageUpload,
    removeImage,
    handlePostFieldOnChange,
    openDialogue,
    closeDialogue,
    createPost,
  } = useCreatePost();

  const post = useSelector(postSelector);

  const handleCreatePost = (e) => {
    e.preventDefault();
    console.log("Creating post with tags:", post);
    createPost();
  };

  React.useEffect(() => {
    console.log("Current Post Updates:", post);
  }, [post]);

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#fff",
          borderRadius: 15,
          px: 2,
          py: 1,
          mx: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 6,
            transform: "translateY(-2px)",
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            mr: 2,
          }}
          src={user?.userImg || "../avatar.png"}
        />

        <InputBase
          fullWidth
          placeholder="What are you cooking today?"
          sx={{
            flexGrow: 1,
            fontSize: "1rem",
            "& input::placeholder": {
              fontStyle: "italic",
              opacity: 0.7,
            },
          }}
          inputProps={{
            style: { color: "#333" },
          }}
          onClick={openDialogue}
        />

        <IconButton
          onClick={openDialogue}
          sx={{
            color: "primary.main",
            transition: "all 0.2s",
            "&:hover": {
              color: "primary.dark",
              transform: "scale(1.1)",
            },
          }}
        >
          <ImageIcon sx={{ fontSize: "1.7rem" }} />
        </IconButton>
      </Paper>

      <Dialog
        open={showPostForm}
        onClose={closeDialogue}
        fullScreen={fullScreen}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 400 }}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            width: "100%",
            maxHeight: "90vh",
            height: "auto",
          },
        }}
      >
        <Box
          component="form"
          onSubmit={createPost}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.5rem",
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Create Post
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={closeDialogue}
              sx={{
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            dividers
            sx={{
              width: "auto",
              p: 3,
              backgroundColor: "#FCFCFA",
              overflowY: "auto",
            }}
          >
            <Box pt={2} pb={1} borderRadius={2}>
              <Box display="flex" alignItems="center" width="100%" mb={2}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 2,
                  }}
                  src={user?.userImg || "../avatar.png"}
                />
                <Box>
                  <Typography
                    variant="body1"
                    color="secondary.dark"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {user?.firstName + " " + user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Share your culinary adventure
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  placeholder="Topic Name"
                  size="small"
                  name="topic"
                  value={post?.topic}
                  onChange={handlePostFieldOnChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      backgroundColor: "white",
                      "&:hover": {
                        boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 2px rgba(92,107,192,0.2)",
                      },
                    },
                  }}
                />

                <TextField
                  rows={6}
                  multiline
                  fullWidth
                  placeholder="What are you cooking today? Share your recipe, tips, or food adventure..."
                  name="description"
                  value={post?.description}
                  onChange={handlePostFieldOnChange}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      backgroundColor: "white",
                      "&:hover": {
                        boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 2px rgba(92,107,192,0.2)",
                      },
                    },
                  }}
                />

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    borderColor: "rgba(0,0,0,0.1)",
                    backgroundColor: "white",
                  }}
                >
                  <HashtagInput />
                </Paper>
              </Box>

              {images.length > 0 && !isResetState && (
                <Box display="flex" gap={2} flexWrap="wrap" py={3}>
                  {images.map((src, index) => (
                    <Box
                      key={index}
                      position="relative"
                      sx={{
                        transition: "transform 0.2s",
                        "&:hover": { transform: "scale(1.03)" },
                      }}
                    >
                      <img
                        src={src}
                        alt={`uploaded-${index}`}
                        width={120}
                        height={120}
                        style={{
                          borderRadius: 12,
                          objectFit: "cover",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeImage(index)}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.8)",
                            transform: "rotate(90deg)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              <Box display="flex" gap={1} mt={2}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUpload />}
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                >
                  Upload Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </Button>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              background: "#FCFCFA",
              px: 3,
              py: 2,
              borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <Button
              onClick={closeDialogue}
              variant="outlined"
              color="inherit"
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                fontWeight: "medium",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 2,
                px: 4,
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(92,107,192,0.3)",
                "&:hover": {
                  boxShadow: "0 6px 14px rgba(92,107,192,0.4)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s",
              }}
            >
              Post
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AddPost;
