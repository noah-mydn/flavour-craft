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
  const [cuisines, setCuisines] = React.useState([]);

  // Fetching permanent selections from Redux state
  const dietaryRestrictions = useSelector(dietaryRestrictionsSelectors) || [];
  const cuisineSelections = useSelector(cuisineSelectors) || [];

  // Temporary selections managed locally (before committing to Redux)
  const [tempCuisineSelections, setTempCuisineSelections] = React.useState(
    new Set()
  );

  const [tempDietarySelections, setTempDietarySelections] = React.useState(
    new Set()
  );

  const dispatch = useDispatch();

  // Permanent selections states in Redux (set initial state from Redux)
  const [selectDietaryRestrictions, setSelectDietaryRestrictions] =
    React.useState(new Set(dietaryRestrictions));
  const [selectCuisineSelections, setSelectCuisineSelections] = React.useState(
    new Set(cuisineSelections)
  );
  // Handle toggling of permanent cuisine selection
  const handleCuisineSelections = (selection) => {
    dispatch(updateCuisinePreferences(selection));
  };

  const handleDietarySelections = (selection) => {
    dispatch(updateDietaryRestrictions(selection));
  };

  const handleTempCuisineSelections = (cuisine) => {
    setTempCuisineSelections((prev) => {
      const newSet = new Set(prev);
      newSet.has(cuisine) ? newSet.delete(cuisine) : newSet.add(cuisine);
      return newSet;
    });
  };

  const handleTempDietarySelections = (dietary) => {
    setTempDietarySelections((prev) => {
      const newSet = new Set(prev);
      newSet.has(dietary) ? newSet.delete(dietary) : newSet.add(dietary);
      return newSet;
    });
  };

  const commitSelections = () => {
    handleCuisineSelections([...tempCuisineSelections]);
    handleDietarySelections([...tempDietarySelections]);

    setTempCuisineSelections(new Set());
    setTempDietarySelections(new Set());
  };

  // Fetch cuisine preferences from API
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
        const data = response.data;
        setLifeStyles(data.data[0]);
        setAllergies(data.data[1]);
        setHealthConditions(data.data[2]);
      }
    } catch (error) {
      console.error("Error fetching dietary preferences:", error);
    }
  };

  // Fetch preferences when the component is mounted
  React.useEffect(() => {
    fetchDietaryPreferences();
    fetchCuisinePreferences();
  }, []);

  return {
    fetchDietaryPreferences,
    fetchCuisinePreferences,
    commitSelections,
    tempCuisineSelections,
    tempDietarySelections,
    handleTempCuisineSelections,
    handleTempDietarySelections,
    selectCuisineSelections,
    selectDietaryRestrictions,
    allergies,
    healthConditions,
    cuisines,
    lifeStyles,
  };
};
