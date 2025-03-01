import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import theme from "../../theme/theme";
import { Send } from "@mui/icons-material";

const Comments = () => {
  return (
    <Box py={2}>
      <Typography
        variant="body1"
        color="primary"
        fontWeight="bold"
        gutterBottom
        textAlign="right"
      >
        3 Comments
      </Typography>

      {/* Comment List */}
      <Box my={2}>
        <Box display="flex" alignItems="center" gap={3}>
          <Box display="flex" gap={1} alignItems="center">
            <Avatar sx={{ width: "40px", height: "40px" }} />
            <Box display="flex" flexDirection="column">
              <Typography variant="body2" color="primary" fontWeight="bold">
                John Doe
              </Typography>
              <Typography variant="body2" color="gray" fontSize={12}>
                2 hours ago
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography variant="body2" gutterBottom pt={2}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis non unde
          iure distinctio, laudantium dolore molestiae id exercitationem
          corrupti. Iusto amet quo alias natus voluptatum cum velit incidunt,
          dicta nam.
        </Typography>
        <Divider sx={{ py: 1 }} />
      </Box>
      <Box my={2}>
        <Box display="flex" alignItems="center" gap={3}>
          <Box display="flex" gap={1} alignItems="center">
            <Avatar sx={{ width: "40px", height: "40px" }} />
            <Box display="flex" flexDirection="column">
              <Typography variant="body2" color="primary" fontWeight="bold">
                John Doe
              </Typography>
              <Typography variant="body2" color="gray" fontSize={12}>
                2 hours ago
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography variant="body2" gutterBottom pt={2}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis non unde
          iure distinctio, laudantium dolore molestiae id exercitationem
          corrupti. Iusto amet quo alias natus voluptatum cum velit incidunt,
          dicta nam.
        </Typography>
        <Divider sx={{ py: 1 }} />
      </Box>
      {/* My Comment */}

      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mt={1}
        p={2}
        py={1}
        borderRadius={10}
        border={`1px solid ${theme.palette.secondary.main}`}
      >
        <Box display="flex" gap={2} alignItems="center" width="100%">
          <Avatar sx={{ width: "30px", height: "30px" }} />
          <InputBase
            multiline
            rows={1}
            placeholder="Your comment..."
            fullWidth
          />
        </Box>
        <IconButton size="small" color="success">
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Comments;
