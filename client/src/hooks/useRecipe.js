import axios from "axios";
import { displayErrorToast, displaySuccessToast } from "../utils/toastUtil";
import { getAuthConfig } from "../utils/authHeaders";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRecipes } from "../redux/apiClients/recipeAPI";
import {
  setUserProfile,
  toggleSavedRecipe,
} from "../redux/reducers/userProfileSlice";
import { userSelector } from "../redux/selectors/selectors";

export const useRecipe = () => {
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [personalizedRecipes, setPersonalizedRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector(userSelector);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);

  const dispatch = useDispatch();

  const [recipe, setRecipe] = React.useState(null);
  const [recipeLoading, setRecipeLoading] = React.useState(false);

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
    }
  };

  const fetchTrendingRecipes = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/recipes/trending`,
        {
          ...getAuthConfig(),
          params: { page, pageSize }, // ✅ Correct placement of params
        }
      );
      setTrendingRecipes(response.data.recipes);
    } catch (error) {
      console.error("Error fetching trending recipes:", error);
      displayErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalizedRecipes = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/recipes/personalized`,
        {
          ...getAuthConfig(),
          params: { page, pageSize },
        }
      );
      setPersonalizedRecipes(response.data.recipes);
    } catch (error) {
      console.error("Error fetching personalized recipes:", error);
      displayErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularRecipes = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/recipes/popular`,
        {
          ...getAuthConfig(),
          params: { page, pageSize },
        }
      );
      setPopularRecipes(response.data.popularRecipes);
    } catch (error) {
      console.error("Error fetching popular recipes:", error);
      displayErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentlyAddedRecipes = async (page, pageSize) => {
    try {
      await dispatch(fetchAllRecipes({ page, pageSize }));
      console.log("Recipes fetched successfully");
    } catch (error) {
      console.error("Error fetching recipes:", error);
      displayErrorToast(error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const saveRecipe = async (recipeId) => {
    setRecipeLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API}/recipes/${recipeId}/save`,
        {},
        getAuthConfig()
      );

      dispatch(toggleSavedRecipe(recipeId));

      displaySuccessToast(response?.data?.message);
    } catch (error) {
      console.error("Error toggling recipe save status:", error);
      displayErrorToast(error);
    } finally {
      setRecipeLoading(false);
    }
  };

  const multiFetching = {
    page,
    pageSize,
    trendingRecipes,
    popularRecipes,
    personalizedRecipes,
    fetchPopularRecipes,
    fetchPersonalizedRecipes,
    fetchTrendingRecipes,
    fetchRecentlyAddedRecipes,
    handlePageChange,
  };

  return {
    page,
    pageSize,
    recipe,
    trendingRecipes,
    personalizedRecipes,
    popularRecipes,
    fetchRecentlyAddedRecipes,
    fetchTrendingRecipes,
    fetchPersonalizedRecipes,
    fetchPopularRecipes,
    fetchRecipeInfo,
    handlePageChange,
    saveRecipe,
    loading,
    recipeLoading,
  };
};
