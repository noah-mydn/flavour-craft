import React from "react";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";
import { displayErrorToast, displaySuccessToast } from "../../utils/toastUtil";
import { useDispatch, useSelector } from "react-redux";

import { postSelector, userSelector } from "../../redux/selectors/selectors";
import {
  updatePostField,
  addImages,
  addTag,
  removeTag,
  deleteImage,
  setPost,
  clearPost,
} from "../../redux/reducers/postSlice";

export const useCreatePost = () => {
  const user = useSelector(userSelector);
  const post = useSelector(postSelector);
  const dispatch = useDispatch();

  const [showPostForm, setShowPostForm] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [tagInputVal, setTagInputVal] = React.useState("");

  const openDialogue = () => {
    setShowPostForm(true);
  };
  const closeDialogue = () => {
    setShowPostForm(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "," && tagInputVal.trim() !== "") {
      event.preventDefault();
      const formattedTag = tagInputVal.trim().replace(/^#/, "");

      dispatch(addTag(formattedTag)); // Dispatch addTag action

      setTagInputVal("");
    }
  };

  const handleDelete = (tagToDelete) => {
    dispatch(removeTag(tagToDelete));
  };

  const handlePostFieldOnChange = (e) => {
    const { name, value } = e.target;

    dispatch(updatePostField({ name, value }));
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

    dispatch(deleteImage(index)); // Dispatch removeImage action
  };

  React.useEffect(() => {
    console.log("POST:", post);
  }, [post]);

  React.useEffect(() => {
    console.log("POST:", post);
  }, []);

  const createNewPost = async (e) => {
    e.preventDefault();

    const payload = {
      user: user?.id,
      topic: post?.topic,
      description: post?.description,
      tags: post?.tags,
      images: post?.images,
    };

    console.log("Payload:", payload);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_API + "/posts/create",
        payload,
        {
          headers: {
            ...getAuthConfig(),
          },
        }
      );
      console.log(response);
      displaySuccessToast(response?.data?.message);
      closeDialogue();
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    } finally {
      dispatch(clearPost());
    }
  };

  return {
    showPostForm,
    images,
    post,
    tagInputVal,
    setTagInputVal,
    handlePostFieldOnChange,
    handleImageUpload,
    removeImage,
    handleKeyDown,
    handleDelete,
    createNewPost,
    openDialogue,
    closeDialogue,
  };
};
