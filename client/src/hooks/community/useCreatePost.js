import React from "react";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";
import { displayErrorToast, displaySuccessToast } from "../../utils/toastUtil";
import { useDispatch, useSelector } from "react-redux";

import { postSelector, userSelector } from "../../redux/selectors/selectors";
import {
  updatePostField,
  addImages,
  deleteImage,
  setPost,
  clearPost,
} from "../../redux/reducers/postSlice";
import { convertBlobsToFiles } from "../../utils/blobToFile";
import { fetchPosts } from "../../redux/apiClients/postsAPI";

export const useCreatePost = () => {
  const user = useSelector(userSelector);
  const post = useSelector(postSelector);
  const dispatch = useDispatch();

  const [showPostForm, setShowPostForm] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [tagInputVal, setTagInputVal] = React.useState("");

  const openDialogue = () => {
    setShowPostForm(true);
  };
  const closeDialogue = () => {
    setShowPostForm(false);
  };

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

    dispatch(addImages(imageUrls)); // Dispatch addImages action
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));

    dispatch(deleteImage(index));
  };

  React.useEffect(() => {
    console.log("POST:", post);
  }, [post]);

  React.useEffect(() => {
    console.log("POST:", post);
  }, []);

  const createPost = async () => {
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
    imageFiles.forEach((file) => {
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
        dispatch(fetchPosts(1, 10));
      }
      displaySuccessToast(response?.data?.message);

      closeDialogue();
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    } finally {
      setUploading(false);
      dispatch(clearPost());
    }
  };

  return {
    showPostForm,
    images,
    post,
    tagInputVal,
    uploading,
    setTagInputVal,
    handlePostFieldOnChange,
    handleImageUpload,
    removeImage,
    createPost,
    openDialogue,
    closeDialogue,
  };
};
