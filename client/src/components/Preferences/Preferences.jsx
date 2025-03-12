import React from "react";
import {
  PreferenceContainer,
  PreferenceOptionsContainer,
  BannerArea,
  SelectableChip,
} from "../../styles/ContainerStyles";
import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useUserPreferences } from "../../hooks/useUserPreferences";
import { usePreferenceContext } from "../../context/PreferenceContext";
import { AnimatePresence, motion } from "framer-motion";
import { fadeVariant } from "../../utils/animationUtils";
import theme from "../../theme/theme";

const Preferences = () => {
  const {
    cuisines,
    allergies,
    healthConditions,
    lifeStyles,
    tempCuisineSelections,
    tempDietarySelections,
    commitSelections,
    selectCuisineSelections,
    selectDietaryRestrictions,
    handleTempCuisineSelections,
    handleTempDietarySelections,
  } = useUserPreferences();

  const { step, nextStep, previousStep, skipStep, skipToMain } =
    usePreferenceContext();

  React.useEffect(() => {
    console.log("Calling from Preferences");
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
                {allergies?.options?.map((allergy) => {
                  const isSelected = tempDietarySelections.has(allergy);
                  return (
                    <SelectableChip
                      key={allergy}
                      label={allergy}
                      sx={{ fontSize: "1rem" }}
                      color={isSelected ? "primary" : "error"}
                      variant={isSelected ? "filled" : "outlined"}
                      onClick={() => handleTempDietarySelections(allergy)}
                    />
                  );
                })}
                {healthConditions?.options?.map((hc) => {
                  const isSelected = tempDietarySelections.has(hc);
                  return (
                    <SelectableChip
                      key={hc}
                      label={hc}
                      sx={{ fontSize: "1rem" }}
                      color={isSelected ? "primary" : "error"}
                      variant={isSelected ? "filled" : "outlined"}
                      onClick={() => handleTempDietarySelections(hc)}
                    />
                  );
                })}
                {lifeStyles?.options?.map((lifeStyle) => {
                  const isSelected = tempDietarySelections.has(lifeStyle);
                  return (
                    <SelectableChip
                      key={lifeStyle}
                      label={lifeStyle}
                      sx={{ fontSize: "1rem" }}
                      color={isSelected ? "primary" : "error"}
                      variant={isSelected ? "filled" : "outlined"}
                      onClick={() => handleTempDietarySelections(lifeStyle)}
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
                {cuisines?.map((cuisine) => {
                  const isSelected = tempCuisineSelections.has(cuisine);
                  return (
                    <SelectableChip
                      key={cuisine}
                      label={cuisine}
                      sx={{ fontSize: "1rem" }}
                      color={isSelected ? "primary" : "error"}
                      variant={isSelected ? "filled" : "outlined"}
                      onClick={() => handleTempCuisineSelections(cuisine)}
                    />
                  );
                })}
              </PreferenceOptionsContainer>
            </motion.div>
          )}
        </AnimatePresence>

        <Box
          display="flex"
          justifyContent={step === 0 ? "flex-end" : "space-between"}
          mt={4}
          width="100%"
        >
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

          {step === 0 && tempDietarySelections.size < 1 && (
            <Button
              onClick={skipStep}
              variant="text"
              color="primary"
              sx={{ cursor: "pointer", textTransform: "uppercase" }}
            >
              Skip
            </Button>
          )}

          {step === 0 && tempDietarySelections.size > 0 && (
            <Button
              onClick={() => {
                commitSelections();
                nextStep();
              }}
              variant="contained"
              color="warning"
              sx={{ cursor: "pointer", textTransform: "uppercase" }}
            >
              Next
            </Button>
          )}

          {step === 1 && tempCuisineSelections.size < 1 && (
            <Button
              onClick={skipToMain}
              variant="text"
              color="primary"
              sx={{ cursor: "pointer", textTransform: "uppercase" }}
            >
              Skip
            </Button>
          )}

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
