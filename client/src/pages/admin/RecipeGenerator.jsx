// src/pages/RecipeGenerator.js
import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Slider,
  Button,
  TextField,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  Container,
  InputBase,
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PageHeader from "../../components/Admin/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchCuisines } from "../../redux/apiClients/cuisineAPI";
import { fetchDietaryOptions } from "../../redux/apiClients/dietaryAPI";
import {
  cuisinesSelector,
  dietaryOptionsSelector,
} from "../../redux/selectors/selectors";
import theme from "../../theme/theme";

const RecipeGenerator = () => {
  const [cuisines, setCuisines] = useState([]);
  const [dietary, setDietary] = useState([]);
  const dispatch = useDispatch();
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [recipeCount, setRecipeCount] = useState(2);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  React.useEffect(() => {
    dispatch(fetchCuisines());
    dispatch(fetchDietaryOptions());
  }, []);

  const cuisineOptions = useSelector(cuisinesSelector);
  const dietaryOptions = useSelector(dietaryOptionsSelector);

  const handleCuisineChange = (event) => {
    setCuisines(event.target.value);
  };

  const handleDietaryChange = (event) => {
    setDietary(event.target.value);
  };

  const handleTagChange = (event) => {
    setTags(event.target.value);
  };

  const handleGenerate = () => {
    // Simulate recipe generation
    setTimeout(() => {
      setGenerationSuccess(true);
    }, 1500);
  };

  return (
    <Container>
      <PageHeader
        title="Recipe Generator"
        description="Generate batches of AI-powered recipes with specific criteria"
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={7.5}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Generation Parameters
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="cuisine-label">Cuisine Types</InputLabel>
                    <Select
                      labelId="cuisine-label"
                      multiple
                      value={cuisines}
                      onChange={handleCuisineChange}
                      input={<OutlinedInput label="Cuisine Types" />}
                      renderValue={(selected) => (
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
                                color: "#fff",
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {cuisineOptions.map((cuisine) => (
                        <MenuItem key={cuisine._id} value={cuisine.name}>
                          {cuisine.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="dietary-label">
                      Dietary Preferences
                    </InputLabel>
                    <Select
                      labelId="dietary-label"
                      multiple
                      value={dietary}
                      onChange={handleDietaryChange}
                      input={<OutlinedInput label="Dietary Preferences" />}
                      renderValue={(selected) => (
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
                                color: "#fff",
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {dietaryOptions.map((option) => (
                        <MenuItem key={option._id} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      id="tags-input"
                      variant="outlined"
                      placeholder="Type and press Enter to add"
                      fullWidth
                      value={inputTag}
                      onChange={(event) => setInputTag(event.target.value)} // Update input state
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === ",") {
                          event.preventDefault();
                          const newTag = inputTag.trim();
                          if (newTag && !tags.includes(newTag)) {
                            setTags([...tags, newTag]);
                          }
                          setInputTag("");
                        }
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mt: 1,
                      }}
                    >
                      {tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          onDelete={() => {
                            setTags(tags.filter((_, i) => i !== index));
                          }}
                          sx={{
                            border: `1px solid ${theme.palette.primary.light}`,
                            background: alpha(theme.palette.primary.light, 0.4),
                            "& .MuiChip-deleteIcon": {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography id="recipe-count-slider" gutterBottom>
                    Recipe Count: {recipeCount}
                  </Typography>
                  <Slider
                    value={recipeCount}
                    onChange={(e, newValue) => setRecipeCount(newValue)}
                    aria-labelledby="recipe-count-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={2}
                    max={6}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={handleGenerate}
                >
                  Generate Recipes
                </Button>
              </Box>

              {generationSuccess && (
                <Alert
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ mt: 3 }}
                >
                  Successfully generated {recipeCount} recipes based on your
                  parameters!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Divider orientation="vertical" flexItem sx={{ height: "100%" }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Generation Tips
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" paragraph>
                For best results, select at least one cuisine type and 2-3 tags.
              </Typography>

              <Typography variant="body2" paragraph>
                Multiple dietary preferences will generate recipes that meet all
                selected criteria.
              </Typography>

              <Typography variant="body2" paragraph>
                Each generation creates unique recipes that are automatically
                saved for later editing.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeGenerator;
