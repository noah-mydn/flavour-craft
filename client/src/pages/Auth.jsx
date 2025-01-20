import React from "react";
import {
  AuthContainer,
  BannerContainer,
  FormArea,
  LogoArea,
} from "../styles/ContainerStyles";
import { Box } from "@mui/material";
import RegisterForm from "../components/Auth/RegisterForm";
import LoginForm from "../components/Auth/LoginForm";
import { AnimatePresence, motion } from "framer-motion";
import { fadeVariant } from "../utils/animationUtils";

const Auth = ({ isMobile, isTablet }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [toggleAuthForm, setToggleAuthForm] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <Box
      sx={{
        height: "100vh",
        padding: "0 !important",
        margin: "0 !important",
      }}
    >
      <AuthContainer>
        <BannerContainer>
          <Box
            component="img"
            src="./banner.jpg"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </BannerContainer>
        <FormArea>
          <LogoArea>
            <img src="./logo.png" alt="Logo" width={130} height={60} />
          </LogoArea>
          <Box marginTop={3}>
            <AnimatePresence mode="wait">
              {!toggleAuthForm && (
                <motion.div
                  key="register-form"
                  variants={fadeVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <RegisterForm
                    isMobile={isMobile}
                    showPassword={showPassword}
                    togglePasswordVisibility={togglePasswordVisibility}
                    setToggleAuthForm={setToggleAuthForm}
                  />
                </motion.div>
              )}
              {toggleAuthForm && (
                <motion.div
                  key="login-form"
                  variants={fadeVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <LoginForm
                    showPassword={showPassword}
                    togglePasswordVisibility={togglePasswordVisibility}
                    setToggleAuthForm={setToggleAuthForm}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </FormArea>
      </AuthContainer>
    </Box>
  );
};

export default Auth;
