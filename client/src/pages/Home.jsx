import React from "react";
import PropTypes from "prop-types";
import Preferences from "../components/Preferences/Preferences";
import { useSelector } from "react-redux";
import { usePreferenceContext } from "../context/PreferenceContext";
import {
  cuisineSelectors,
  dietaryRestrictionsSelectors,
} from "../redux/selectors/selectors";
import TopNavigationBar from "../components/Navigations/TopNavigationBar";
import { Main } from "../components/Main/Main";

const Home = () => {
  const { step } = usePreferenceContext();
  const dietaryRestrictions = useSelector(dietaryRestrictionsSelectors);
  const cuisinePreferences = useSelector(cuisineSelectors);

  React.useEffect(() => {
    console.log("CURRENT STEP:", step);
  }, [step]);

  return (
    <>
      {/* {step < 2 &&
        (cuisinePreferences?.length === 0 ||
          dietaryRestrictions?.length === 0) && <Preferences />} */}

      {/* {step === 2 && ( */}
      <>
        <TopNavigationBar />
        <Main />
      </>
      {/* )} */}
    </>
  );
};

export default Home;
