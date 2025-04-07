import React from "react";
import { useNavigate } from "react-router-dom";
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
import { AnimatePresence, motion } from "framer-motion";
import { fadeVariant } from "../../utils/animationUtils";
import theme from "../../theme/theme";
import { useSelector, useDispatch } from "react-redux";
import {
  cuisinesSelector,
  dietaryOptionsSelector,
} from "../../redux/selectors/selectors";

import { CookingAnimation } from "../Animation/CookingAnimation";
import {
  setCuisinePreferences,
  setDietaryPreferences,
} from "../../redux/apiClients/userAPI";
import { useCategory } from "../../hooks/admin/useCategory";

const Preferences = () => {
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  // Use Sets to store only IDs
  const [tempDietarySelections, setTempDietarySelections] = React.useState(
    new Set()
  );
  const [tempCuisineSelections, setTempCuisineSelections] = React.useState(
    new Set()
  );

  const [hasSelectedPreferences, setHasSelectedPreferences] =
    React.useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const cuisines = useSelector(cuisinesSelector);
  const dietaryOptions = useSelector(dietaryOptionsSelector);

  const { dietaryManagement, cuisineManagement } = useCategory();
  const { fetchAllDietaryOptions } = dietaryManagement;
  const { fetchAllCuisines } = cuisineManagement;

  // Modify handler to work directly with IDs
  const handleTempDietarySelections = (option) => {
    const optionId = typeof option === "string" ? option : option._id;
    setTempDietarySelections((prev) => {
      const newSelections = new Set(prev);
      newSelections.has(optionId)
        ? newSelections.delete(optionId)
        : newSelections.add(optionId);
      return newSelections;
    });
  };

  // Modify handler to work directly with IDs
  const handleTempCuisineSelections = (cuisine) => {
    const cuisineId = typeof cuisine === "string" ? cuisine : cuisine._id;
    setTempCuisineSelections((prev) => {
      const newSelections = new Set(prev);
      newSelections.has(cuisineId)
        ? newSelections.delete(cuisineId)
        : newSelections.add(cuisineId);
      return newSelections;
    });
  };

  const nextStep = () => {
    if (step === 0) {
      setStep(1);
    } else {
      finishSetup();
    }
  };

  const previousStep = () => {
    setStep(0);
  };

  const skipStep = () => {
    if (step === 0) {
      setStep(1);
    } else {
      finishSetup();
    }
  };

  const skipToMain = () => {
    finishSetup();
  };

  const finishSetup = () => {
    // Convert Set to array of IDs
    const dietarySelections = Array.from(tempDietarySelections);
    const cuisineSelections = Array.from(tempCuisineSelections);

    setLoading(true);

    const promises = [];
    if (dietarySelections.length > 0) {
      promises.push(
        dispatch(setDietaryPreferences({ dietaryOptions: dietarySelections }))
      );
    }
    if (cuisineSelections.length > 0) {
      promises.push(
        dispatch(setCuisinePreferences({ cuisineTypes: cuisineSelections }))
      );
    }

    Promise.all(promises).finally(() => {
      setTimeout(() => {
        setLoading(false);

        navigate("/home");
      }, 3000);
    });
  };

  React.useEffect(() => {
    fetchAllCuisines();
    fetchAllDietaryOptions();
  }, []);

  React.useEffect(() => {
    if (tempDietarySelections.size > 0 || tempCuisineSelections.size > 0) {
      setHasSelectedPreferences(true);
    }
  }, [tempDietarySelections, tempCuisineSelections]);

  if (loading && hasSelectedPreferences) {
    return <CookingAnimation />;
  }
  return (
    <PreferenceContainer isMobile={isMobile}>
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
                {dietaryOptions?.map((opt) => {
                  const isSelected = tempDietarySelections.has(opt._id);
                  return (
                    <SelectableChip
                      key={opt._id}
                      label={opt.name}
                      sx={{ fontSize: "1rem" }}
                      color={isSelected ? "primary" : "error"}
                      variant={isSelected ? "filled" : "outlined"}
                      onClick={() => handleTempDietarySelections(opt)}
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
                  const isSelected = tempCuisineSelections.has(cuisine._id);
                  return (
                    <SelectableChip
                      key={cuisine._id}
                      label={cuisine.name}
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
              sx={{
                cursor: "pointer",
                textTransform: "uppercase",
                background: theme.palette.grey[600],
              }}
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
              onClick={nextStep}
              variant="contained"
              sx={{
                cursor: "pointer",
                textTransform: "uppercase",
                background: theme.palette.secondary.dark,
              }}
            >
              Next
            </Button>
          )}

          {step === 1 && tempCuisineSelections.size < 1 && (
            <Button
              onClick={skipToMain}
              variant="text"
              sx={{
                cursor: "pointer",
                textTransform: "uppercase",
                color: theme.palette.secondary.dark,
                textDecoration: "underline",
              }}
            >
              Skip
            </Button>
          )}

          {step === 1 && tempCuisineSelections.size > 0 && (
            <Button
              onClick={finishSetup}
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
