import axios from "axios";
import { displayErrorToast } from "../utils/toastUtil";
import { getAuthConfig } from "../utils/authHeaders";

export const useRecipe = () => {
  const [trendingRecipes, setTrendingRecipes] = React.useState([]);
  const [personalizedRecipes, setPersonalizedRecipes] = React.useState([]);

  const fetchTrendingRecipes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/recipes/trending`,
        getAuthConfig
      );
      console.log(response);
      setTrendingRecipes(response.data.recipes);
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    }
  };

  const fetchPersonalizedRecipes = async () => {
    try {
      const respones = await axios.get(
        `${process.env.REACT_APP_BASE_API}/recipes/personalized`
      );
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    }
  };
};
