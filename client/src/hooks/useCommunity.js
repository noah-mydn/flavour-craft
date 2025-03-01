import axios from "axios";
import { getAuthConfig } from "../utils/authHeaders";
import { useDispatch, useSelector } from "react-redux";
import { postSelector, userSelector } from "../redux/selectors/selectors";
import {
  displayErrorToast,
  displayInfoToast,
  displaySuccessToast,
} from "../utils/toastUtil";
import {
  addTag,
  addImages,
  setPost,
  removeImage,
  removeTag,
  updatePostField,
} from "../../redux/reducers/postSlice";
import React from "react";

export const useCommunity = () => {
  const post = useSelector(postSelector);
  const dispatch = useDispatch();

  //For viewing
  const [comments, setComments] = React.useState([]);
  const [allPosts, setAllPosts] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [reactions, setReactions] = React.useState();

  const user = useSelector(userSelector);

  //handle content edit
  const handleEdit = (post) => {
    setIsEditing(true);
    setPost(post);
  };

  //Create

  //Edit
  const editPost = async () => {
    let payload = {
      user: user?._id,
      topic: post?.topic,
      description: post?.description,
      tags: post?.tags,
    };
    try {
      const response = axios.post(
        `${process.env.REACT_APP_BASE_API}/posts/${post._id}`,
        payload,
        getAuthConfig()
      );
      console.log(response);
      displayInfoToast("Post edited!");
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    }
  };
  //Delete
  const deletePost = async () => {
    try {
      const response = axios.delete(
        `${process.env.REACT_APP_BASE_API}/posts/${post._id}}`,
        getAuthConfig()
      );
      console.log(response);
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    }
  };

  return {};
};
