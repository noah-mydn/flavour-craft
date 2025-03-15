// File: CreatePostCard.js
import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Chip,
  Typography,
  Divider,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CloseIcon from "@mui/icons-material/Close";

const CreatePostCard = ({ onCreatePost }) => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddImage = (e) => {
    // In a real app, you would upload these files to your server
    // For this demo, we'll just create object URLs
    const newImages = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (imageToRemove) => {
    setImages(images.filter((image) => image !== imageToRemove));
  };

  const handleSubmit = () => {
    if (topic.trim() && description.trim()) {
      onCreatePost({
        topic,
        description,
        images,
        tags,
      });

      // Reset form
      setTopic("");
      setDescription("");
      setImages([]);
      setTags([]);
      setExpanded(false);
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ mr: 2 }}>U</Avatar>
          {expanded ? (
            <TextField
              fullWidth
              label="Post Title"
              variant="outlined"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              size="small"
            />
          ) : (
            <TextField
              fullWidth
              placeholder="What's cooking today?"
              variant="outlined"
              onClick={() => setExpanded(true)}
              size="small"
            />
          )}
        </Box>

        {expanded && (
          <>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TextField
                  size="small"
                  label="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  sx={{ mr: 1, flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<LocalOfferIcon />}
                  onClick={handleAddTag}
                  size="small"
                >
                  Add
                </Button>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            {images.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Images:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {images.map((img, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: 100,
                        height: 100,
                      }}
                    >
                      <img
                        src={img}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          bgcolor: "background.paper",
                          "&:hover": { bgcolor: "background.paper" },
                        }}
                        onClick={() => handleRemoveImage(img)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
                color="primary"
              >
                Add Photos
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleAddImage}
                />
              </Button>

              <Box>
                <Button onClick={() => setExpanded(false)} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!topic.trim() || !description.trim()}
                >
                  Post
                </Button>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;
