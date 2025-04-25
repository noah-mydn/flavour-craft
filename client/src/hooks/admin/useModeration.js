import axios from "axios";
import React from "react";
import { getAuthConfig } from "../../utils/authHeaders";
import { displaySuccessToast } from "../../utils/toastUtil";

export const useModeration = () => {
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [reportsLoading, setReportsLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [userLoading, setUserLoading] = React.useState(false);
  const [userListLoading, setUserListLoading] = React.useState(false);

  const viewReportedPosts = async () => {
    setReportsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/community/report`,
        getAuthConfig()
      );
      setReports(response?.data?.reports);
    } catch (error) {
      console.error("Error fetching reported posts:", error);
    } finally {
      setReportsLoading(false);
    }
  };

  const removeReportedPost = async (postId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_API}/community/report/${postId}/remove`,
        getAuthConfig()
      );
      if (response.status === 200) {
        viewReportedPosts();
      }
    } catch (error) {
      console.error("Error removing reported post:", error);
    } finally {
      setLoading(false);
    }
  };

  const ignoreReportedPost = async (postId) => {
    console.log("postId received:", postId);
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API}/community/report/${postId}/ignore`,
        {},
        getAuthConfig()
      );
      if (response.status === 200) {
        viewReportedPosts();
      }
    } catch (error) {
      console.error("Error ignoring reported post:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewAllUsers = async () => {
    setUserListLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/user/all`,
        getAuthConfig()
      );
      setUsers(response?.data?.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUserListLoading(false);
    }
  };

  const issueWarning = async (userId, onSuccess) => {
    setUserLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API}/user/${userId}/warn`,
        {},
        getAuthConfig()
      );
      if (response.status === 200) {
        displaySuccessToast(response?.data?.message);
        viewAllUsers();
        onSuccess();
      }
    } catch (error) {
      console.error("Error issuing warning:", error);
    } finally {
      setUserLoading(false);
    }
  };

  const removeUser = async (userId, onSuccess) => {
    setUserLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_API}/user/${userId}/delete`,
        getAuthConfig()
      );
      console.log("response", response);
      if (response?.data?.status == 200) {
        viewAllUsers();
        console.log(response?.data?.message);
        displaySuccessToast(response?.data?.message);
        onSuccess();
      }
    } catch (error) {
      console.error("Error removing user:", error);
    } finally {
      setUserLoading(false);
    }
  };

  return {
    viewAllUsers,
    issueWarning,
    removeUser,
    users,
    userLoading,
    userListLoading,
    reports,
    loading,
    reportsLoading,
    removeReportedPost,
    viewReportedPosts,
    ignoreReportedPost,
  };
};
