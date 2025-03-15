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
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Image as ImageIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  CloudUpload as CloudUploadIcon,
  Visibility as VisibilityIcon,
  Delete as RemoveImageIcon,
} from "@mui/icons-material";
import PageHeader from "../../components/Admin/PageHeader";

// Mock data - replace with actual API calls
const mockRecipes = [
  {
    id: 1,
    title: "Vegetarian Pasta Primavera",
    category: "Italian",
    dietary: ["Vegetarian"],
    imageUrl: null,
    hasImage: false,
    createdAt: "2025-02-15T14:30:00Z",
  },
  {
    id: 2,
    title: "Vegan Tofu Stir Fry",
    category: "Asian",
    dietary: ["Vegan", "Gluten-Free"],
    imageUrl: "/sample-recipe-2.jpg",
    hasImage: true,
    createdAt: "2025-02-20T10:15:00Z",
  },
  {
    id: 3,
    title: "Keto Bacon Avocado Burger",
    category: "American",
    dietary: ["Keto", "Low-Carb"],
    imageUrl: "/sample-recipe-3.jpg",
    hasImage: true,
    createdAt: "2025-03-01T16:45:00Z",
  },
  {
    id: 4,
    title: "Mediterranean Chickpea Salad",
    category: "Mediterranean",
    dietary: ["Vegetarian", "High-Protein"],
    imageUrl: null,
    hasImage: false,
    createdAt: "2025-03-05T09:20:00Z",
  },
  {
    id: 5,
    title: "Spicy Chicken Tacos",
    category: "Mexican",
    dietary: [],
    imageUrl: "/sample-recipe-5.jpg",
    hasImage: true,
    createdAt: "2025-03-10T12:30:00Z",
  },
];

const RecipeImageManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [imageFilter, setImageFilter] = useState("all");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  const fileInputRef = React.useRef(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecipes(mockRecipes);
      setLoading(false);
    }, 800);
  }, []);

  // Get unique categories for filter dropdown
  const categories = [
    "all",
    ...new Set(mockRecipes.map((recipe) => recipe.category)),
  ];

  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setAnchorEl(null);
  };

  const handleOpenImageDialog = (recipe) => {
    setCurrentRecipe(recipe);
    setPreviewUrl(recipe.imageUrl || "");
    setSelectedFile(null);
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setPreviewUrl("");
    setSelectedFile(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = () => {
    if (!selectedFile && !currentRecipe.hasImage) {
      setSnackbar({
        open: true,
        message: "Please select an image to upload",
        severity: "error",
      });
      return;
    }

    setUploadLoading(true);

    // Simulate API call to upload the image
    setTimeout(() => {
      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === currentRecipe.id
          ? {
              ...recipe,
              imageUrl: selectedFile
                ? URL.createObjectURL(selectedFile)
                : recipe.imageUrl,
              hasImage: true,
            }
          : recipe
      );

      setRecipes(updatedRecipes);
      setSnackbar({
        open: true,
        message: "Image uploaded successfully",
        severity: "success",
      });
      setUploadLoading(false);
      handleCloseImageDialog();
    }, 1500);
  };

  const handleRemoveImage = () => {
    if (!currentRecipe.hasImage) {
      return;
    }

    setUploadLoading(true);

    // Simulate API call to remove the image
    setTimeout(() => {
      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === currentRecipe.id
          ? { ...recipe, imageUrl: null, hasImage: false }
          : recipe
      );

      setRecipes(updatedRecipes);
      setSnackbar({
        open: true,
        message: "Image removed successfully",
        severity: "success",
      });
      setUploadLoading(false);
      handleCloseImageDialog();
    }, 800);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter recipes based on search term, category, and image status
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || recipe.category === categoryFilter;
    const matchesImageFilter =
      imageFilter === "all" ||
      (imageFilter === "with-image" && recipe.hasImage) ||
      (imageFilter === "without-image" && !recipe.hasImage);

    return matchesSearch && matchesCategory && matchesImageFilter;
  });

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "a-z":
        return a.title.localeCompare(b.title);
      case "z-a":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Recipe Management"
        subtitle="Manage recipe properties"
      />

      <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={handleOpenSortMenu}
              size="small"
              sx={{ minWidth: 120 }}
            >
              Sort By
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseSortMenu}
            >
              <MenuItem
                onClick={() => handleSortChange("newest")}
                selected={sortOption === "newest"}
              >
                Newest First
              </MenuItem>
              <MenuItem
                onClick={() => handleSortChange("oldest")}
                selected={sortOption === "oldest"}
              >
                Oldest First
              </MenuItem>
              <MenuItem
                onClick={() => handleSortChange("a-z")}
                selected={sortOption === "a-z"}
              >
                A-Z
              </MenuItem>
              <MenuItem
                onClick={() => handleSortChange("z-a")}
                selected={sortOption === "z-a"}
              >
                Z-A
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {sortedRecipes.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 2, boxShadow: 3 }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Recipe</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Cuisine</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Dietary</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedRecipes.map((recipe) => (
                    <TableRow
                      key={recipe.id}
                      sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          {recipe.hasImage ? (
                            <Avatar
                              src={recipe.imageUrl}
                              variant="rounded"
                              sx={{ width: 50, height: 50 }}
                            />
                          ) : (
                            <Avatar
                              variant="rounded"
                              sx={{ width: 50, height: 50, bgcolor: "#eeeeee" }}
                            >
                              <ImageIcon sx={{ color: "#bdbdbd" }} />
                            </Avatar>
                          )}
                          <Typography variant="body1">
                            {recipe.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={recipe.category}
                          size="small"
                          sx={{
                            backgroundColor: "#e3f2fd",
                            color: "#1565c0",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                        >
                          {recipe.dietary.length > 0 ? (
                            recipe.dietary.map((diet, index) => (
                              <Chip
                                key={index}
                                label={diet}
                                size="small"
                                sx={{
                                  backgroundColor: "#fff8e1",
                                  color: "#ff8f00",
                                  fontSize: "0.7rem",
                                }}
                              />
                            ))
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              No dietary restrictions
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={recipe.hasImage ? <CheckIcon /> : <ImageIcon />}
                          label={recipe.hasImage ? "Image Added" : "No Image"}
                          size="small"
                          sx={{
                            backgroundColor: recipe.hasImage
                              ? "#e8f5e9"
                              : "#ffebee",
                            color: recipe.hasImage ? "#2e7d32" : "#c62828",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip
                            title={
                              recipe.hasImage ? "Update Image" : "Add Image"
                            }
                          >
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenImageDialog(recipe)}
                              sx={{ backgroundColor: "#e3f2fd" }}
                            >
                              <CloudUploadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {recipe.hasImage && (
                            <Tooltip title="View Image">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() =>
                                  window.open(recipe.imageUrl, "_blank")
                                }
                                sx={{ backgroundColor: "#e8f5e9" }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
              <ImageIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No recipes found matching your filters
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Try adjusting your search criteria or filters
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setImageFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </Paper>
          )}
        </>
      )}

      {/* Image Upload Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: "1px solid #e0e0e0", pb: 2 }}>
          {currentRecipe?.hasImage ? "Update Recipe Image" : "Add Recipe Image"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {currentRecipe?.title}
            </Typography>
            <Chip
              label={currentRecipe?.category}
              size="small"
              sx={{ mb: 2, backgroundColor: "#e3f2fd", color: "#1565c0" }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              my: 2,
            }}
          >
            {previewUrl ? (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 350,
                  height: 200,
                  backgroundImage: `url(${previewUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 350,
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <ImageIcon sx={{ fontSize: 80, color: "#bdbdbd" }} />
              </Box>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleClickUpload}
                sx={{ backgroundColor: "#1976d2" }}
              >
                Select Image
              </Button>

              {currentRecipe?.hasImage && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<RemoveImageIcon />}
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}>
          <Button
            onClick={handleCloseImageDialog}
            color="inherit"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImageUpload}
            variant="contained"
            color="success"
            disabled={
              uploadLoading || (!selectedFile && !currentRecipe?.hasImage)
            }
          >
            {uploadLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              "Save Image"
            )}
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

export default RecipeImageManagement;
