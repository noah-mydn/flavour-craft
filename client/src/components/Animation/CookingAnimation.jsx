import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { PreferenceContainer } from "../../styles/ContainerStyles";
import { Container } from "@mui/material";

export const CookingAnimation = () => {
  return (
    <PreferenceContainer>
      <Container sx={{ textAlign: "center", py: 8 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 200,
                height: 200,
                margin: "0 auto",
              }}
            >
              {/* Pot */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 120,
                  height: 80,
                  borderRadius: "0 0 60px 60px",
                  backgroundColor: "#444",
                  overflow: "hidden",
                }}
              >
                {/* Pot contents */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "70%",
                    backgroundColor: "#f7ca88",
                  }}
                />
              </Box>

              {/* Pot lid */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 75,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 130,
                  height: 20,
                  borderRadius: "100px 100px 0 0",
                  backgroundColor: "#333",
                }}
              />

              {/* Steam bubbles */}
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: [-40, -80, -120],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeOut",
                }}
                style={{
                  position: "absolute",
                  bottom: 75,
                  left: "30%",
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  backgroundColor: "#ff5252", // Red
                }}
              />

              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: [-40, -90, -140],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  delay: 0.5,
                  ease: "easeOut",
                }}
                style={{
                  position: "absolute",
                  bottom: 75,
                  left: "50%",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "#76ff03", // Green
                }}
              />

              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: [-50, -100, -150],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  delay: 1,
                  ease: "easeOut",
                }}
                style={{
                  position: "absolute",
                  bottom: 75,
                  left: "70%",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#ffff00", // Yellow
                }}
              />

              {/* Flame */}
              <motion.div
                animate={{
                  height: [30, 40, 35, 45, 30],
                  opacity: [0.8, 1, 0.9, 1, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  bottom: -15,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 80,
                  height: 30,
                  borderRadius: "0 0 50% 50%",
                  background:
                    "linear-gradient(to top, #ff5722, #ff9800, #ffeb3b)",
                }}
              />
            </Box>
            <Typography variant="h5" color="primary" sx={{ mt: 4 }}>
              Personalizing your recipe experience...
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </PreferenceContainer>
  );
};
