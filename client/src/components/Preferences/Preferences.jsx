import React from "react";
import {
  PreferenceContainer,
  PreferenceOptionsContainer,
  BannerArea,
  SelectableChip,
} from "../../styles/ContainerStyles";
import { Box, Button, Container, Typography } from "@mui/material";
import { usePreferences } from "../../hooks/usePreferences";
import { AnimatePresence, motion } from "framer-motion";
import { fadeVariant } from "../../utils/animationUtils";

const Preferences = ({ isMobile, preferenceSelectionSteps }) => {
  const {
    cuisines,
    healthConditions,
    allergies,
    lifeStyles,
    handleCuisineSelections,
    handleDietarySelections,
    selectCuisineSelections,
    selectDietaryRestrictions,
  } = usePreferences();

  const { skipStep, skipToMain, step, nextStep, previousStep } =
    preferenceSelectionSteps;

  return (
    <PreferenceContainer>
      <Box display="flex" justifyContent="center">
        <BannerArea
          src={isMobile ? "./banner-s.png" : "banner-new.png"}
          alt="banner"
        />
      </Box>
      <Container sx={{ mb: 2 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          color="primary"
          fontWeight="bold"
          textAlign="center"
          my={4}
        >
          {step === 0
            ? "Choose your dietary preferences..."
            : "Choose your cuisine preferences..."}
        </Typography>
        <AnimatePresence mode="wait">
          {step === 0 && (
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
          {step === 1 && (
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

        {/* Button controls */}
        <Box
          display="flex"
          justifyContent={step === 0 ? "flex-end" : "space-between"}
          mt={4}
          width="100%"
        >
          {/* Previous Button - Only visible at step 1 */}
          {step === 1 && (
            <Button
              onClick={previousStep}
              variant="contained"
              color="warning"
              sx={{ cursor: "pointer", textTransform: "uppercase" }}
            >
              Previous
            </Button>
          )}

          {/* Skip Button at Step 0 (Dietary Restrictions) */}
          {step === 0 && selectDietaryRestrictions.size < 1 && (
            <Button
              onClick={skipStep}
              variant="text"
              color="primary"
              sx={{ cursor: "pointer", textTransform: "uppercase" }}
            >
              Skip
            </Button>
          )}

          {/* Next/Skip Button at Step 0 (Dietary Restrictions - If preferences are selected) */}
          {step === 0 && selectDietaryRestrictions.size > 0 && (
            <Button
              onClick={nextStep}
              variant="contained"
              color="warning"
              sx={{ cursor: "pointer", textTransform: "uppercase" }}
            >
              Next
            </Button>
          )}

          {/* Skip Button at Step 1 (Cuisine Preferences) */}
          {step === 1 && selectCuisineSelections.size < 1 && (
            <Button
              onClick={skipToMain}
              variant="text"
              color="primary"
              sx={{ cursor: "pointer", textTransform: "uppercase" }}
            >
              Skip
            </Button>
          )}

          {/* Next Button at Step 1 (Cuisine Preferences - If preferences are selected) */}
          {step === 1 && selectCuisineSelections.size > 0 && (
            <Button
              onClick={nextStep}
              variant="contained"
              color="warning"
              sx={{ cursor: "pointer", textTransform: "uppercase" }}
            >
              Next
            </Button>
          )}
        </Box>
      </Container>
    </PreferenceContainer>
  );
};

export default Preferences;
