import React from "react";
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
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import theme from "../../theme/theme";
import {
  ContentContainer,
  VisuallyHiddenInput,
} from "../../styles/ContainerStyles";
import { Close, CloudUpload } from "@mui/icons-material";
import HashtagInput from "./HashtagInput";
import { useCreatePost } from "../../hooks/community/useCreatePost";
import { isResetSelector, userSelector } from "../../redux/selectors/selectors";
import { useSelector } from "react-redux";

const AddPost = () => {
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useSelector(userSelector);
  const isResetState = useSelector(isResetSelector);

  const {
    showPostForm,
    images,
    post,
    handleImageUpload,
    removeImage,
    handlePostFieldOnChange,
    createNewPost,
    openDialogue,
    closeDialogue,
  } = useCreatePost();

  return (
    <ContentContainer>
      <Box
        display="flex"
        alignItems="center"
        bgcolor="#FFFFF7"
        borderRadius={20}
        boxShadow={2}
        px={2}
        py={1}
        mx={2}
      >
        <Avatar sx={{ width: 40, height: 40, mr: 1 }} />

        {/* Input Field */}
        <InputBase
          fullWidth
          placeholder="What are you cooking today?"
          sx={{
            flexGrow: 1,
          }}
          inputProps={{
            style: { color: "#333" },
          }}
          onClick={openDialogue}
        />

        {/* Image Attachment Icon */}
        <IconButton onClick={openDialogue}>
          <ImageIcon sx={{ fontSize: "1.7rem" }} />
        </IconButton>
      </Box>
      <Dialog
        open={showPostForm}
        onClose={closeDialogue}
        fullScreen={fullScreen}
      >
        <Box component="form" onSubmit={createNewPost}>
          <DialogTitle
            sx={{
              background: theme.palette.primary.main,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Create Post
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              width: "550px",
              [theme.breakpoints.down("sm")]: {
                width: "auto",
              },
            }}
          >
            <Box pt={3} pb={1} borderRadius={2}>
              <Box display="flex" alignItems="center" width="100%">
                <Avatar sx={{ width: 40, height: 40, mr: 1 }} />
                <Typography
                  variant="body1"
                  color="secondary.dark"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  {user?.firstName + " " + user?.lastName}
                </Typography>
              </Box>
              <Divider sx={{ py: 1 }} />
              <Box display="flex" flexDirection="column" gap={3} pt={2}>
                <TextField
                  placeholder="Topic Name"
                  size="small"
                  name="topic"
                  value={post?.topic}
                  onChange={handlePostFieldOnChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 5,
                    },
                  }}
                />
                <TextField
                  rows={8}
                  multiline
                  fullWidth
                  placeholder="What are you cooking today?"
                  name="description"
                  value={post?.description}
                  onChange={handlePostFieldOnChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                    },
                  }}
                />
                <HashtagInput />
              </Box>

              {/* Show Images Here */}

              {images.length > 0 && !isResetState && (
                <Box display="flex" gap={2} flexWrap="wrap" py={2}>
                  {images.map((src, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={src}
                        alt={`uploaded-${index}`}
                        width={100}
                        height={100}
                        style={{ borderRadius: 8, objectFit: "cover" }}
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
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Upload Button */}
              <Box py={1}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUpload />}
                  sx={{ background: "#b2b2b2" }}
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
          //   sx={{
          //     background: theme.palette.background.default,
          //   }}
          >
            <Button onClick={closeDialogue} variant="text" color="text">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create Post
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </ContentContainer>
  );
};

export default AddPost;
