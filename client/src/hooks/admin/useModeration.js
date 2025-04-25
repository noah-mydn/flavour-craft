import axios from "axios";
import React from "react";
import { getAuthConfig } from "../../utils/authHeaders";

export const useModeration = () => {
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [reportsLoading, setReportsLoading] = React.useState(false);

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

  return {
    reports,
    loading,
    reportsLoading,
    removeReportedPost,
    viewReportedPosts,
    ignoreReportedPost,
  };
};
