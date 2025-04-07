import { useDispatch, useSelector } from "react-redux";
import {
  deleteRecipe,
  fetchFilteredRecipes,
  fetchRecipes,
  searchRecipe,
} from "../../redux/apiClients/recipeAPI";
import { displayErrorToast, displaySuccessToast } from "../../utils/toastUtil";
import { getAuthConfig } from "../../utils/authHeaders";

import { useState, useEffect, useMemo } from "react";
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

  // New state for filtering and sorting
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [sortDirection, setSortDirection] = useState("desc"); // "asc" or "desc"
  const [sortField, setSortField] = useState("createdAt");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const pagination = useSelector(paginationSelector);
  const allRecipes = useSelector(recipesListSelector);
  const BASE_URL = process.env.REACT_APP_BASE_API + "/recipes";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get unique cuisine types for the filter dropdown
  const uniqueCuisineTypes = useMemo(() => {
    const cuisines = new Set();
    allRecipes.forEach((recipe) => {
      if (recipe.cuisineTypes && recipe.cuisineTypes.length > 0) {
        recipe.cuisineTypes.forEach((cuisine) => cuisines.add(cuisine));
      }
    });
    return Array.from(cuisines).sort();
  }, [allRecipes]);

  // Filter and sort recipes on the frontend
  const recipes = useMemo(() => {
    let filteredRecipes = [...allRecipes];

    // Apply search filter
    if (searchTerm) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply cuisine filter
    if (cuisineFilter) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) =>
          recipe.cuisineTypes && recipe.cuisineTypes.includes(cuisineFilter)
      );
    }

    // Apply sorting
    filteredRecipes.sort((a, b) => {
      const fieldA = a[sortField] ? a[sortField] : "";
      const fieldB = b[sortField] ? b[sortField] : "";

      if (sortField === "createdAt") {
        const dateA = new Date(fieldA);
        const dateB = new Date(fieldB);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      // For string fields
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      return 0;
    });

    // Calculate pagination for frontend
    const calculatedTotalItems = filteredRecipes.length;
    const calculatedTotalPages = Math.ceil(calculatedTotalItems / pageSize);

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedRecipes = filteredRecipes.slice(
      startIndex,
      startIndex + pageSize
    );

    // Update local pagination object for UI
    const paginationInfo = {
      ...pagination,
      totalRecipes: calculatedTotalItems,
      totalPages: calculatedTotalPages,
    };

    return {
      paginatedData: paginatedRecipes,
      paginationInfo,
    };
  }, [
    allRecipes,
    searchTerm,
    cuisineFilter,
    sortField,
    sortDirection,
    page,
    pageSize,
  ]);

  useEffect(() => {
    getRecipesInventory();
  }, [page, pageSize]);

  const getRecipesInventory = () => {
    setLoading(true);
    dispatch(
      fetchRecipes({
        sortValue: "all",
        page: 1, // Always fetch all data from page 1
        pageSize: 1000, // Fetch a large number to handle frontend pagination
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
    setPage(1); // Reset to first page when searching
  };

  const handleCuisineFilterChange = (cuisine) => {
    setCuisineFilter(cuisine);
    setPage(1); // Reset to first page when filtering
  };

  const handleSortChange = (field) => {
    // If clicking on the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to descending for new field
    }
    setPage(1); // Reset to first page when sorting
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

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const updateRecipeThumbnail = async () => {
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

  const openDeleteDialog = (recipeId, recipeName) => {
    setRecipeToDelete(recipeId);
    setDeletingRecipeName(recipeName);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
    setDeletingRecipeName("");
  };

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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setCuisineFilter("");
    setSortDirection("desc");
    setSortField("createdAt");
    setPage(1);
  };

  return {
    recipes: recipes.paginatedData,
    pagination: recipes.paginationInfo,
    loading,
    page,
    pageSize,
    searchTerm,
    cuisineFilter,
    sortDirection,
    sortField,
    uniqueCuisineTypes,
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
    handleCuisineFilterChange,
    handleSortChange,
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
    clearFilters,
    batchRecipeGeneration,
  };
};
