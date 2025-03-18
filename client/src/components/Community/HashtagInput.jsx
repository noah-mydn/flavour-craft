import React, { useState } from "react";
import {
  TextField,
  Box,
  Chip,
  useTheme,
  Typography,
  IconButton,
  alpha,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addTag, removeTag } from "../../redux/reducers/postSlice";
import { tagsSelector } from "../../redux/selectors/selectors";

const HashtagInput = () => {
  const tags = useSelector(tagsSelector);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addNewTag();
    }
  };

  const addNewTag = () => {
    // Extract hashtag from input (remove # if present)
    const tag = inputValue?.trim()?.replace(/^#/, "");
    dispatch(addTag(tag));
    setInputValue("");
  };

  const deleteTag = (tagToDelete) => {
    dispatch(removeTag(tagToDelete));
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={1}>
        Add hashtags
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder=" Add your hashtags"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: <Typography color="primary">#</Typography>,
            sx: {
              borderRadius: 2,
              "&:hover": {
                boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
              },
            },
          }}
        />
        <IconButton onClick={addTag} color="primary">
          <Add />
        </IconButton>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={1}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={`#${tag}`}
            onDelete={() => deleteTag(tag)}
            sx={{
              background: alpha(theme.palette.success.main, 0.08),
              color: theme.palette.success.main,
              "& .MuiChip-deleteIcon": {
                color: theme.palette.success.main,
              },
            }}
            variant="outlined"
            size="small"
          />
        ))}
      </Box>
    </Box>
  );
};

export default HashtagInput;
