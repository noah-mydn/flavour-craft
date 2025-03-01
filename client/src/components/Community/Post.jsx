import {
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import {
  ContentContainer,
  ForumImage,
  PostCard,
} from "../../styles/ContainerStyles";
import { Comment, MoreVert } from "@mui/icons-material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import Comments from "./Comments";

const Post = () => {
  const zoomInImage = () => {};

  const [showComments, setShowComments] = React.useState(false);

  return (
    <ContentContainer>
      <Box
        mt={2}
        px={2}
        py={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <PostCard>
          <CardContent>
            {/* Header Area */}
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" gap={2} alignItems="center">
                <Avatar sizes="small" />
                <Box display="flex" flexDirection="column">
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    gutterBottom={false}
                    color="secondary"
                  >
                    Username
                  </Typography>
                  <Typography variant="body2" color="gray" fontSize={12}>
                    2 hrs ago
                  </Typography>
                </Box>
              </Box>
              <IconButton>
                <MoreVert color="gray" fontSize="10" />
              </IconButton>
            </Box>
            {/* Content Area */}
            <Divider sx={{ paddingY: 1 }} />
            <Typography variant="h5" pt={2}>
              Topic
            </Typography>
            <Typography variant="body2" pt={2}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Excepturi deleniti aperiam labore in! Doloribus magni maiores
              voluptatum cupiditate laudantium, nam provident esse maxime
              aperiam repudiandae illum ducimus hic beatae aliquid. Lorem, ipsum
              dolor sit amet consectetur adipisicing elit. Eligendi inventore
              facilis similique maxime magni a veniam libero totam quaerat! Ab
              facere cum, unde exercitationem adipisci ipsum expedita vero
              natus. Ab? Lorem ipsum dolor sit amet consectetur, adipisicing
              elit. Quis ea, aut mollitia aperiam iste ad delectus cum adipisci
              id autem, voluptate excepturi! Numquam aspernatur pariatur
              temporibus voluptatibus magnam libero perspiciatis!
            </Typography>
            <Box display="flex" gap={1} py={2}>
              <Chip
                label="#vegan"
                variant="contained"
                clickable
                color="success"
              />
              <Chip
                label="#cheese"
                variant="contained"
                clickable
                color="success"
              />
              <Chip
                label="#healthy"
                variant="contained"
                clickable
                color="success"
              />
            </Box>
            <Box
              display="flex"
              justifyContent={{ xs: "center", md: "space-between" }}
              flexWrap="wrap"
              gap={{
                xs: 2,
                md: 0,
              }}
            >
              <ForumImage
                component="img"
                src="./logo.png"
                alt="post images"
                onClick={zoomInImage}
              />
              <ForumImage component="img" src="./logo.png" alt="post images" />
            </Box>

            <Box display="flex" pt={2} gap={6} width="100%">
              {/* Reaction buttons */}
              <Box display="flex" gap={2}>
                <Box display="flex" gap={1} alignItems="center">
                  <ThumbUpAltIcon />
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    fontSize={15}
                    // color="secondary"
                  >
                    12k
                  </Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <ThumbDownAltIcon />
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    fontSize={15}
                    //color="primary"
                  >
                    12k
                  </Typography>
                </Box>
              </Box>
              {/* Comments */}
              <Button
                onClick={() => setShowComments(!showComments)}
                variant={showComments ? "contained" : "outlined"}
                color="secondary"
                startIcon={<Comment />}
                sx={{ borderRadius: 20, px: 2 }}
              >
                3
              </Button>
            </Box>
            <Divider sx={{ py: 1 }} />
            {showComments && <Comments />}
          </CardContent>
        </PostCard>
      </Box>
    </ContentContainer>
  );
};

export default Post;
