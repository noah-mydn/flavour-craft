import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (window.innerWidth / 2 - e.clientX) / 25;
      const y = (window.innerHeight / 2 - e.clientY) / 25;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <Box
      maxWidth="xl"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#f8f9fa",
        position: "relative",
      }}
    >
      {/* Decorative elements */}
      {[...Array(20)].map((_, index) => (
        <Box
          key={index}
          component={motion.div}
          sx={{
            position: "absolute",
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            borderRadius: "50%",
            backgroundColor: theme.palette.primary.main,
            opacity: 0.2,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50, 0],
            transition: {
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      ))}

      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
          <Box
            component={motion.div}
            animate={floatAnimation}
            sx={{ position: "relative" }}
          >
            {" "}
            <Box
              component={motion.div}
              animate={{
                rotate: [0, 5, 0, -5, 0],
                transition: {
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              sx={{ width: "100%", maxWidth: "500px", mx: "auto" }}
            >
              <Box
                component="img"
                src="/not_found.svg"
                alt="Lost in space illustration"
                sx={{
                  width: "100%",
                  height: "auto",
                  transform: `translate(${position.x * -1.5}px, ${
                    position.y * -1.5
                  }px)`,
                  transition: "transform 0.2s ease-out",
                }}
              />
            </Box>
          </Box>
          <Box mt={5}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/home")}
              sx={{
                borderRadius: 20,
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotFound;
