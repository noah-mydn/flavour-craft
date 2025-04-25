import React from "react";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";
import { displayErrorToast, displaySuccessToast } from "../../utils/toastUtil";
import { useDispatch, useSelector } from "react-redux";

import {
  postByIdSelector,
  postSelector,
  userSelector,
} from "../../redux/selectors/selectors";
import {
  updatePostField,
  addImages,
  deleteImage,
  setPost,
  clearPost,
} from "../../redux/reducers/postSlice";
import { convertBlobsToFiles } from "../../utils/blobToFile";
import { deletePost, fetchPosts } from "../../redux/apiClients/postsAPI";

export const usePostDetail = () => {
  const post = useSelector(postSelector);
  const dispatch = useDispatch();

  const [showPostForm, setShowPostForm] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [tagInputVal, setTagInputVal] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("recent");
  const [detailPost, setDetailPost] = React.useState(null);

  const handlePostFieldOnChange = (e) => {
    const { name, value } = e.target;

    dispatch(updatePostField({ name, value }));
    console.log(post);
  };

  const handleImageUpload = (event) => {
    dispatch(
      setPost({
        ...post,
        isResetState: false,
      })
    );
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImages((prevImages) => [...prevImages, ...imageUrls]);

    dispatch(addImages(imageUrls));
  };

  const removeImage = (index) => {
    console.log(index);
    setImages(images.filter((_, i) => i !== index));
    dispatch(deleteImage(index));
  };

  const getPostByPostId = async (postId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/posts/${postId}`,
        getAuthConfig()
      );
      console.log(response.data.post);
      setDetailPost(response.data.post);
    } catch (error) {
      console.log(error);
      displayErrorToast(error);
    }
  };

  const removePost = async (postId, onSuccess) => {
    try {
      const result = await dispatch(deletePost({ postId })).unwrap();
      if (onSuccess) {
        displaySuccessToast("Post deleted!");
        onSuccess(result);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const editPost = async (postId, onSuccess) => {
    setUploading(true);
    console.log("ABOUT TO GET EDITED POST:", post);

    const formData = new FormData();
    formData.append("topic", post?.topic);
    formData.append("description", post?.description);

    // Append each tag
    post?.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    post?.images
      .filter((img) => typeof img === "string")
      .forEach((img) => {
        formData.append("existingImages[]", img);
      });

    const blobImgs = post?.images?.filter((img) => img instanceof Blob);

    // Convert blob URLs to File objects
    if (blobImgs?.length > 0) {
      return await convertBlobsToFiles(blobImgs);
    }

    blobImgs.forEach((file) => {
      formData.append("newImages", file);
    });

    // Debug: Log the form data
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API}/posts/${postId}`,
        formData,
        getAuthConfig(true)
      );

      console.log(response);

      if (response.data.status === 200) {
        if (onSuccess) {
          dispatch(clearPost());
          const res = await dispatch(fetchPosts(1, 10)).unwrap();
          console.log(res);
          if (res?.status === 200) {
            getPostByPostId(postId);
            onSuccess();
          }
        }
      }
    } catch (error) {
      console.error("Error editing post:", error);
      displayErrorToast(error);
    } finally {
      setUploading(false);
    }
  };

  const createPost = async (onSuccess) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("topic", post?.topic);
    formData.append("description", post?.description);

    // Append each tag
    post?.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    // Convert blob URLs to File objs
    const imageFiles = await convertBlobsToFiles(post?.images);

    // Append valid images
    imageFiles?.forEach((file) => {
      if (file) formData.append("images", file);
    });

    console.log("FormData:", formData);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API}/posts/create`,
        formData,
        getAuthConfig(true)
      );
      console.log(response);
      if (response.data.status === 201) {
        dispatch(fetchPosts(1, 10, sortOrder));
      }
      dispatch(setPost(null));
      onSuccess();

      setImages([]);
      displaySuccessToast(response?.data?.message);
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    } finally {
      setUploading(false);
      dispatch(clearPost());
    }
  };

  const reportPost = async (postId, reason) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API}/community/report/${postId}`,
        { reason },
        getAuthConfig()
      );
      console.log(response.data);
      displaySuccessToast("Post reported successfully!");
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    }
  };

  return {
    showPostForm,
    images,
    post,
    tagInputVal,
    uploading,
    detailPost,
    setTagInputVal,
    handlePostFieldOnChange,
    handleImageUpload,
    removeImage,
    getPostByPostId,
    createPost,
    editPost,
    removePost,
    setImages,
    reportPost,
  };
};
