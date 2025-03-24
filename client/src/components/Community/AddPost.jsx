import React from "react";
import { Box, Avatar, InputBase, IconButton, Paper } from "@mui/material";
import PostDialog from "./PostDialog";
import { useSelector } from "react-redux";
import { profileSelector } from "../../redux/selectors/selectors";
import { Image } from "@mui/icons-material";
const AddPost = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const user = useSelector(profileSelector);

  return (
    <Box width="100%">
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
          onClick={() => setOpenDialog(true)}
        />

        <IconButton
          onClick={() => setOpenDialog(true)}
          sx={{
            color: "primary.main",
            transition: "all 0.2s",
            "&:hover": {
              color: "primary.dark",
              transform: "scale(1.1)",
            },
          }}
        >
          <Image sx={{ fontSize: "1.7rem" }} />
        </IconButton>
      </Paper>
      <PostDialog
        open={openDialog}
        editedPost={null}
        isEdit={false}
        onClose={() => setOpenDialog(false)}
      />
    </Box>
  );
};

export default AddPost;
