import React from "react";
import { useSelector } from "react-redux";
import {
  profileSelector,
  cuisinePrefSelector,
  dietaryRestrictionsSelectors,
} from "../redux/selectors/selectors";
import Preferences from "../components/Preferences/Preferences";
import { Main } from "../components/Main/Main";

const Home = () => {
  const profile = useSelector(profileSelector);
  const dietaryPref = useSelector(dietaryRestrictionsSelectors);
  const cuisinePref = useSelector(cuisinePrefSelector);
  return (
    <>
      {profile?.isFirstLoggedIn &&
      dietaryPref?.length === 0 &&
      cuisinePref?.length === 0 ? (
        <Preferences />
      ) : (
        <Main />
      )}
    </>
  );
};

export default Home;
