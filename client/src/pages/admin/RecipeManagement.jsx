import React, { useRef } from "react";
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
  InputAdornment,
  TablePagination,
  TableSortLabel,
  Avatar,
  Tooltip,
  alpha,
  DialogContentText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Visibility as VisibilityIcon,
  Delete as RemoveImageIcon,
  Warning,
  FilterAlt as FilterIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import PageHeader from "../../components/Admin/PageHeader";

import { useRecipeManagement } from "../../hooks/admin/useRecipeManagement";
import theme from "../../theme/theme";
import { DetailCard } from "../../styles/ContainerStyles";
import { formatDate, formatTimeAgo } from "../../utils/timeFormatter";

const RecipeManagement = () => {
  const {
    recipes,
    pagination,
    loading,
    page,
    pageSize,
    searchTerm,
    cuisineFilter,
    sortDirection,
    sortField,
    uniqueCuisineTypes,
    deletingRecipeName,
    setSearchTerm,
    closeDeleteDialog,
    deleteDialogOpen,
    openDeleteDialog,
    openImageDialog,
    imagePreview,
    confirmDelete,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleCuisineFilterChange,
    handleSortChange,
    viewRecipeDetail,
    openThumbnailDialog,
    closeThumbnailDialog,
    handleFileSelect,
    updateRecipeThumbnail,
    clearFilters,
  } = useRecipeManagement();

  const fileInputRef = useRef(null);

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ p: isMobile ? 0 : 3, maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Recipe Management"
        subtitle="Manage recipe properties and assets"
      />

      <DetailCard>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => handleSearch("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="cuisine-filter-label">
                Filter by Cuisine
              </InputLabel>
              <Select
                labelId="cuisine-filter-label"
                id="cuisine-filter"
                value={cuisineFilter}
                label="Filter by Cuisine"
                displayEmpty
                onChange={(e) => handleCuisineFilterChange(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="" disabled>
                  All Cuisines
                </MenuItem>
                {uniqueCuisineTypes.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={3}>
            <Box sx={{ display: "flex", gap: 1 }}>
              {(searchTerm ||
                cuisineFilter ||
                sortField !== "createdAt" ||
                sortDirection !== "desc") && (
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  size="medium"
                  sx={{ height: "40px" }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </DetailCard>

      {loading && recipes.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {recipes.length > 0 ? (
            <DetailCard sx={{ mt: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead
                    sx={{ backgroundColor: theme.palette.primary.main }}
                  >
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                        Recipe
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                        Cuisine Type
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                        Dietary Preferences
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                        <TableSortLabel
                          active={sortField === "createdAt"}
                          direction={sortDirection}
                          onClick={() => handleSortChange("createdAt")}
                          sx={{
                            "& .MuiTableSortLabel-icon": {
                              color: "#fff !important",
                            },
                            color: "#fff !important",
                          }}
                        >
                          Generated Date
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recipes.map((recipe) => (
                      <TableRow
                        key={recipe.id || recipe._id}
                        sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            {recipe.thumbnail ? (
                              <Avatar
                                src={recipe.thumbnail}
                                variant="rounded"
                                sx={{ width: 50, height: 50 }}
                              />
                            ) : (
                              <Avatar
                                variant="rounded"
                                sx={{
                                  width: 50,
                                  height: 50,
                                  bgcolor: "#eeeeee",
                                }}
                              >
                                <ImageIcon sx={{ color: "#bdbdbd" }} />
                              </Avatar>
                            )}
                            <Typography variant="subtitle2">
                              {recipe.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {recipe?.cuisineTypes &&
                          recipe?.cuisineTypes.length > 0 ? (
                            <Chip
                              label={recipe?.cuisineTypes[0]}
                              size="small"
                              sx={{
                                backgroundColor: "#e3f2fd",
                                color: "#1565c0",
                                fontSize: 12,
                              }}
                            />
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Unknown
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                          >
                            {recipe.dietaryPreferences &&
                            recipe.dietaryPreferences.length > 0 ? (
                              recipe.dietaryPreferences.map((diet, index) => (
                                <Chip
                                  key={index}
                                  label={diet}
                                  size="small"
                                  sx={{
                                    backgroundColor: "#e8f5e9",
                                    color: "#2e7d32",
                                    fontSize: 12,
                                  }}
                                />
                              ))
                            ) : (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                No dietary preferences
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {formatDate(recipe?.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="View Recipe Details">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => viewRecipeDetail(recipe._id)}
                                sx={{ backgroundColor: "#e3f2fd" }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip
                              title={
                                recipe.thumbnailUrl
                                  ? "Update Thumbnail"
                                  : "Add Thumbnail"
                              }
                            >
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  openThumbnailDialog(
                                    recipe._id,
                                    recipe.thumbnailUrl
                                  )
                                }
                                sx={{ backgroundColor: "#e3f2fd" }}
                              >
                                <CloudUploadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Recipe">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  openDeleteDialog(recipe._id, recipe.name)
                                }
                                sx={{ backgroundColor: "#ffebee" }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
                  component="div"
                  count={pagination?.totalRecipes || 0}
                  rowsPerPage={pageSize}
                  page={page - 1}
                  onPageChange={(e, newPage) =>
                    handlePageChange(e, newPage + 1)
                  }
                  onRowsPerPageChange={handlePageSizeChange}
                />
              </TableContainer>
            </DetailCard>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
              <ImageIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No recipes found matching your filters
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Try adjusting your search criteria or filters
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={clearFilters}>
                Clear Filters
              </Button>
            </Paper>
          )}
        </>
      )}

      {/* Thumbnail Upload Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={closeThumbnailDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: "1px solid #e0e0e0", pb: 2 }}>
          {imagePreview ? "Update Recipe Thumbnail" : "Add Recipe Thumbnail"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              my: 2,
            }}
          >
            {imagePreview ? (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 350,
                  height: 200,
                  backgroundImage: `url(${imagePreview})`,
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
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}>
          <Button onClick={closeThumbnailDialog} color="inherit" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={updateRecipeThumbnail}
            variant="contained"
            color="success"
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              "Save Thumbnail"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Warning color="error" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the recipe{" "}
            <strong>{deletingRecipeName}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={closeDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete Recipe
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeManagement;
