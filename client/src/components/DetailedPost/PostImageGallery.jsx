import React, { useState } from "react";
import { Box, Grid, alpha, useTheme, Dialog, IconButton } from "@mui/material";
import {
  CloseRounded,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import Typography from "@mui/material/Typography";

const PostImageGallery = ({ images }) => {
  const theme = useTheme();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images?.length || 0;

  if (!images || images.length === 0) {
    return null;
  }

  const handleImageClick = (index) => {
    setActiveStep(index);
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep === maxSteps - 1 ? 0 : prevActiveStep + 1
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep === 0 ? maxSteps - 1 : prevActiveStep - 1
    );
  };

  return (
    <>
      {/* Images grid */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {images.map((image, index) => (
          <Grid item xs={6} key={index}>
            <Box
              component="img"
              src={image}
              alt={`Post image ${index + 1}`}
              sx={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: `0 5px 15px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                },
              }}
              onClick={() => handleImageClick(index)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Image Carousel Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        maxWidth="lg"
        PaperProps={{
          sx: {
            background: "transparent",
            boxShadow: "none",
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <IconButton
          onClick={handleCloseImageDialog}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            zIndex: 10,
            backgroundColor: alpha(theme.palette.common.black, 0.5),
            color: theme.palette.common.white,
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.black, 0.7),
            },
          }}
        >
          <CloseRounded />
        </IconButton>

        <Box
          sx={{
            width: { xs: "95vw", sm: "90vw", md: "80vw" },
            height: "80vh",
            background: alpha(theme.palette.common.black, 0.85),
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Image carousel */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Left arrow */}
            <IconButton
              onClick={handleBack}
              sx={{
                position: "absolute",
                left: 16,
                backgroundColor: alpha(theme.palette.common.black, 0.5),
                color: theme.palette.common.white,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.black, 0.7),
                },
                zIndex: 2,
              }}
            >
              <KeyboardArrowLeft />
            </IconButton>

            {/* Right arrow */}
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 16,
                backgroundColor: alpha(theme.palette.common.black, 0.5),
                color: theme.palette.common.white,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.black, 0.7),
                },
                zIndex: 2,
              }}
            >
              <KeyboardArrowRight />
            </IconButton>

            {/* Current image */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 3,
              }}
            >
              <Box
                component="img"
                src={images[activeStep]}
                alt={`Image ${activeStep + 1} of ${maxSteps}`}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  transition: "opacity 0.3s ease",
                  borderRadius: 1,
                }}
                loading="lazy"
              />
            </Box>
          </Box>

          {/* Image counter and thumbnails */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: alpha(theme.palette.common.black, 0.7),
              p: 1,
            }}
          >
            {/* Image counter */}
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.common.white,
                fontSize: "0.75rem",
                mb: 1,
              }}
            >
              {activeStep + 1} / {maxSteps}
            </Typography>

            {/* Thumbnails */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                overflowX: "auto",
                maxWidth: "100%",
                pb: 0.5,
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setActiveStep(index)}
                  sx={{
                    height: 40,
                    width: 60,
                    objectFit: "cover",
                    borderRadius: 0.5,
                    opacity: activeStep === index ? 1 : 0.6,
                    cursor: "pointer",
                    border:
                      activeStep === index
                        ? `2px solid ${theme.palette.primary.main}`
                        : "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      opacity: 0.9,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default PostImageGallery;
