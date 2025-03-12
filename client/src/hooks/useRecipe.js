import axios from "axios";
import { displayErrorToast, displaySuccessToast } from "../utils/toastUtil";
import { getAuthConfig } from "../utils/authHeaders";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRecipes, fetchRecipes } from "../redux/apiClients/recipeAPI";
import { userSelector } from "../redux/selectors/selectors";
import {
  getCurrentUserProfile,
  toggleSavedRecipe,
} from "../redux/apiClients/userAPI";

export const useRecipe = () => {
  const [sortValue, setSortValue] = React.useState("all");

  const [page, setPage] = useState(1);
  const pageSize = 10;

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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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

  const handleSortChange = (event) => {
    const newSortValue = event.target.value;
    setSortValue(newSortValue);

    dispatch(fetchRecipes({ sortValue: newSortValue, page, pageSize }));
  };

  const filterRecipeOption = {
    sortValue,
    handleSortChange,
  };

  return {
    page,
    recipe,
    fetchRecipeInfo,
    handlePageChange,
    saveRecipe,
    recipeLoading,
    filterRecipeOption,
  };
};
