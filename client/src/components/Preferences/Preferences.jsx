import React from "react";
import {
  PreferenceContainer,
  PreferenceOptionsContainer,
  BannerArea,
  SelectableChip,
} from "../../styles/ContainerStyles";
import { Box, Button, Typography } from "@mui/material";
import { usePreferences } from "../../hooks/usePreferences";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  updateCuisinePreferences,
  updateDietaryRestrictions,
} from "../../redux/reducers/userProfileSlice";
import {
  cuisineSelectors,
  dietaryRestrictionsSelectors,
} from "../../redux/selectors/selectors";
import { fadeVariant } from "../../utils/animationUtils";

const Preferences = ({ isMobile }) => {
  const { cuisines, healthConditions, allergies, lifeStyles } =
    usePreferences();

  const dietaryRestrictions = useSelector(dietaryRestrictionsSelectors) || [];
  const cuisineSelections = useSelector(cuisineSelectors) || [];

  const dispatch = useDispatch();

  const [selectDietaryRestrictions, setSelectDietaryRestrictions] =
    React.useState(new Set(dietaryRestrictions));
  const [selectCuisineSelections, setSelectCuisineSelections] = React.useState(
    new Set(cuisineSelections)
  );
  const [show, setShow] = React.useState(0);
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

  const showNext = () => {
    setShow(show + 1);
  };

  const showPrevious = () => {
    setShow(show - 1);
  };

  const showMain = () => {
    setShow(2);
  };

  // React.useEffect(() => {
  //   console.log(allergies);
  //   console.log(healthConditions);
  //   console.log(cuisines);
  //   console.log(lifeStyles);
  // }, [cuisines, allergies, healthConditions, lifeStyles]);

  return (
    <PreferenceContainer>
      <Box display="flex" justifyContent="center">
        <BannerArea
          src={isMobile ? "./banner-s.png" : "banner-new.png"}
          alt="banner"
        />
      </Box>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        color="primary"
        fontWeight="bold"
        textAlign="center"
        mt={4}
      >
        Choose your dietary preferences...
      </Typography>
      <AnimatePresence mode="wait">
        {show === 0 && (
          <motion.div
            key="dietary-selections"
            variants={fadeVariant}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <PreferenceOptionsContainer>
              {/* Allergies */}
              {allergies?.options?.map((allergy) => {
                const isSelected = selectDietaryRestrictions.has(allergy);
                return (
                  <SelectableChip
                    key={allergy}
                    label={allergy}
                    sx={{ fontSize: "1rem" }}
                    color={isSelected ? "primary" : "error"}
                    variant={isSelected ? "filled" : "outlined"}
                    onClick={() => handleDietarySelections(allergy)}
                  />
                );
              })}
              {/* Health-conditions */}
              {healthConditions?.options?.map((healthCondition) => {
                const isSelected =
                  selectDietaryRestrictions.has(healthCondition);
                return (
                  <SelectableChip
                    key={healthCondition}
                    label={healthCondition}
                    sx={{ fontSize: "1rem" }}
                    color={isSelected ? "primary" : "error"}
                    variant={isSelected ? "filled" : "outlined"}
                    onClick={() => handleDietarySelections(healthCondition)}
                  />
                );
              })}
              {/* Life-styles */}
              {lifeStyles?.options?.map((lifeStyle) => {
                const isSelected = selectDietaryRestrictions.has(lifeStyle);
                return (
                  <SelectableChip
                    key={lifeStyle}
                    label={lifeStyle}
                    sx={{ fontSize: "1rem" }}
                    color={isSelected ? "primary" : "error"}
                    variant={isSelected ? "filled" : "outlined"}
                    onClick={() => handleDietarySelections(lifeStyle)}
                  />
                );
              })}
            </PreferenceOptionsContainer>
          </motion.div>
        )}
        {show === 1 && (
          <motion.div
            key="cuisine-selections"
            variants={fadeVariant}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <PreferenceOptionsContainer>
              {/* Cuisines */}
              {cuisines?.map((cuisine) => {
                const isSelected = selectCuisineSelections.has(cuisine);
                return (
                  <SelectableChip
                    key={cuisine}
                    label={cuisine}
                    sx={{ fontSize: "1rem" }}
                    color={isSelected ? "primary" : "error"}
                    variant={isSelected ? "filled" : "outlined"}
                    onClick={() => handleCuisineSelections(cuisine)}
                  />
                );
              })}
            </PreferenceOptionsContainer>
          </motion.div>
        )}
      </AnimatePresence>
      {show === 2 && <span>hehe</span>}
      {selectDietaryRestrictions.size < 1 && show != 2 && (
        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={showMain}
            variant="text"
            pr={6}
            color="primary"
            sx={{
              cursor: "pointer",
              textTransform: "uppercase",
            }}
            fontWeight="bold"
          >
            Skip
          </Button>
        </Box>
      )}
      {selectDietaryRestrictions.size > 0 && show != 2 && (
        <Box display="flex" justifyContent="space-between">
          <Button
            onClick={showPrevious}
            variant="text"
            pr={6}
            color="warning"
            sx={{ cursor: "pointer", textTransform: "uppercase" }}
            fontWeight="bold"
          >
            Previous
          </Button>
          <Button
            onClick={showNext}
            variant="contained"
            pr={6}
            color="secondary"
            sx={{ cursor: "pointer", textTransform: "uppercase" }}
            fontWeight="bold"
          >
            Next
          </Button>
        </Box>
      )}
    </PreferenceContainer>
  );
};

export default Preferences;
