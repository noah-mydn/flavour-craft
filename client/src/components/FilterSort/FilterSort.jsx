import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  Chip,
  TextField,
  Tooltip,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  FilterAlt,
  ExpandMore,
  ExpandLess,
  RestaurantMenu,
  AccessTime,
  LocalOffer,
  SetMeal,
} from "@mui/icons-material";
import theme from "../../theme/theme";
import { useDispatch, useSelector } from "react-redux";
import {
  cuisinesSelector,
  dietaryOptionsSelector,
} from "../../redux/selectors/selectors";
import { fetchCuisines } from "../../redux/apiClients/cuisineAPI";
import { fetchDietaryOptions } from "../../redux/apiClients/dietaryAPI";
import {
  fetchFilteredRecipes,
  fetchRecipes,
} from "../../redux/apiClients/recipeAPI";
import { removeFilters, setFilters } from "../../redux/reducers/recipesSlice";
import AutoCompleteSearch from "../AutoCompleteSearch/AutoCompleteSearch";

const FilterSort = ({ page, pageSize }) => {
  const dispatch = useDispatch();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("all");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState(
    []
  );
  const [cookingTimeOperator, setCookingTimeOperator] = useState("");
  const [cookingTimeValue, setCookingTimeValue] = useState();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const cuisineOptions = useSelector(cuisinesSelector);
  const dietaryOptions = useSelector(dietaryOptionsSelector);

  React.useEffect(() => {
    if (!cuisineOptions.length) {
      dispatch(fetchCuisines());
    }
    if (!dietaryOptions.length) {
      dispatch(fetchDietaryOptions());
    }
  }, [dispatch, cuisineOptions, dietaryOptions]);

  const tagOptions = [
    "Breakfast",
    "Brunch",
    "Lunch",
    "Dinner",
    "Dessert",
    "Quick",
    "Snack",
    "Appetizer",
    "Soup",
    "Curry",
    "Seafood",
    "Salad",
    "Stew",
    "Stir-Fry",
    "Gourmet",
    "Comfort Food",
  ];

  const timeOperators = [
    { value: "<", label: "Less than" },
    { value: "=", label: "Equal to" },
    { value: "<=", label: "Less than or equal to" },
    { value: ">", label: "Greater than" },
    { value: ">=", label: "Greater than or equal to" },
  ];

  const handleClearFilters = () => {
    window.location.reload();
  };

  const handleFilterRecipes = () => {
    dispatch(removeFilters());
    setFiltersOpen(false);

    let payload = {};

    if (selectedCuisines && selectedCuisines.length > 0) {
      payload.cuisineTypes = selectedCuisines;
    }
    if (selectedTags && selectedTags.length > 0) {
      payload.tags = selectedTags;
    }
    if (selectedDietaryPreferences && selectedDietaryPreferences.length > 0) {
      payload.dietaryPreferences = selectedDietaryPreferences;
    }
    if (cookingTimeOperator && cookingTimeValue) {
      payload.cookingTime = `${cookingTimeOperator} ${cookingTimeValue}`;
    }

    console.log("Payload:", payload);
    if (Object.keys(payload).length > 0) {
      dispatch(setFilters(payload));
      dispatch(fetchFilteredRecipes({ filters: payload, page, pageSize }));
    }
  };

  const handleSortRecipe = (event) => {
    setSelectedCuisines([]);
    setSelectedTags([]);
    setSelectedDietaryPreferences([]);
    setCookingTimeOperator("");
    setCookingTimeValue();

    //console.log("SORT OPTION:", event.target.value);
    const selectedSort = event.target.value;
    setSortOption(selectedSort);

    //console.log("Sort Option Selected:", selectedSort);

    dispatch(
      fetchRecipes({
        sortValue: selectedSort,
        page,
        pageSize,
      })
    );
  };

  const totalActiveFilters =
    selectedCuisines.length +
    selectedTags.length +
    selectedDietaryPreferences.length +
    (cookingTimeValue === "" || cookingTimeOperator === "" ? 0 : 1);

  return (
    <Box sx={{ mt: 3 }}>
      <Paper
        elevation={0}
        sx={{
          transition: "all 0.3s ease",
          borderRadius: 3,
          overflow: "hidden",
          //   bgcolor: "background.paper",
          bgcolor: "#FAF9F6",
          p: 2,
        }}
      >
        {/* Top row with sort options and filter toggle */}
        <Grid container spacing={2} alignItems="center">
          {isMobile ? (
            // Mobile layout
            <>
              <Grid item xs={12}>
                <AutoCompleteSearch />
              </Grid>
              <Grid item xs={6}>
                <FormControl size="small" fullWidth variant="outlined">
                  <Select
                    value={sortOption}
                    onChange={handleSortRecipe}
                    displayEmpty
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem disabled value="">
                      <Typography variant="body2" color="text.secondary">
                        Sort by
                      </Typography>
                    </MenuItem>
                    <MenuItem value="all">Most Recent</MenuItem>
                    <MenuItem value="popular">Most Popular</MenuItem>
                    <MenuItem value="mostViewed">Most Viewed</MenuItem>
                    <MenuItem value="personalized">Personalized</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Tooltip title="Filter">
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    size="medium"
                    startIcon={<FilterAlt />}
                    endIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    sx={{ borderRadius: 2, height: "40px" }}
                  >
                    Filter {totalActiveFilters > 0 && `(${totalActiveFilters})`}
                  </Button>
                </Tooltip>
              </Grid>
            </>
          ) : (
            // Desktop/tablet layout
            <>
              <Grid item md={6}>
                <AutoCompleteSearch />
              </Grid>
              <Grid item md={6}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <FormControl
                    size="small"
                    sx={{ minWidth: 150 }}
                    variant="outlined"
                  >
                    <Select
                      value={sortOption}
                      onChange={handleSortRecipe}
                      displayEmpty
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem disabled value="">
                        <Typography variant="body2" color="text.secondary">
                          Sort by
                        </Typography>
                      </MenuItem>
                      <MenuItem value="all">Most Recent</MenuItem>
                      <MenuItem value="mostViewed">Most Viewed</MenuItem>
                      <MenuItem value="popular">Most Popular</MenuItem>
                      <MenuItem value="personalized">Personalized</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="outlined"
                    color="primary"
                    size="medium"
                    startIcon={<FilterAlt />}
                    endIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    sx={{ borderRadius: 2, height: "40px" }}
                  >
                    Filters{" "}
                    {totalActiveFilters > 0 && `(${totalActiveFilters})`}
                  </Button>
                </Stack>
              </Grid>
            </>
          )}
        </Grid>

        {/* Expandable filter section */}
        <Collapse in={filtersOpen}>
          <Divider sx={{ opacity: 0.6 }} />

          <Box sx={{ p: 3 }}>
            {totalActiveFilters > 0 && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  size="small"
                  variant="text"
                  color="secondary"
                  onClick={handleClearFilters}
                  sx={{ textTransform: "none" }}
                >
                  Clear All Filters
                </Button>
              </Box>
            )}

            <Grid container spacing={3}>
              {/* Using 2 columns layout (except on mobile) */}
              {/* Cuisine Type */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <RestaurantMenu fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Cuisine Types</Typography>
                  </Stack>

                  <FormControl fullWidth size="small">
                    <Select
                      multiple
                      value={selectedCuisines}
                      onChange={(e) => setSelectedCuisines(e.target.value)}
                      input={<OutlinedInput />}
                      displayEmpty
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return (
                            <Typography variant="body2" color="text.secondary">
                              Select cuisines
                            </Typography>
                          );
                        }
                        return (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                size="small"
                                sx={{
                                  background: theme.palette.secondary.dark,
                                  color: theme.palette.common.white,
                                }}
                              />
                            ))}
                          </Box>
                        );
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      {cuisineOptions.map((cuisine) => (
                        <MenuItem key={cuisine._id} value={cuisine.name}>
                          {cuisine.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              {/* Tags */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalOffer fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Tags</Typography>
                  </Stack>

                  <FormControl fullWidth size="small">
                    <Select
                      multiple
                      value={selectedTags}
                      onChange={(e) => setSelectedTags(e.target.value)}
                      input={<OutlinedInput />}
                      displayEmpty
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return (
                            <Typography variant="body2" color="text.secondary">
                              Select tags
                            </Typography>
                          );
                        }
                        return (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                size="small"
                                sx={{
                                  background: theme.palette.secondary.dark,
                                  color: theme.palette.common.white,
                                }}
                              />
                            ))}
                          </Box>
                        );
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      {tagOptions.map((tag) => (
                        <MenuItem key={tag} value={tag}>
                          {tag}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              {/* Dietary Preferences */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <SetMeal fontSize="small" color="primary" />
                    <Typography variant="subtitle2">
                      Dietary Preferences
                    </Typography>
                  </Stack>

                  <FormControl fullWidth size="small">
                    <Select
                      multiple
                      value={selectedDietaryPreferences}
                      onChange={(e) =>
                        setSelectedDietaryPreferences(e.target.value)
                      }
                      input={<OutlinedInput />}
                      displayEmpty
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return (
                            <Typography variant="body2" color="text.secondary">
                              Select preferences
                            </Typography>
                          );
                        }
                        return (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                size="small"
                                sx={{
                                  background: theme.palette.secondary.dark,
                                  color: theme.palette.common.white,
                                }}
                              />
                            ))}
                          </Box>
                        );
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      {dietaryOptions.map((diet) => (
                        <MenuItem key={diet._id} value={diet.name}>
                          {diet.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              {/* Cooking Time */}
              {/* Cooking Time */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AccessTime fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Cooking Time</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                      <Select
                        value={cookingTimeOperator}
                        onChange={(e) => setCookingTimeOperator(e.target.value)}
                        displayEmpty
                        sx={{ borderRadius: 2 }}
                        renderValue={(selected) => {
                          if (selected === "") {
                            return (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Operator
                              </Typography>
                            );
                          }
                          return selected;
                        }}
                      >
                        {timeOperators.map((op) => (
                          <MenuItem key={op.value} value={op.value}>
                            {op.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      type="number"
                      size="small"
                      placeholder="Minutes"
                      value={cookingTimeValue}
                      onChange={(e) =>
                        setCookingTimeValue(Number(e.target.value))
                      }
                      InputProps={{ inputProps: { min: 5, max: 120 } }}
                      sx={{ borderRadius: 2 }}
                    />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFilterRecipes}
                sx={{ borderRadius: 4, px: 3, textTransform: "none" }}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default FilterSort;
