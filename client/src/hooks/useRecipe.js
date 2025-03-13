import axios from "axios";
import { displayErrorToast } from "../utils/toastUtil";
import { getAuthConfig } from "../utils/authHeaders";
import React from "react";
import { useDispatch } from "react-redux";

import {
  getCurrentUserProfile,
  toggleSavedRecipe,
} from "../redux/apiClients/userAPI";
import { fetchRecipes } from "../redux/apiClients/recipeAPI";

export const useRecipe = () => {
  const [sortValue, setSortValue] = React.useState("all");

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
    } finally {
      setRecipeLoading(false);
    }
  };

  const saveRecipe = async (recipeId) => {
    try {
      await dispatch(toggleSavedRecipe(recipeId)).unwrap();
      await dispatch(getCurrentUserProfile()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSortChange = (event, page, pageSize) => {
    const newSortValue = event.target.value;
    setSortValue(newSortValue);

    dispatch(fetchRecipes({ sortValue: newSortValue, page, pageSize }));
  };

  const filterRecipeOption = {
    sortValue,
    handleSortChange,
  };

  return {
    recipe,
    fetchRecipeInfo,
    saveRecipe,
    recipeLoading,
    filterRecipeOption,
  };
};
