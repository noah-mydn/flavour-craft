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
  alpha,
  Container,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PageHeader from "../../components/Admin/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchCuisines } from "../../redux/apiClients/cuisineAPI";
import { fetchDietaryOptions } from "../../redux/apiClients/dietaryAPI";

import theme from "../../theme/theme";
import {
  cuisinesSelector,
  dietaryOptionsSelector,
} from "../../redux/selectors/selectors";
import { useCategory } from "../../hooks/admin/useCategory";
import { useRecipeManagement } from "../../hooks/admin/useRecipeManagement";
import { DetailCard, GradientCard } from "../../styles/ContainerStyles";

const RecipeGenerator = () => {
  const [cuisines, setCuisines] = useState([]);
  const [dietary, setDietary] = useState([]);
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [recipeCount, setRecipeCount] = useState(2);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  const [errors, setErrors] = useState({
    cuisines: false,
    dietary: false,
    tags: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { cuisineManagement, dietaryManagement } = useCategory();
  const { fetchAllCuisines } = cuisineManagement;
  const { fetchAllDietaryOptions } = dietaryManagement;
  const { batchRecipeGeneration, recipeGeneratedMsg, generatedLoading } =
    useRecipeManagement();

  React.useEffect(() => {
    fetchAllCuisines();
    fetchAllDietaryOptions();
  }, []);

  const cuisineOptions = useSelector(cuisinesSelector);
  const dietaryOptions = useSelector(dietaryOptionsSelector);

  // Validate the form
  const validateForm = () => {
    const newErrors = {
      cuisines: cuisines.length === 0,
      //dietary: dietary.length === 0,
      tags: tags.length === 0,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleCuisineChange = (event) => {
    const value = event.target.value;
    setCuisines(value);
    if (formSubmitted) {
      setErrors({ ...errors, cuisines: value.length === 0 });
    }
  };

  const handleDietaryChange = (event) => {
    const value = event.target.value;
    setDietary(value);
  };

  const handleAddTag = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      if (formSubmitted) {
        setErrors({ ...errors, tags: updatedTags.length === 0 });
      }
    }
  };

  const successGeneration = () => {
    setTags([]);
    setDietary([]);
    setCuisines([]);
    setGenerationSuccess(true);
  };

  const handleGenerate = () => {
    setFormSubmitted(true);
    setGenerationSuccess(false);

    if (validateForm()) {
      setTimeout(() => {
        batchRecipeGeneration(
          tags,
          cuisines,
          dietary,
          recipeCount,
          successGeneration
        );
      }, 1500);
    }
  };

  return (
    <Container>
      <PageHeader
        title="Recipe Generator"
        description="Generate batches of AI-powered recipes with specific criteria"
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={7.5}>
          <DetailCard>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Generation Parameters
              </Typography>
              <Divider sx={{ my: 2 }} />

              {formSubmitted && Object.values(errors).includes(true) && (
                <Alert
                  severity="error"
                  icon={<ErrorIcon fontSize="inherit" />}
                  sx={{ mb: 2 }}
                >
                  Please fill in all required fields before generating recipes.
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={errors.cuisines} required>
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
                    {errors.cuisines && (
                      <FormHelperText>
                        Please select at least one cuisine
                      </FormHelperText>
                    )}
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
                    {/* {errors.dietary && (
                      <FormHelperText>
                        Please select at least one dietary preference
                      </FormHelperText>
                    )} */}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth error={errors.tags} required>
                    <TextField
                      id="tags-input"
                      variant="outlined"
                      placeholder="Tags (Breakfast, Brunch, Quick, Easy)..."
                      fullWidth
                      value={inputTag}
                      onChange={(event) => setInputTag(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === ",") {
                          event.preventDefault();
                          const newTag = inputTag.trim();
                          handleAddTag(newTag);
                          setInputTag("");
                        }
                      }}
                      error={errors.tags}
                    />
                    {errors.tags && (
                      <FormHelperText>
                        Please add at least one tag
                      </FormHelperText>
                    )}

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
                            const updatedTags = tags.filter(
                              (_, i) => i !== index
                            );
                            setTags(updatedTags);
                            if (formSubmitted) {
                              setErrors({
                                ...errors,
                                tags: updatedTags.length === 0,
                              });
                            }
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
                    max={5}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={generatedLoading}
                  endIcon={
                    generatedLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <SendIcon />
                    )
                  }
                  onClick={handleGenerate}
                >
                  {generatedLoading ? "Generating..." : "Generate Recipe"}
                </Button>
              </Box>

              {generationSuccess && (
                <Alert
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ mt: 3 }}
                >
                  {recipeGeneratedMsg}
                  <a
                    href="/admin/recipes"
                    style={{
                      color: theme.palette.success.light,
                      textDecoration: "underline",
                    }}
                  >
                    View here!
                  </a>
                </Alert>
              )}
            </CardContent>
          </DetailCard>
        </Grid>
        <Grid item>
          <Divider orientation="vertical" flexItem sx={{ height: "100%" }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DetailCard>
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
          </DetailCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeGenerator;
