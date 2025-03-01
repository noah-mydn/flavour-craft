import React, { useState } from "react";
import { TextField, Box, Chip, InputBase } from "@mui/material";
import { useCreatePost } from "../../hooks/community/useCreatePost";

const HashtagInput = () => {
  const { post, tagInputVal, setTagInputVal, handleKeyDown, handleDelete } =
    useCreatePost();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        border: "1px solid #ccc",
        borderRadius: 5.5,
        p: 1,
        mb: 1,
        alignItems: "center",
        minHeight: "40px",
      }}
    >
      {post?.tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          onDelete={() => handleDelete(tag)}
          color="success"
        />
      ))}
      <InputBase
        placeholder="Hashtags..."
        multiline
        rows={1}
        value={tagInputVal}
        onChange={(e) => setTagInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          flexGrow: 1,
          ml: 1,
          outline: "none",
          border: "none",
        }}
      />
    </Box>
  );
};

export default HashtagInput;
