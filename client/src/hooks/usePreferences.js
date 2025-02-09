import axios from "axios";
import React from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  updateDietaryRestrictions,
  updateCuisinePreferences,
} from "../redux/reducers/userProfileSlice";
import {
  cuisineSelectors,
  dietaryRestrictionsSelectors,
} from "../redux/selectors/selectors";

export const usePreferences = () => {
  const [allergies, setAllergies] = React.useState([]);
  const [lifeStyles, setLifeStyles] = React.useState([]);
  const [healthConditions, setHealthConditions] = React.useState([]);
  const [step, setStep] = React.useState(0);
  const [cuisines, setCuisines] = React.useState([]);

  const dietaryRestrictions = useSelector(dietaryRestrictionsSelectors) || [];
  const cuisineSelections = useSelector(cuisineSelectors) || [];

  const dispatch = useDispatch();

  const [selectDietaryRestrictions, setSelectDietaryRestrictions] =
    React.useState(new Set(dietaryRestrictions));
  const [selectCuisineSelections, setSelectCuisineSelections] = React.useState(
    new Set(cuisineSelections)
  );

  const handleDietarySelections = (selection) => {
    const newSelectedOptions = new Set(selectDietaryRestrictions);
    if (newSelectedOptions.has(selection)) {
      newSelectedOptions.delete(selection);
    } else {
      newSelectedOptions.add(selection);
    }
    setSelectDietaryRestrictions(newSelectedOptions);
    console.log(newSelectedOptions);
    dispatch(updateDietaryRestrictions([...newSelectedOptions]));
  };

  const handleCuisineSelections = (selection) => {
    const newSelectedOptions = new Set(selectCuisineSelections);
    if (newSelectedOptions.has(selection)) {
      newSelectedOptions.delete(selection);
    } else {
      newSelectedOptions.add(selection);
    }
    setSelectCuisineSelections(newSelectedOptions);
    console.log(newSelectedOptions);
    dispatch(updateCuisinePreferences([...newSelectedOptions]));
  };

  React.useEffect(() => {
    fetchDietaryPreferences();
    fetchCuisinePreferences();
  }, []);

  const fetchDietaryPreferences = async () => {
    const configs = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    };
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/preferences/dietary-options`,
        configs
      );
      if (response && response.data) {
        console.log(response.data);

        let data = response.data;

        setLifeStyles(data.data[0]);
        setAllergies(data.data[1]);
        setHealthConditions(data.data[2]);
      }
    } catch (error) {
      console.error("Error fetching dietary preferences:", error);
    }
  };

  const fetchCuisinePreferences = async () => {
    const configs = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    };
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/preferences/cuisines`,
        configs
      );
      if (response && response.data) {
        const data = response.data;
        setCuisines(data.data);
      }
    } catch (error) {
      console.error("Error fetching cuisine preferences:", error);
    }
  };

  const nextStep = () => setStep(step + 1);
  const previousStep = () => setStep(step - 1);
  const skipStep = () => setStep(step + 1);
  const skipToMain = () => setStep(2);

  const preferenceSelectionSteps = {
    step,
    nextStep,
    previousStep,
    skipStep,
    skipToMain,
  };

  return {
    fetchDietaryPreferences,
    fetchCuisinePreferences,
    handleCuisineSelections,
    handleDietarySelections,
    selectCuisineSelections,
    selectDietaryRestrictions,
    preferenceSelectionSteps,
    allergies,
    healthConditions,
    cuisines,
    lifeStyles,
  };
};
