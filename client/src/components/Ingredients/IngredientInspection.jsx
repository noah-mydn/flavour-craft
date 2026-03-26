import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Checkbox,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import { useSelector } from "react-redux";
import {
  cuisinesSelector,
  dietaryOptionsSelector,
} from "../../redux/selectors/selectors";
import { GenerateRecipeContext } from "../../context/GenerateRecipeContext";

function IngredientFilterUI({ loading }) {
  const theme = useTheme();

  const {
    recipeInput,
    customIngredient,
    ingredientDb,
    setCustomIngredient,
    addCustomIngredient,
    setRecipeInput,
    handleGenerateRecipe,
  } = useContext(GenerateRecipeContext);

  const dietaryOptions = useSelector(dietaryOptionsSelector);
  const cuisines = useSelector(cuisinesSelector);

  const [searchValue, setSearchValue] = useState("");
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [moreDietaryDialog, setMoreDietaryDialog] = useState(false);
  const [moreCuisineDialog, setMoreCuisineDialog] = useState(false);

  const [tempDietarySelections, setTempDietarySelections] = useState([]);
  const [tempCuisineSelections, setTempCuisineSelections] = useState([]);

  const myCuisines = useSelector(
    (state) => state.userProfile.cuisinePreferences
  );
  const myDietary = useSelector(
    (state) => state.userProfile.dietaryRestrictions
  );

  useEffect(() => {
    if (moreDietaryDialog) {
      setTempDietarySelections([...recipeInput.dietaryPreferences]);
    }
  }, [moreDietaryDialog]);

  useEffect(() => {
    if (moreCuisineDialog) {
      setTempCuisineSelections([...recipeInput.cuisines]);
    }
  }, [moreCuisineDialog]);

  const handleAddIngredient = (event, newValue) => {
    if (!newValue) return;

    if (typeof newValue === "string") {
      setCustomIngredient(newValue);
      setShowAddIngredient(true);
    } else {
      if (!recipeInput.ingredients.includes(newValue.name)) {
        setRecipeInput({
          ...recipeInput,
          ingredients: [...recipeInput.ingredients, newValue.name],
        });
      }
    }
    setSearchValue("");
  };

  const handleRemoveIngredient = (ingredient) => {
    setRecipeInput({
      ...recipeInput,
      ingredients: recipeInput.ingredients.filter(
        (item) => item !== ingredient
      ),
    });
  };

  const handleToggleTempDietaryPref = (pref) => {
    if (tempDietarySelections.some((item) => item._id === pref._id)) {
      setTempDietarySelections(
        tempDietarySelections.filter((item) => item._id !== pref._id)
      );
    } else {
      setTempDietarySelections([...tempDietarySelections, pref]);
    }
  };

  const handleToggleTempCuisine = (cuisine) => {
    if (tempCuisineSelections.some((item) => item._id === cuisine._id)) {
      setTempCuisineSelections(
        tempCuisineSelections.filter((item) => item._id !== cuisine._id)
      );
    } else {
      setTempCuisineSelections([...tempCuisineSelections, cuisine]);
    }
  };

  const saveDietaryPreferences = () => {
    setRecipeInput({
      ...recipeInput,
      dietaryPreferences: [...tempDietarySelections],
    });
    setMoreDietaryDialog(false);
  };

  const saveCuisinePreferences = () => {
    setRecipeInput({
      ...recipeInput,
      cuisines: [...tempCuisineSelections],
    });
    setMoreCuisineDialog(false);
  };

  const cancelDietaryChanges = () => {
    setTempDietarySelections([...recipeInput.dietaryPreferences]);
    setMoreDietaryDialog(false);
  };

  const cancelCuisineChanges = () => {
    setTempCuisineSelections([...recipeInput.cuisines]);
    setMoreCuisineDialog(false);
  };

  const handleRemoveDietaryPref = (pref) => {
    setRecipeInput({
      ...recipeInput,
      dietaryPreferences: recipeInput.dietaryPreferences.filter(
        (item) => item._id !== pref._id
      ),
    });
  };

  // Handle removing a cuisine preference chip
  const handleRemoveCuisine = (cuisine) => {
    setRecipeInput({
      ...recipeInput,
      cuisines: recipeInput.cuisines.filter((item) => item._id !== cuisine._id),
    });
  };

  // Check if a dietary option is in temporary selections
  const isDietarySelected = (option) => {
    return tempDietarySelections.some((item) => item._id === option._id);
  };

  // Check if a cuisine option is in temporary selections
  const isCuisineSelected = (cuisine) => {
    return tempCuisineSelections.some((item) => item._id === cuisine._id);
  };

  React.useEffect(() => {
    if (myCuisines?.length > 0 || myDietary?.length > 0) {
      console.log("my cuisines", myCuisines);
      console.log("my dietary", myDietary);
      setRecipeInput((prev) => ({
        ...prev,
        dietaryPreferences: myDietary || [],
        cuisines: myCuisines || [],
      }));
    }
  }, [myCuisines, myDietary]);

  return (
    <Paper
      elevation={2}
      sx={{
        maxWidth: "100%",
        height: "100%",
        //backgroundColor: theme.palette.background.default,
        p: 2,
        pt: 5,
        borderRadius: 2,
      }}
    >
      {/* Ingredient Search with Autocomplete */}
      <Paper
        elevation={1}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          mb: 2,
          py: 1,
          borderRadius: 28,
          background: "#eee",
        }}
      >
        <InputAdornment position="start" sx={{ pl: 1 }}>
          <SearchIcon color="action" />
        </InputAdornment>
        <Autocomplete
          fullWidth
          freeSolo
          options={ingredientDb || []}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          inputValue={searchValue}
          onInputChange={(event, value) => setSearchValue(value)}
          onChange={handleAddIngredient}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Which ingredients do you have?"
              variant="standard"
              slotProps={{
                input: {
                  ...params.InputProps,
                  disableUnderline: true,
                  sx: {
                    ml: 1,

                    "& .MuiAutocomplete-endAdornment": {
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                    },
                  },
                },
              }}
            />
          )}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          noOptionsText={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                cursor: "pointer",
                padding: "8px 10px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
              onClick={() => {
                if (searchValue.trim()) {
                  setCustomIngredient(searchValue.trim());
                  setShowAddIngredient(true);
                }
              }}
            >
              <AddIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography>Add custom ingredient</Typography>
            </Box>
          }
        />
      </Paper>
      <Typography
        variant="subtitle2"
        color="info.dark"
        ml={2}
        fontStyle={"italic"}
      >
        Press enter to add custom ingredients
      </Typography>
      {/* Selected Ingredient Chips */}
      <Box maxHeight={200} py={2} borderRadius={2} overflow="auto">
        <Typography gutterBottom py={1} variant="body1" color="text.secondary">
          Selected Ingredients:
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            mb: 3,
          }}
        >
          {recipeInput?.ingredients.map((ingredient) => (
            <Chip
              key={ingredient}
              label={ingredient}
              onDelete={() => handleRemoveIngredient(ingredient)}
              sx={{
                "& .MuiChip-deleteIcon": {
                  color: "#fff",
                },
                borderRadius: 4,
                background: theme.palette.secondary.dark,
                color: "#fff",
              }}
            />
          ))}
          {!recipeInput?.ingredients.length && (
            <Typography variant="body2" fontSize={13} color="text.secondary">
              No ingredients selected yet
            </Typography>
          )}
        </Box>
      </Box>
      <Divider />

      {/* Dietary Preferences */}
      <Box sx={{ my: 3 }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: 500, mb: 1 }}
          color="text.secondary"
        >
          Dietary Preference:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {recipeInput.dietaryPreferences.map((pref) => (
            <Chip
              key={pref._id}
              label={pref.name}
              onDelete={() => handleRemoveDietaryPref(pref)}
              sx={{
                "& .MuiChip-deleteIcon": {
                  color: "#fff",
                },
                borderRadius: 4,
                background: theme.palette.secondary.dark,
                color: theme.palette.common.white,
              }}
            />
          ))}
          {/* Add + Chip always shown at the end */}
          <Chip
            icon={<AddIcon />}
            label="Add"
            onClick={() => setMoreDietaryDialog(true)}
            sx={{
              borderRadius: 4,
              background: theme.palette.grey[300],
              color: theme.palette.text.primary,
            }}
          />
        </Box>
      </Box>

      {/* Cuisine Preferences */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: 500, mb: 1 }}
          color="text.secondary"
        >
          Cuisine Preference:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {recipeInput.cuisines.map((cuisine) => (
            <Chip
              key={cuisine._id}
              label={cuisine.name}
              onDelete={() => handleRemoveCuisine(cuisine)}
              sx={{
                "& .MuiChip-deleteIcon": {
                  color: "#fff",
                },
                borderRadius: 4,
                background: theme.palette.secondary.dark,
                color: theme.palette.common.white,
              }}
            />
          ))}
          {/* Add + Chip always shown at the end */}
          <Chip
            icon={<AddIcon />}
            label="Add"
            onClick={() => setMoreCuisineDialog(true)}
            sx={{
              borderRadius: 4,
              background: theme.palette.grey[300],
              color: theme.palette.text.primary,
            }}
          />
        </Box>
      </Box>

      {/* Find Button */}
      <Button
        variant="contained"
        disabled={loading}
        fullWidth
        color="primary"
        onClick={handleGenerateRecipe}
        sx={{
          borderRadius: 28,
          py: 1,
          mt: 3,
          textTransform: "none",
          fontSize: "1rem",
        }}
      >
        Let's Generate
      </Button>

      {/* Add Custom Ingredient Dialog */}
      <Dialog
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          addCustomIngredient();
          setShowAddIngredient(false);
        }}
        open={showAddIngredient}
        onClose={() => setShowAddIngredient(false)}
      >
        <DialogTitle>Add Custom Ingredient</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ingredient Name"
            fullWidth
            variant="outlined"
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddIngredient(false)}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dietary Preferences Dialog */}
      <Dialog
        open={moreDietaryDialog}
        onClose={cancelDietaryChanges}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Dietary Preferences</DialogTitle>
        <DialogContent>
          {dietaryOptions.length === 0 ? (
            <Typography>No dietary options available</Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pt: 1 }}>
              {dietaryOptions.map((option) => (
                <Chip
                  key={option._id}
                  label={option.name}
                  onClick={() => handleToggleTempDietaryPref(option)}
                  icon={
                    isDietarySelected(option) ? (
                      <Checkbox
                        checked={true}
                        size="small"
                        color="primary"
                        sx={{ padding: 0, margin: 0 }}
                      />
                    ) : (
                      <Checkbox
                        checked={false}
                        size="small"
                        sx={{ padding: 0, margin: 0 }}
                      />
                    )
                  }
                  sx={{
                    borderRadius: 4,
                    "& .MuiChip-icon": {
                      marginLeft: "8px",
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDietaryChanges}>Cancel</Button>
          <Button
            onClick={saveDietaryPreferences}
            variant="contained"
            color="primary"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cuisine Preferences Dialog */}
      <Dialog
        open={moreCuisineDialog}
        onClose={cancelCuisineChanges}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Cuisine Preferences</DialogTitle>
        <DialogContent>
          {cuisines.length === 0 ? (
            <Typography>No cuisine options available</Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pt: 1 }}>
              {cuisines.map((cuisine) => (
                <Chip
                  key={cuisine._id}
                  label={cuisine.name}
                  onClick={() => handleToggleTempCuisine(cuisine)}
                  icon={
                    isCuisineSelected(cuisine) ? (
                      <Checkbox
                        checked={true}
                        size="small"
                        color="primary"
                        sx={{ padding: 0, margin: 0 }}
                      />
                    ) : (
                      <Checkbox
                        checked={false}
                        size="small"
                        sx={{ padding: 0, margin: 0 }}
                      />
                    )
                  }
                  sx={{
                    borderRadius: 4,
                    "& .MuiChip-icon": {
                      marginLeft: "8px",
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelCuisineChanges}>Cancel</Button>
          <Button
            onClick={saveCuisinePreferences}
            variant="contained"
            color="primary"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default IngredientFilterUI;
