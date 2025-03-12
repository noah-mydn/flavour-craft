import React, { createContext, useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  cuisinePrefSelector,
  dietaryRestrictionsSelectors,
} from "../redux/selectors/selectors";

const PreferenceContext = createContext();

export const PreferenceProvider = ({ children }) => {
  const cuisineSelections = useSelector(cuisinePrefSelector);
  const dietarySelections = useSelector(dietaryRestrictionsSelectors);

  const [step, setStep] = useState(0);

  useEffect(() => {
    const isPrefNotSelected =
      cuisineSelections.length === 0 || dietarySelections.length === 0;

    console.log("Array Size of dietary,", dietarySelections.length);
    console.log("Array Size of cuisine,", cuisineSelections.length);

    setStep(isPrefNotSelected ? 0 : 2);

    console.log("Cuisines:", cuisineSelections);
    console.log("Dietary:", dietarySelections);
  }, [cuisineSelections, dietarySelections]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const previousStep = () => setStep((prev) => Math.max(prev - 1, 0));
  const skipStep = () => setStep(1);
  const skipToMain = () => setStep(2);

  return (
    <PreferenceContext.Provider
      value={{ step, nextStep, previousStep, skipStep, skipToMain }}
    >
      {children}
    </PreferenceContext.Provider>
  );
};

export const usePreferenceContext = () => useContext(PreferenceContext);
