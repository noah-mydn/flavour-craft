import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";
import {
  ContentContainer,
  PreviewPostCard,
} from "../../styles/ContainerStyles";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import theme from "../../theme/theme";

const CompactPosts = () => {
  return (
    <ContentContainer>
      <Box height="100%" sx={{ overflowX: "hidden", overflowY: "auto" }}>
        <Typography
          variant="h5"
          pl={3}
          pb={2}
          color="primary"
          fontWeight="bold"
        >
          Recent
        </Typography>
        <Box
          py={1}
          px={2}
          display="flex"
          flexDirection="column"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          <PreviewPostCard>
            <CardContent>
              <Box display="flex" flexDirection="column">
                <Box display="flex" justifyContent="flex-end">
                  <Typography
                    variant="body2"
                    fontSize={12}
                    color="error.light"
                    fontWeight="bold"
                  >
                    12 hours ago
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  color="secondary.light"
                  fontWeight="bold"
                  gutterBottom
                >
                  Does it okay to eat pork fat?
                </Typography>

                <Typography
                  variant="body2"
                  fontSize={12}
                  color="#efefef"
                  gutterBottom
                >
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Minima reprehenderit voluptatum qui harum laborum ex aliquid
                  ullam animi sit neque. Sint autem laborum et saepe aliquid
                  aut. Iste, quis architecto.
                </Typography>
                <Divider sx={{ py: 1 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" gap={2} mt={2} alignItems="center">
                    <Avatar sx={{ width: "30px", height: "30px" }} />
                    <Typography variant="body2" fontWeight="bold" color="#eee">
                      Suzy Ting
                    </Typography>
                  </Box>

                  {/* <Box display="flex" flexDirection="column">
                    <ThumbUpAltIcon
                      sx={{
                        fontSize: 20,
                        color: "#eeff00",
                      }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      m={0}
                      p={0}
                      fontSize={14}
                      color="#eeff00"
                      //color="#fff"
                    >
                      12k
                    </Typography>
                  </Box> */}
                </Box>
              </Box>
            </CardContent>
          </PreviewPostCard>
        </Box>
      </Box>
    </ContentContainer>
  );
};

export default CompactPosts;
