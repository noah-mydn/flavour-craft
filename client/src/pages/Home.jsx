import React from "react";
import PropTypes from "prop-types";
import Preferences from "../components/Preferences/Preferences";
import { useSelector } from "react-redux";
// import { usePreferenceContext } from "../context/PreferenceContext";
import {
  cuisinePrefSelector,
  dietaryRestrictionsSelectors,
} from "../redux/selectors/selectors";
import TopNavigationBar from "../components/Navigations/TopNavigationBar";
import { Main } from "../components/Main/Main";
import { Box } from "@mui/material";

const Home = () => {
  // const { step } = usePreferenceContext();
  const dietaryRestrictions = useSelector(dietaryRestrictionsSelectors);
  const cuisinePreferences = useSelector(cuisinePrefSelector);

  // React.useEffect(() => {
  //   console.log("CURRENT STEP:", step);
  // }, [step]);

  return (
    <>
      <TopNavigationBar />
      <Main />
    </>
  );
};

export default Home;
