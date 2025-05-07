import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  useTheme,
  alpha,
  useMediaQuery,
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  cuisinesSelector,
  dietaryOptionsSelector,
} from "../../redux/selectors/selectors";
import { useCategory } from "../../hooks/admin/useCategory";
import PageHeader from "../../components/Admin/PageHeader";
import { DetailCard } from "../../styles/ContainerStyles";

const ManageCategories = () => {
  // Redux state selectors
  const cuisines = useSelector(cuisinesSelector);
  const dietaryOptions = useSelector(dietaryOptionsSelector);
  const cuisineLoading = useSelector((state) => state.cuisine.cuisineLoading);
  const dietaryLoading = useSelector((state) => state.dietary.dietaryLoading);
  const cuisinePagination = useSelector((state) => state.cuisine.pagination);
  const dietaryPagination = useSelector((state) => state.dietary.pagination);

  // Use custom hook with all the logic extracted
  const {
    cuisineManagement,
    dietaryManagement,
    handleCategoryTypeChange,
    dialogManagement,
    deleteManagement,
    paginationManagement,
    filterManagement,
  } = useCategory();

  const { fetchAllCuisines } = cuisineManagement;
  const { fetchAllDietaryOptions } = dietaryManagement;
  const {
    openDialog,
    editMode,
    currentCategory,
    setCurrentCategory,
    handleOpenDialog,
    handleCloseDialog,
    handleInputChange,
    handleSaveCategory,
  } = dialogManagement;
  const {
    deleteConfirmOpen,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
    handleConfirmDelete,
  } = deleteManagement;
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } =
    paginationManagement;
  const { selectedType, setSelectedType, filterCategories } = filterManagement;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Compute loading state
  const loading = cuisineLoading || dietaryLoading;

  // Combine categories for display
  const categories = [
    ...cuisines.map((cuisine) => ({
      id: cuisine?._id || cuisine?.id,
      name: cuisine?.name,
      type: "cuisine",
    })),
    ...dietaryOptions.map((option) => ({
      id: option?._id || option?.id,
      name: option?.name,
      type: "dietary",
    })),
  ];

  // Calculate total for pagination
  const getTotalCount = () => {
    if (selectedType === "cuisine") {
      return cuisinePagination?.total || 0;
    } else {
      return dietaryPagination?.total || 0;
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllCuisines(1, rowsPerPage);
    fetchAllDietaryOptions(1, rowsPerPage);
  }, [rowsPerPage]);

  useEffect(() => {
    fetchAllCuisines(1, rowsPerPage);
    fetchAllDietaryOptions(1, rowsPerPage);
  }, []);

  // Calculate display index based on pagination
  const getDisplayIndex = (index) => {
    return page * rowsPerPage + index + 1;
  };

  // Filter categories
  const filteredCategories = filterCategories(categories);

  return (
    <Box sx={{ p: { xs: 0, md: 3 }, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? 2 : 0,
          mb: 3,
        }}
      >
        <PageHeader
          title="Category Management"
          description="Manage categories regarding cuisine types, lifestyles, dietary preferences or health conditions "
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(false)}
          sx={{
            backgroundColor: "primary",
            "&:hover": { backgroundColor: "primary.dark" },
            alignSelf: isMobile ? "stretch" : "auto",
          }}
          fullWidth={isMobile}
        >
          Add Category
        </Button>
      </Box>

      <DetailCard sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filter Categories
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {/* Removed the "All Categories" Chip */}
          <Chip
            label="Dietary Options"
            onClick={() => setSelectedType("dietary")}
            //color={selectedType === "dietary" ? "secondary" : "default"}
            sx={{
              px: 1,
              mb: { xs: 1, md: 0 },
              color: selectedType === "dietary" ? "#fff" : "#222",
              background:
                selectedType === "dietary"
                  ? theme.palette.primary.main
                  : "default",
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: "#eee",
              },
            }}
          />
          <Chip
            label="Cuisines"
            onClick={() => setSelectedType("cuisine")}
            sx={{
              px: 1,
              mb: { xs: 1, md: 0 },
              color: selectedType === "cuisine" ? "#fff" : "#222",
              background:
                selectedType === "cuisine"
                  ? theme.palette.primary.main
                  : "default",
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: "#eee",
              },
            }}
          />
        </Box>
      </DetailCard>

      {loading && categories.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={36} />
        </Box>
      ) : (
        <DetailCard>
          <TableContainer
            sx={{
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: isMobile ? 270 : 650 }}>
              <TableHead
                sx={{
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      padding: isMobile ? "5px" : "10px",
                      fontSize: isMobile ? "0.8rem" : "inherit",
                      color: "#fff",
                    }}
                  >
                    Index
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      padding: isMobile ? "5px" : "10px",
                      fontSize: isMobile ? "0.8rem" : "inherit",
                      color: "#fff",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      padding: isMobile ? "5px" : "10px",
                      fontSize: isMobile ? "0.8rem" : "inherit",
                      color: "#fff",
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      padding: isMobile ? "5px" : "10px",
                      fontSize: isMobile ? "0.8rem" : "inherit",
                      color: "#fff",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => (
                    <TableRow
                      key={category.id}
                      sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                      <TableCell
                        sx={{
                          padding: isMobile ? "5px" : "10px",
                          fontSize: isMobile ? "0.8rem" : "inherit",
                          pl: isMobile ? 1 : 3,
                        }}
                      >
                        {getDisplayIndex(index)}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: isMobile ? "5px" : "10px",
                          fontSize: isMobile ? "0.8rem" : "inherit",
                          maxWidth: isMobile ? "120px" : "auto",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {category.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: isMobile ? "5px" : "10px",
                          fontSize: isMobile ? "0.8rem" : "inherit",
                        }}
                      >
                        <Chip
                          label={
                            category.type === "dietary" ? "Dietary" : "Cuisine"
                          }
                          size="small"
                          sx={{
                            maxWidth: isMobile ? "80px" : "auto",
                            //fontSize: isMobile ? "0.7rem" : "0.75rem",
                            backgroundColor:
                              category.type === "dietary"
                                ? "#e8f5e9"
                                : "#e3f2fd",

                            color:
                              category.type === "dietary"
                                ? "#2e7d32"
                                : "#1565c0",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: isMobile ? "5px" : "16px",
                          fontSize: isMobile ? "0.8rem" : "inherit",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(true, category)}
                            sx={{
                              backgroundColor: "#e3f2fd",
                              padding: isMobile ? 0.5 : 1,
                            }}
                          >
                            <EditIcon
                              color="success"
                              fontSize={isMobile ? "small" : "medium"}
                            />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleOpenDeleteConfirm(
                                category.id,
                                category.type
                              )
                            }
                            sx={{
                              backgroundColor: "#ffebee",
                              padding: isMobile ? 0.5 : 1,
                            }}
                          >
                            <DeleteIcon
                              color="error"
                              fontSize={isMobile ? "small" : "medium"}
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        No categories found. Click "Add Category" to create one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={getTotalCount()}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              borderTop: "1px solid #e0e0e0",
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  fontSize: isMobile ? "0.75rem" : "inherit",
                },
            }}
          />
        </DetailCard>
      )}

      {/* Category Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        //fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #e0e0e0",
            pb: 2,
            position: "relative",
            color: "white",
            bgcolor: theme.palette.primary.main,
          }}
        >
          {editMode ? "Edit Category" : "Add New Category"}
          {isMobile && (
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
          >
            <TextField
              label="Category Name"
              name="name"
              fullWidth
              size="small"
              value={currentCategory.name}
              onChange={handleInputChange}
              autoFocus
              required
              variant="outlined"
            />

            {!editMode && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 2,
                  alignItems: isMobile ? "flex-start" : "center",
                }}
              >
                <Typography variant="body1">Category Type:</Typography>
                <Box sx={{ display: "flex", gap: 1, mt: isMobile ? 1 : 0 }}>
                  <Chip
                    label="Dietary Option"
                    onClick={() => {
                      const updatedCategory = {
                        ...currentCategory,
                        type: "dietary",
                      };
                      setCurrentCategory(updatedCategory);
                      handleCategoryTypeChange({
                        target: { value: "dietary" },
                      });
                    }}
                    color={
                      currentCategory?.type === "dietary"
                        ? "primary"
                        : "default"
                    }
                    clickable
                  />
                  <Chip
                    label="Cuisine"
                    onClick={() => {
                      const updatedCategory = {
                        ...currentCategory,
                        type: "cuisine",
                      };
                      setCurrentCategory(updatedCategory);
                      handleCategoryTypeChange({
                        target: { value: "cuisine" },
                      });
                    }}
                    color={
                      currentCategory?.type === "cuisine"
                        ? "primary"
                        : "default"
                    }
                    clickable
                  />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid #e0e0e0",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 1 : 0,
          }}
        >
          {!isMobile && (
            <Button onClick={handleCloseDialog} color="inherit" sx={{ mr: 1 }}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            color="primary"
            disabled={!currentCategory.name.trim() || loading}
            fullWidth={isMobile}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : editMode ? (
              "Update"
            ) : (
              "Add"
            )}{" "}
            Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this category? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCategories;
