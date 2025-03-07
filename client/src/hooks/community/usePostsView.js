import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selectors";
import { displayErrorToast, displaySuccessToast } from "../../utils/toastUtil";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";
import { setPost } from "../../redux/reducers/postSlice";

export const usePostsView = () => {
  const [allPosts, setAllPosts] = React.useState([]);
  const [postsLoading, setPostsLoading] = React.useState(false);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  //View all posts
  const viewAllPosts = async () => {
    setPostsLoading(true);
    try {
      const response = await axios.get(
        process.env.REACT_APP_BASE_API + "/posts",
        getAuthConfig()
      );
      setAllPosts(response?.data?.posts);
      displaySuccessToast(response?.data?.message);
    } catch (error) {
      console.log(error);
      displayErrorToast(error);
    } finally {
      setPostsLoading(false);
    }
  };

  //Get post by postId
  const getPostById = async (postId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/posts/${postId}`
      );
      dispatch(setPost(response?.data?.post));
    } catch (error) {
      console.log(error);
      displayErrorToast(error);
    }
  };

  return {};
};
