import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import KitchenIcon from "@mui/icons-material/Kitchen";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

const AIRecipeLoading = () => {
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [dots, setDots] = useState("");

  const loadingMessages = [
    "Gathering ingredients",
    "Preheating the AI oven",
    "Mixing flavors together",
    "Adding a pinch of creativity",
    "Taste testing recipes",
    "Plating your delicious results",
  ];

  const icons = [
    <RestaurantIcon size={32} />,
    <KitchenIcon size={32} />,
    <LocalDiningIcon size={32} />,
  ];

  // Rotate through loading phases
  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setLoadingPhase((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(phaseInterval);
  }, []);

  // Animate the dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(dotsInterval);
  }, []);

  // Rotating pot animation
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setRotation((prev) => (prev + 10) % 360);
    }, 100);

    return () => clearInterval(rotateInterval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        py: 6,
        gap: 3,
      }}
    >
      {/* Animated cooking pot */}
      <Box
        sx={{
          position: "relative",
          height: 80,
          width: 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Center pot */}
        <Box
          sx={{
            height: 60,
            width: 60,
            borderRadius: "50%",
            backgroundColor: "#f0f0f0",
            border: "3px solid #555",
            position: "relative",
            overflow: "hidden",
            transform: `rotate(${rotation}deg)`,
            transition: "transform 0.1s ease-in-out",
          }}
        >
          {/* Steam animation */}
          <Box
            sx={{
              position: "absolute",
              top: -10,
              left: "30%",
              transform: "translateX(-50%)",
              opacity: 0.7,
              animation: "steam 2s infinite",
            }}
          >
            ~
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: -15,
              left: "50%",
              transform: "translateX(-50%)",
              opacity: 0.8,
              animation: "steam 1.7s infinite 0.3s",
            }}
          >
            ~
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: -12,
              left: "70%",
              transform: "translateX(-50%)",
              opacity: 0.7,
              animation: "steam 1.9s infinite 0.7s",
            }}
          >
            ~
          </Box>
        </Box>

        {/* Orbiting icons */}
        {icons.map((icon, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              transform: `rotate(${
                (360 / icons.length) * index + rotation
              }deg) translateX(50px)`,
              color: ["#FF6B6B", "#FFD93D", "#6BCB77"][index],
            }}
          >
            {icon}
          </Box>
        ))}
      </Box>

      <Typography
        variant="h6"
        color="secondary"
        sx={{ mt: 2, fontWeight: 500 }}
      >
        {loadingMessages[loadingPhase]}
        {dots}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 300, textAlign: "center" }}
      >
        Our AI chef is carefully crafting personalized recipes based on your
        ingredients
      </Typography>

      <style jsx>{`
        @keyframes steam {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-15px) scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: translateY(-25px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </Box>
  );
};

export default AIRecipeLoading;
