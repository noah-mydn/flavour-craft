import axios from "axios";
import { getAuthConfig } from "../utils/authHeaders";
import React from "react";
import { displayErrorToast } from "../utils/toastUtil";

export const useNotification = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [notisLoading, setNotisLoading] = React.useState(false);

  const getAllNotifications = async () => {
    setNotisLoading(true);
    try {
      const response = await axios.get(
        process.env.REACT_APP_BASE_API + "/posts/notis",
        getAuthConfig()
      );
      console.log("Notification response: ", response.data);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications: ", error);
      displayErrorToast(error);
    } finally {
      setNotisLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        process.env.REACT_APP_BASE_API +
          "/posts/notis/" +
          notificationId +
          "/read",
        { notificationId },
        getAuthConfig()
      );
      console.log("Mark as read response: ", response.data);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read: ", error);
      displayErrorToast(error);
    }
  };

  React.useEffect(() => {
    getAllNotifications();
  }, []);

  return {
    notifications,
    notisLoading,
    markAsRead,
    getAllNotifications,
  };
};
