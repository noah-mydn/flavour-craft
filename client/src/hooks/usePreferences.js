import axios from "axios";
import React from "react";
import { data } from "react-router-dom";

export const usePreferences = () => {
  const [allergies, setAllergies] = React.useState([]);
  const [lifeStyles, setLifeStyles] = React.useState([]);
  const [healthConditions, setHealthConditions] = React.useState([]);
  const [cuisines, setCuisines] = React.useState([]);

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

  return {
    fetchDietaryPreferences,
    fetchCuisinePreferences,
    allergies,
    healthConditions,
    cuisines,
    lifeStyles,
  };
};
