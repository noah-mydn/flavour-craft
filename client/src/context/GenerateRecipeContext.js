import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { displayErrorToast } from "../utils/toastUtil";
import { getAuthConfig } from "../utils/authHeaders";

export const GenerateRecipeContext = createContext();

export function GenerateRecipeProvider({ children }) {
  const [ingredientDb, setIngredientDb] = useState([]);
  const [ingredientLoading, setIngredientLoading] = useState(false);
  const [recipeInput, setRecipeInput] = useState({
    ingredients: [],
    dietaryPreferences: [],
    cuisines: [],
  });
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState([]);
  const [errorGeneration, setErrorGeneration] = useState(null);
  const [customIngredient, setCustomIngredient] = useState("");

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
    setRecipeInput((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, customIngredient.toLowerCase().trim()],
    }));
  };

  const handleChangeRecipeInput = (field) => (event) => {
    setRecipeInput((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleGenerateRecipe = async () => {
    console.log("Current Recipe Input:", recipeInput);
    setGenerateLoading(true);
    let payload = {
      ingredients: recipeInput?.ingredients,
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

  useEffect(() => {
    fetchIngredients();
  }, []);

  useEffect(() => {
    console.log("Updated Generated Recipe:", generatedRecipe);
  }, [generatedRecipe]);

  const contextValue = React.useMemo(
    () => ({
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
    }),
    [
      recipeInput,
      customIngredient,
      ingredientDb,
      generateLoading,
      errorGeneration,
      generatedRecipe,
    ]
  );

  return (
    <GenerateRecipeContext.Provider value={contextValue}>
      {children}
    </GenerateRecipeContext.Provider>
  );
}
