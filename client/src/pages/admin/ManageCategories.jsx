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
  TextField,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Mock data - replace with actual API calls
const mockCategories = [
  { id: 1, name: "Vegetarian", type: "dietary", active: true },
  { id: 2, name: "Vegan", type: "dietary", active: true },
  { id: 3, name: "Gluten-Free", type: "dietary", active: true },
  { id: 4, name: "Italian", type: "cuisine", active: true },
  { id: 5, name: "Mexican", type: "cuisine", active: true },
  { id: 6, name: "Japanese", type: "cuisine", active: false },
];

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    type: "dietary",
    active: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 800);
  }, []);

  const handleOpenDialog = (isEdit = false, category = null) => {
    setEditMode(isEdit);
    setCurrentCategory(category || { name: "", type: "dietary", active: true });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: name === "active" ? checked : value,
    });
  };

  const handleSaveCategory = () => {
    if (!currentCategory.name.trim()) {
      setSnackbar({
        open: true,
        message: "Category name cannot be empty",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (editMode) {
        setCategories(
          categories.map((cat) =>
            cat.id === currentCategory.id ? currentCategory : cat
          )
        );
        setSnackbar({
          open: true,
          message: "Category updated successfully",
          severity: "success",
        });
      } else {
        const newCategory = {
          ...currentCategory,
          id: Math.max(...categories.map((c) => c.id), 0) + 1,
        };
        setCategories([...categories, newCategory]);
        setSnackbar({
          open: true,
          message: "Category added successfully",
          severity: "success",
        });
      }
      setLoading(false);
      handleCloseDialog();
    }, 600);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCategories(categories.filter((cat) => cat.id !== id));
        setSnackbar({
          open: true,
          message: "Category deleted successfully",
          severity: "success",
        });
        setLoading(false);
      }, 600);
    }
  };

  const handleToggleActive = (id, currentActive) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCategories(
        categories.map((cat) =>
          cat.id === id ? { ...cat, active: !currentActive } : cat
        )
      );
      setSnackbar({
        open: true,
        message: `Category ${
          currentActive ? "deactivated" : "activated"
        } successfully`,
        severity: "success",
      });
      setLoading(false);
    }, 400);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredCategories =
    selectedType === "all"
      ? categories
      : categories.filter((cat) => cat.type === selectedType);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
          Manage Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(false)}
          sx={{
            backgroundColor: "#2e7d32",
            "&:hover": { backgroundColor: "#1b5e20" },
          }}
        >
          Add Category
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filter Categories
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label="All Categories"
            onClick={() => setSelectedType("all")}
            color={selectedType === "all" ? "primary" : "default"}
            sx={{ px: 1 }}
          />
          <Chip
            label="Dietary Options"
            onClick={() => setSelectedType("dietary")}
            color={selectedType === "dietary" ? "primary" : "default"}
            sx={{ px: 1 }}
          />
          <Chip
            label="Cuisines"
            onClick={() => setSelectedType("cuisine")}
            color={selectedType === "cuisine" ? "primary" : "default"}
            sx={{ px: 1 }}
          />
        </Box>
      </Paper>

      {loading && categories.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow
                    key={category.id}
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          category.type === "dietary"
                            ? "Dietary Option"
                            : "Cuisine"
                        }
                        size="small"
                        sx={{
                          backgroundColor:
                            category.type === "dietary" ? "#e3f2fd" : "#fff8e1",
                          color:
                            category.type === "dietary" ? "#1565c0" : "#ff8f00",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={category.active ? <CheckIcon /> : <CloseIcon />}
                        label={category.active ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          backgroundColor: category.active
                            ? "#e8f5e9"
                            : "#ffebee",
                          color: category.active ? "#2e7d32" : "#c62828",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(true, category)}
                          sx={{ backgroundColor: "#e3f2fd" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCategory(category.id)}
                          sx={{ backgroundColor: "#ffebee" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color={category.active ? "error" : "success"}
                          onClick={() =>
                            handleToggleActive(category.id, category.active)
                          }
                          sx={{
                            backgroundColor: category.active
                              ? "#ffebee"
                              : "#e8f5e9",
                          }}
                        >
                          {category.active ? (
                            <CloseIcon fontSize="small" />
                          ) : (
                            <CheckIcon fontSize="small" />
                          )}
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
      )}

      {/* Category Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: "1px solid #e0e0e0", pb: 2 }}>
          {editMode ? "Edit Category" : "Add New Category"}
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
              value={currentCategory.name}
              onChange={handleInputChange}
              autoFocus
              required
              variant="outlined"
            />

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="body1">Category Type:</Typography>
              <Chip
                label="Dietary Option"
                onClick={() =>
                  setCurrentCategory({ ...currentCategory, type: "dietary" })
                }
                color={
                  currentCategory.type === "dietary" ? "primary" : "default"
                }
                clickable
              />
              <Chip
                label="Cuisine"
                onClick={() =>
                  setCurrentCategory({ ...currentCategory, type: "cuisine" })
                }
                color={
                  currentCategory.type === "cuisine" ? "primary" : "default"
                }
                clickable
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={currentCategory.active}
                  onChange={handleInputChange}
                  name="active"
                  color="success"
                />
              }
              label={`Category is ${
                currentCategory.active ? "active" : "inactive"
              }`}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}>
          <Button onClick={handleCloseDialog} color="inherit" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            color="primary"
            disabled={!currentCategory.name.trim()}
          >
            {editMode ? "Update" : "Add"} Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageCategories;
