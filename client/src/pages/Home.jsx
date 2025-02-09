import { Box } from "@mui/material";
import React from "react";
import { LogoArea, HomeContainer } from "../styles/ContainerStyles";
import Preferences from "../components/Preferences/Preferences";
import { usePreferences } from "../hooks/usePreferences";
import { Main } from "../components/Main/Main";
import { useSelector } from "react-redux";
import {
  cuisineSelectors,
  dietaryRestrictionsSelectors,
} from "../redux/selectors/selectors";
import TopNavigationBar from "../components/Navigations/TopNavigationBar";

const Home = ({ isMobile }) => {
  const { preferenceSelectionSteps } = usePreferences();
  const dietaryRestrictions = useSelector(dietaryRestrictionsSelectors);
  const cuisinePreferences = useSelector(cuisineSelectors);
  const { skipStep, skipToMain, step, nextStep, previousStep } =
    preferenceSelectionSteps;

  React.useEffect(() => {
    console.log("Cusines:", cuisinePreferences);
    console.log("Dietary Restrictions:", dietaryRestrictions);
  }, []);
  return (
    <>
      {step < 2 &&
        (cuisinePreferences?.length <= 0 || !dietaryRestrictions?.length <= 0)(
          <Preferences
            isMobile={isMobile}
            preferenceSelectionSteps={preferenceSelectionSteps}
          />
        )}
      {step == 2 && (
        <>
          <TopNavigationBar isMobile={isMobile} />
          <Main isMobile={isMobile} />
        </>
      )}
    </>
  );
};

export default Home;
