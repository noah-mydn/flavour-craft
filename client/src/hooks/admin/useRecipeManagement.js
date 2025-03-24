import { useDispatch, useSelector } from "react-redux";
import {
  deleteRecipe,
  fetchFilteredRecipes,
  searchRecipe,
} from "../../redux/apiClients/recipeAPI";
import { displayErrorToast, displaySuccessToast } from "../../utils/toastUtil";
import { getAuthConfig } from "../../utils/authHeaders";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  paginationSelector,
  recipesListSelector,
} from "../../redux/selectors/selectors";
import { useNavigate } from "react-router-dom";
export const useRecipeManagement = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [deletingRecipeName, setDeletingRecipeName] = useState("");
  const [recipeGeneratedMsg, setRecipeGeneratedMsg] = useState(null);
  const [generatedLoading, setGeneratedLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const pagination = useSelector(paginationSelector);
  const recipes = useSelector(recipesListSelector);
  const BASE_URL = process.env.REACT_APP_BASE_API + "/recipes";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      queryRecipe(searchTerm);
    } else {
      getRecipesInventory();
    }
  }, [page, pageSize, searchTerm]);

  const getRecipesInventory = () => {
    setLoading(true);
    dispatch(
      fetchFilteredRecipes({
        filters: "all",
        page,
        pageSize,
      })
    ).finally(() => setLoading(false));
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    queryRecipe(value);
  };

  const openThumbnailDialog = (recipeId, currentImage) => {
    setCurrentRecipeId(recipeId);
    setImagePreview(currentImage || "");
    setSelectedImage(null);
    setOpenImageDialog(true);
  };

  const closeThumbnailDialog = () => {
    setOpenImageDialog(false);
    setImagePreview("");
    setSelectedImage(null);
    setCurrentRecipeId(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("It's here!");
    setSelectedImage(file);

    setImagePreview(URL.createObjectURL(file));
  };

  const updateRecipeThumbnail = async () => {
    console.log(currentRecipeId);
    if (!selectedImage || !currentRecipeId) {
      displayErrorToast("Please select an image to upload");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("thumbnail", selectedImage);

    try {
      const response = await axios.put(
        `${BASE_URL}/${currentRecipeId}/upload`,
        formData,
        getAuthConfig(true)
      );

      if (response.status === 200) {
        displaySuccessToast("Thumbnail updated successfully");
        getRecipesInventory();
        closeThumbnailDialog();
      }
    } catch (error) {
      console.error(error);
      displayErrorToast(
        error?.response?.data?.message || "Failed to update thumbnail"
      );
    } finally {
      setLoading(false);
    }
  };

  const discardRecipe = async (id) => {
    setLoading(true);
    try {
      console.log("ABOUT TO DELETE ID:", id);
      const result = await dispatch(deleteRecipe(id));
      if (result.meta.requestStatus === "fulfilled") {
        displaySuccessToast("Recipe deleted successfully");
        getRecipesInventory();
      }
    } catch (error) {
      displayErrorToast("Failed to delete recipe");
    } finally {
      setLoading(false);
    }
  };

  const viewRecipeDetail = (id) => {
    navigate(`/admin/recipes/${id}`);
  };

  const editRecipe = (id) => {
    navigate(`/admin/recipes/edit/${id}`);
  };

  const queryRecipe = async (value) => {
    setLoading(true);
    if (!value) {
      getRecipesInventory();
      return;
    }
    try {
      let result = await dispatch(
        searchRecipe({
          query: value,
          page,
          pageSize,
        })
      ).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (recipeId, recipeName) => {
    setRecipeToDelete(recipeId);
    setDeletingRecipeName(recipeName);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
    setDeletingRecipeName("");
  };

  // Confirm delete action
  const confirmDelete = () => {
    if (recipeToDelete) {
      discardRecipe(recipeToDelete);
      closeDeleteDialog();
    }
  };

  const batchRecipeGeneration = async (
    tags,
    cuisines,
    dietaryOptions,
    count,
    onSuccess
  ) => {
    try {
      setGeneratedLoading(true);
      const response = await axios.post(
        `${BASE_URL}/batch-generate`,
        {
          tags,
          cuisines,
          dietaryOptions,
          count,
        },
        getAuthConfig()
      );
      console.log(response.data);
      if (response.data.status === 200) {
        setRecipeGeneratedMsg(response?.data?.message);
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    } finally {
      setGeneratedLoading(false);
    }
  };

  return {
    recipes,
    pagination,
    loading,
    page,
    pageSize,
    searchTerm,
    openImageDialog,
    imagePreview,
    recipeToDelete,
    deletingRecipeName,
    deleteDialogOpen,
    recipeGeneratedMsg,
    generatedLoading,
    setSearchTerm,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    getRecipesInventory,
    discardRecipe,
    editRecipe,
    viewRecipeDetail,
    openThumbnailDialog,
    closeThumbnailDialog,
    handleFileSelect,
    updateRecipeThumbnail,
    confirmDelete,
    openDeleteDialog,
    closeDeleteDialog,
    batchRecipeGeneration,
  };
};
