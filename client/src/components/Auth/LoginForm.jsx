import React from "react";
import { FormTextField } from "../../styles/ContainerStyles";
import {
  Box,
  Button,
  Divider,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import theme from "../../theme/theme";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = (props) => {
  const { showPassword, setToggleAuthForm, togglePasswordVisibility } = props;

  const { accountUser, handleInputChange, accountLogin, handleGoogleLogin } =
    useAuth();

  return (
    <Box paddingTop={2}>
      <Typography variant="h1" className="text-center">
        Login to an account
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "2rem",
          padding: "1rem 2rem",
        }}
      >
        <FormTextField
          fullWidth
          name="email"
          variant="outlined"
          label="Email"
          size="small"
          margin="normal"
          sx={{ marginTop: "1rem" }}
          value={accountUser.email}
          onChange={handleInputChange}
        />
        <FormTextField
          name="password"
          fullWidth
          variant="outlined"
          label="Password"
          size="small"
          sx={{ marginTop: ".5rem" }}
          type={showPassword ? "text" : "password"}
          value={accountUser.password}
          onChange={handleInputChange}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                fontFamily: "Lexend Deca",
              },
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={accountLogin}
          sx={{
            padding: "0.5rem",
            fontWeight: "bold",
            borderRadius: "25px",
            marginBottom: "1rem",
            marginTop: "1.5rem",
            fontFamily: theme.typography.fontFamily[1],
          }}
        >
          Login
        </Button>
        <Typography variant="body2" color="text.primary">
          Haven't created an account yet?{" "}
          <span
            style={{
              color: "#2470b3",
              cursor: "pointer",
            }}
            onClick={() => {
              setToggleAuthForm(false);
            }}
          >
            Register here!
          </span>{" "}
        </Typography>
        <Divider sx={{ margin: "1rem 0" }}>or login via</Divider>

        <Button
          fullWidth
          variant="outlined"
          onClick={() =>
            (window.location.href = "http://localhost:8080/auth/google")
          }
          startIcon={
            <img src="./google-icon.svg" alt="google-icon" width={18} />
          }
          sx={{
            fontWeight: "bold",
            borderRadius: "25px",
            color: theme.palette.text.primary,
            fontSize: "18px",
            borderWidth: "2px",
            borderColor: theme.palette.info.main,
          }}
        >
          &nbsp;&nbsp;Google
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
