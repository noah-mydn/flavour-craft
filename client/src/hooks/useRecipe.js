import axios from "axios";
import { displayErrorToast } from "../utils/toastUtil";
import { getAuthConfig } from "../utils/authHeaders";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getCurrentUserProfile,
  toggleSavedRecipe,
} from "../redux/apiClients/userAPI";
import { fetchRecipes } from "../redux/apiClients/recipeAPI";
import {
  rateRecipes,
  removeRecipe,
  saveRecipe,
} from "../redux/reducers/userProfileSlice";
import { profileSelector } from "../redux/selectors/selectors";

export const useRecipe = () => {
  const [timeBasedRecipes, setTimeBasedRecipes] = React.useState([]);
  const [time, setTime] = React.useState("");
  const [sortValue, setSortValue] = React.useState("all");
  const [trendingRecipes, setTrendingRecipes] = React.useState([]);

  const dispatch = useDispatch();

  const [recipe, setRecipe] = React.useState(null);
  const [recipeLoading, setRecipeLoading] = React.useState(false);
  const profile = useSelector(profileSelector);
  const [recipeDayLoading, setRecipeDayLoading] = React.useState(false);
  const [recipeOfTheDay, setRecipeOfTheDay] = React.useState({});

  const fetchTrendingRecipes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/recipes/trending`,
        getAuthConfig()
      );
      setTrendingRecipes(response.data.recipes);
    } catch (error) {
      displayErrorToast(error);
    }
  };

  const fetchRecipeInfo = async (recipeId) => {
    setRecipeLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/recipes/${recipeId}`,
        getAuthConfig()
      );
      if (response.status === 200 && response.data.recipe) {
        setRecipe(response.data.recipe);
      }
    } catch (error) {
      displayErrorToast(error);
    } finally {
      setRecipeLoading(false);
    }
  };

  const handleSaveRecipe = async (recipeId) => {
    try {
      await dispatch(toggleSavedRecipe(recipeId)).unwrap();
      if (profile?.savedRecipes?.includes(recipeId)) {
        dispatch(saveRecipe(recipeId));
      } else {
        dispatch(removeRecipe(recipeId));
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const rateRecipe = async (recipeId, rating) => {
    const payload = {
      rating: rating,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API}/recipes/${recipeId}/rate`,
        payload,
        getAuthConfig()
      );
      if (response.data.status === 200) {
        dispatch(rateRecipes({ recipeId, rating: rating }));
      }

      console.log(response.data);
    } catch (error) {
      displayErrorToast(error);
    }
  };

  const handleSortChange = (event, page, pageSize) => {
    const newSortValue = event.target.value;
    setSortValue(newSortValue);

    dispatch(fetchRecipes({ sortValue: newSortValue, page, pageSize }));
  };

  const fetchRecipeOfTheDay = async () => {
    setRecipeDayLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/recipes/recipe-of-the-day`,
        getAuthConfig()
      );
      console.log(response.data);
      if (response.data.status === 200) {
        setRecipeOfTheDay(response.data.recipe);
      }
    } catch (error) {
      console.log(error);
      displayErrorToast(error);
    }
  };

  const getTimedBasedRecipe = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/recipes/recommend`,
        getAuthConfig()
      );
      console.log(response.data);
      if (response.data.status === 200) {
        setTimeBasedRecipes(response?.data?.recipes);
        setTime(response?.data?.time);
      }
    } catch (error) {
      console.log(error);
      displayErrorToast(error);
    }
  };

  const filterRecipeOption = {
    sortValue,
    handleSortChange,
  };

  return {
    trendingRecipes,
    recipe,
    fetchRecipeInfo,
    fetchTrendingRecipes,
    handleSaveRecipe,
    rateRecipe,
    recipeLoading,
    filterRecipeOption,
    fetchRecipeOfTheDay,
    recipeOfTheDay,
    recipeDayLoading,
    timeBasedRecipes,
    time,
    getTimedBasedRecipe,
  };
};
