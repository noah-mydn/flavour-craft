import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Badge,
  CircularProgress,
  useTheme,
  Paper,
  Collapse,
  Fade,
} from "@mui/material";
import {
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  NotificationsNone as NotificationsNoneIcon,
  CheckCircleSharp,
} from "@mui/icons-material";
import { useNotification } from "../../hooks/useNotification";
import { formatTimeAgo } from "../../utils/timeFormatter";

const NotificationComponent = ({ open, onClose }) => {
  const theme = useTheme();
  const { notifications, notisLoading, markAsRead } = useNotification();
  const [expandedNotification, setExpandedNotification] = useState(null);

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    // Toggle expanded state
    setExpandedNotification(
      expandedNotification === notification._id ? null : notification._id
    );

    // Navigate to the link (you might want to use react-router here)
    // This example uses setTimeout to allow the animation to complete first
    setTimeout(() => {
      window.location.href = notification.link;
    }, 300);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 350 },
          borderRadius: { xs: 0, sm: "12px 0 0 12px" },
          boxShadow: theme.shadows[6],
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
          Notifications &nbsp;
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="primary" sx={{ ml: 1 }} />
          )}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Notification List */}
      <Box sx={{ overflow: "auto", flexGrow: 1 }}>
        {notisLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              height: "100%",
              opacity: 0.7,
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    backgroundColor: notification.isRead
                      ? "transparent"
                      : `${theme.palette.primary.main}10`,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}15`,
                    },
                    p: 2,
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={notification?.commentedUser?.userImg}
                      alt={`${notification.commentedUser.firstName} ${notification.commentedUser.lastName}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" component="span">
                        {notification.commentedUser.firstName}{" "}
                        {notification.commentedUser.lastName}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography
                          variant="body2"
                          component="span"
                          color="text.primary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          {notification.message.length > 80 &&
                          expandedNotification !== notification._id
                            ? `${notification.message.substring(0, 80)}...`
                            : notification.message}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "text.secondary",
                            fontSize: "0.75rem",
                          }}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: "0.875rem", mr: 0.5 }}
                          />
                          {formatTimeAgo(notification.createdAt)}
                          {notification.isRead && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                ml: 1,
                                color: "success.main",
                              }}
                            >
                              <CheckCircleSharp
                                color="success"
                                sx={{ fontSize: "0.875rem", mr: 0.5 }}
                              />
                              Read
                            </Box>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationComponent;
