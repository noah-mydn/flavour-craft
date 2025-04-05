import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCuisine,
  deleteCuisine,
  fetchCuisines,
  updateCuisine,
} from "../../redux/apiClients/cuisineAPI";
import {
  addDietaryOption,
  deleteDietaryOption,
  fetchDietaryOptions,
  updateDietaryOption,
} from "../../redux/apiClients/dietaryAPI";
import { setCuisine } from "../../redux/reducers/cuisineSlice";
import { setDietary } from "../../redux/reducers/dietarySlice";
import { displayInfoToast } from "../../utils/toastUtil";

export const useCategory = () => {
  const dispatch = useDispatch();

  // State from original component
  const [categoryType, setCategoryType] = useState("dietary");
  // Changed default selectedType from "all" to "dietary"
  const [selectedType, setSelectedType] = useState("dietary");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    type: "dietary",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // API functions
  const fetchAllCuisines = (page, pageSize) => {
    dispatch(fetchCuisines({ page, pageSize }));
  };

  const fetchAllDietaryOptions = (page, pageSize) => {
    dispatch(fetchDietaryOptions({ page, pageSize }));
  };

  const addNewCuisineType = (category, onSuccess) => {
    dispatch(
      addCuisine({
        name: category,
      })
    )
      .unwrap()
      .then((result) => {
        if (result) {
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("Failed to add cuisine:", error);
      });
  };

  const addNewDietaryOption = (category, onSuccess) => {
    dispatch(
      addDietaryOption({
        name: category,
      })
    )
      .unwrap()
      .then((result) => {
        if (result) {
          console.log("Update successful, fetching cuisines...");
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("Failed to add dietary option:", error);
      });
  };

  const updateCuisineType = (cuisine, onSuccess) => {
    console.log("Selected Cuisine:", cuisine);
    dispatch(
      updateCuisine({
        id: cuisine.id,
        name: cuisine.name,
      })
    )
      .unwrap()
      .then((result) => {
        if (result) {
          console.log("Update successful, fetching cuisines...");
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("Failed to update cuisine:", error);
      });
  };

  const updateDietary = (dietary, onSuccess) => {
    console.log("Selected Dietary Option:", dietary);
    dispatch(
      updateDietaryOption({
        id: dietary.id,
        name: dietary.name,
      })
    )
      .unwrap()
      .then((result) => {
        if (result) {
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("Failed to update dietary option:", error);
      });
  };

  const deleteCuisineType = (id, onSuccess) => {
    console.log("TO be deleted cuisine:", id);
    dispatch(deleteCuisine({ id }))
      .unwrap()
      .then((result) => {
        if (result) {
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("Failed to delete cuisine:", error);
      });
  };

  const deleteDietary = (id, onSuccess) => {
    dispatch(deleteDietaryOption(id))
      .unwrap()
      .then((result) => {
        if (result) {
          onSuccess();
        }
      })
      .catch((error) => {
        console.error("Failed to delete dietary option:", error);
      });
  };

  // Category state management
  const handleCategoryFieldChange = (categoryData) => {
    if (categoryType === "cuisine") {
      dispatch(setCuisine(categoryData));
    } else {
      dispatch(setDietary(categoryData));
    }
  };

  const handleCategoryTypeChange = (e) => {
    const newType = typeof e === "object" ? e.target.value : e;
    setCategoryType(newType);
  };

  // Dialog management
  const handleOpenDialog = (isEdit = false, category = null) => {
    setEditMode(isEdit);
    setCurrentCategory(category || { name: "", type: "dietary" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedCategory = {
      ...currentCategory,
      [name]: value,
    };
    setCurrentCategory(updatedCategory);

    // Update the Redux store with the current category data
    handleCategoryFieldChange(updatedCategory);
  };

  const handleSaveCategory = () => {
    if (!currentCategory.name.trim()) {
      displayInfoToast("Category name cannot be empty");
      return;
    }

    const onSuccessCuisine = () => {
      handleCloseDialog();
      fetchAllCuisines(page + 1, rowsPerPage);
    };

    const onSuccessDietary = () => {
      handleCloseDialog();
      fetchAllDietaryOptions(page + 1, rowsPerPage);
    };

    if (editMode) {
      if (currentCategory.type === "cuisine") {
        updateCuisineType(currentCategory, onSuccessCuisine);
      } else {
        updateDietary(currentCategory, onSuccessDietary);
      }
    } else {
      if (currentCategory.type === "cuisine") {
        addNewCuisineType(currentCategory.name.trim(), onSuccessCuisine);
      } else {
        addNewDietaryOption(currentCategory.name.trim(), onSuccessDietary);
      }
    }
  };

  // Delete confirmation management
  const handleOpenDeleteConfirm = (id, type) => {
    setCategoryToDelete({ id, type });
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;

    const { id, type } = categoryToDelete;

    const onDeleteSuccess = () => {
      if (type === "cuisine") {
        fetchAllCuisines(page + 1, rowsPerPage);
      } else {
        fetchAllDietaryOptions(page + 1, rowsPerPage);
      }
    };

    if (type === "cuisine") {
      deleteCuisineType(id, onDeleteSuccess);
    } else {
      deleteDietary(id, onDeleteSuccess);
    }

    handleCloseDeleteConfirm();
  };

  // Pagination management
  const handleChangePage = (event, newPage) => {
    setPage(newPage);

    const apiPage = newPage + 1;

    if (selectedType === "cuisine") {
      fetchAllCuisines(apiPage, rowsPerPage);
    } else {
      fetchAllDietaryOptions(apiPage, rowsPerPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    if (selectedType === "cuisine") {
      fetchAllCuisines(1, newRowsPerPage);
    } else {
      fetchAllDietaryOptions(1, newRowsPerPage);
    }
  };

  const filterCategories = (categories) => {
    return categories.filter((cat) => cat.type === selectedType);
  };

  const fetchDataWithPagination = () => {
    const apiPage = page + 1;

    if (selectedType === "cuisine") {
      fetchAllCuisines(apiPage, rowsPerPage);
    } else {
      fetchAllDietaryOptions(apiPage, rowsPerPage);
    }
  };

  useEffect(() => {
    setPage(0);

    fetchDataWithPagination();
  }, [selectedType, rowsPerPage]);

  const cuisineManagement = {
    fetchAllCuisines,
    addNewCuisineType,
    updateCuisineType,
    deleteCuisineType,
  };

  const dietaryManagement = {
    fetchAllDietaryOptions,
    addNewDietaryOption,
    updateDietary,
    deleteDietary,
  };

  // Bundle dialog management functions
  const dialogManagement = {
    openDialog,
    editMode,
    currentCategory,
    setCurrentCategory,
    handleOpenDialog,
    handleCloseDialog,
    handleInputChange,
    handleSaveCategory,
  };

  // Bundle delete confirmation management
  const deleteManagement = {
    deleteConfirmOpen,
    categoryToDelete,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
    handleConfirmDelete,
  };

  // Bundle pagination management
  const paginationManagement = {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  };

  // Bundle filter management
  const filterManagement = {
    selectedType,
    setSelectedType,
    filterCategories,
  };

  return {
    cuisineManagement,
    dietaryManagement,
    categoryType,
    handleCategoryFieldChange,
    handleCategoryTypeChange,
    dialogManagement,
    deleteManagement,
    paginationManagement,
    filterManagement,
  };
};
