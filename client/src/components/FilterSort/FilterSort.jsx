import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  Chip,
  TextField,
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
import { useSelector } from "react-redux";
import {
  cuisinesSelector,
  dietaryOptionsSelector,
} from "../../redux/selectors/selectors";

const FilterSort = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("personalized");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState(
    []
  );
  const [cookingTimeOperator, setCookingTimeOperator] = useState("≤");
  const [cookingTimeValue, setCookingTimeValue] = useState(30);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cuisineOptions = useSelector(cuisinesSelector);
  const dietaryOptions = useSelector(dietaryOptionsSelector);

  const tagOptions = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snack",
    "Appetizer",
    "Soup",
    "Curry",
    "Seafood",
    "Salad",
  ];

  const timeOperators = [
    { value: "<", label: "Less than" },
    { value: "=", label: "Equal to" },
    { value: "≤", label: "Less than or equal to" },
    { value: ">", label: "Greater than" },
    { value: "≥", label: "Greater than or equal to" },
  ];

  const handleClearFilters = () => {
    setSelectedCuisines([]);
    setSelectedTags([]);
    setSelectedDietaryPreferences([]);
    setCookingTimeOperator("≤");
    setCookingTimeValue(30);
  };

  const totalActiveFilters =
    selectedCuisines.length +
    selectedTags.length +
    selectedDietaryPreferences.length +
    (cookingTimeValue !== 30 || cookingTimeOperator !== "≤" ? 1 : 0);

  return (
    <Box sx={{ marginTop: "12rem" }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          transition: "all 0.3s ease",
        }}
      >
        {/* Top row with sort options and filter toggle */}
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ mb: filtersOpen ? 2 : 0 }}
        >
          {isMobile ? (
            // Mobile layout: Sort on left, Filter on right
            <>
              <Grid item xs={6}>
                <FormControl size="small" fullWidth variant="outlined">
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    label="Sort by"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="most popular">Most Popular</MenuItem>
                    <MenuItem value="most viewed">Most Viewed</MenuItem>
                    <MenuItem value="most recent">Most Recent</MenuItem>
                    <MenuItem value="personalized">Personalized</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
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
                  Filters {totalActiveFilters > 0 && `(${totalActiveFilters})`}
                </Button>
              </Grid>
            </>
          ) : (
            // Desktop/tablet layout: Both sort and filter on right
            <>
              <Grid item xs={12} sm={5} md={6}></Grid>
              <Grid item xs={12} sm={7} md={6}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <FormControl
                    size="small"
                    sx={{ minWidth: 180 }}
                    variant="outlined"
                  >
                    <InputLabel>Sort by</InputLabel>
                    <Select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      label="Sort by"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="most popular">Most Popular</MenuItem>
                      <MenuItem value="most viewed">Most Viewed</MenuItem>
                      <MenuItem value="most recent">Most Recent</MenuItem>
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

        {totalActiveFilters > 0 && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              size="small"
              color="secondary"
              onClick={handleClearFilters}
              sx={{ borderRadius: 4 }}
            >
              Clear All Filters
            </Button>
          </Box>
        )}

        {/* Expandable filter section */}
        <Collapse in={filtersOpen}>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            {/* Cuisine Type */}
            <Grid item xs={12} md={6} lg={3}>
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <RestaurantMenu fontSize="small" color="primary" />
                  <Typography variant="subtitle2">Cuisine Types</Typography>
                </Stack>

                <FormControl fullWidth size="small">
                  <InputLabel id="cuisine-select-label">
                    Select Cuisines
                  </InputLabel>
                  <Select
                    labelId="cuisine-select-label"
                    multiple
                    value={selectedCuisines}
                    onChange={(e) => setSelectedCuisines(e.target.value)}
                    input={<OutlinedInput label="Select Cuisines" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    sx={{ borderRadius: 2 }}
                  >
                    {cuisineOptions.map((cuisine) => (
                      <MenuItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>

            {/* Cooking Time */}
            <Grid item xs={12} md={6} lg={3}>
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccessTime fontSize="small" color="primary" />
                  <Typography variant="subtitle2">
                    Cooking Time (minutes)
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={cookingTimeOperator}
                      onChange={(e) => setCookingTimeOperator(e.target.value)}
                      label="Operator"
                      sx={{ borderRadius: 2 }}
                    >
                      {timeOperators.map((op) => (
                        <MenuItem key={op.value} value={op.value}>
                          {op.label} ({op.value})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    type="number"
                    size="small"
                    label="Minutes"
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

            {/* Tags */}
            <Grid item xs={12} md={6} lg={3}>
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocalOffer fontSize="small" color="primary" />
                  <Typography variant="subtitle2">Tags</Typography>
                </Stack>

                <FormControl fullWidth size="small">
                  <InputLabel id="tags-select-label">Select Tags</InputLabel>
                  <Select
                    labelId="tags-select-label"
                    multiple
                    value={selectedTags}
                    onChange={(e) => setSelectedTags(e.target.value)}
                    input={<OutlinedInput label="Select Tags" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
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
            <Grid item xs={12} md={6} lg={3}>
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SetMeal fontSize="small" color="primary" />
                  <Typography variant="subtitle2">
                    Dietary Preferences
                  </Typography>
                </Stack>

                <FormControl fullWidth size="small">
                  <InputLabel id="dietary-select-label">
                    Select Preferences
                  </InputLabel>
                  <Select
                    labelId="dietary-select-label"
                    multiple
                    value={selectedDietaryPreferences}
                    onChange={(e) =>
                      setSelectedDietaryPreferences(e.target.value)
                    }
                    input={<OutlinedInput label="Select Preferences" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    sx={{ borderRadius: 2 }}
                  >
                    {dietaryOptions.map((diet) => (
                      <MenuItem key={diet} value={diet}>
                        {diet}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 4 }}
            >
              Apply Filters
            </Button>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default FilterSort;
