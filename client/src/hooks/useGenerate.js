import axios from "axios";
import { displayErrorToast } from "../utils/toastUtil";
import { getAuthConfig } from "../utils/authHeaders";
import React from "react";

export const useGenerate = () => {
  const [ingredientDb, setIngredientDb] = React.useState([]);
  const [ingredientLoading, setIngredientLoading] = React.useState(false);
  const [recipeInput, setRecipeInput] = React.useState({
    ingredients: [],
    dietaryPreferences: [],
    cuisines: [],
  });
  const [generateLoading, setGenerateLoading] = React.useState(false);
  const [generatedRecipe, setGeneratedRecipe] = React.useState([]);
  const [errorGeneration, setErrorGeneration] = React.useState(null);
  const [customIngredient, setCustomIngredient] = React.useState("");

  const fetchIngredients = async () => {
    setIngredientLoading(true);
    let payload = {
      ingredients: recipeInput?.ingredients,
      dietaryPreferences: recipeInput?.dietaryPreferences,
      cuisines: recipeInput?.cuisines,
    };
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/ingredients`,

        getAuthConfig(),
        payload
      );
      console.log(response.data?.ingredients);
      setIngredientDb(response.data?.ingredients);
    } catch (error) {
      console.error(error);
      displayErrorToast(error);
    } finally {
      setIngredientLoading(false);
    }
  };

  const addCustomIngredient = () => {
    setRecipeInput({
      ...recipeInput,
      ingredients: [
        ...recipeInput.ingredients,
        customIngredient.toLowerCase().trim(),
      ],
    });
  };

  const handleChangeRecipeInput = (e) => {
    return (event) => {
      setRecipeInput((prev) => ({ ...prev, [e]: event.target.value }));
    };
  };

  const handleGenerateRecipe = async () => {
    console.log("Current Recipe Input:", recipeInput);
    setGenerateLoading(true);
    let payload = {
      ingredients: recipeInput?.ingredients,
      //only extract name
      dietaryPreferences: recipeInput?.dietaryPreferences.map(
        (item) => item.name
      ),
      cuisines: recipeInput?.cuisines.map((item) => item.name),
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API}/recipes/generate`,
        payload,
        getAuthConfig()
      );

      console.log(response.data.data);
      setGeneratedRecipe(response.data.data);
    } catch (error) {
      console.error(error);
      setErrorGeneration(error.response.data.message);
      displayErrorToast(error);
    } finally {
      setGenerateLoading(false);
    }
  };

  React.useEffect(() => {
    fetchIngredients();
  }, []);

  React.useEffect(() => {
    console.log("Updated Generated Recipe:", generatedRecipe);
  }, [generatedRecipe]);

  return {
    recipeInput,
    setRecipeInput,
    customIngredient,
    ingredientDb,
    setCustomIngredient,
    addCustomIngredient,
    handleChangeRecipeInput,
    fetchIngredients,
    handleGenerateRecipe,
    generateLoading,
    errorGeneration,
    generatedRecipe,
  };
};
