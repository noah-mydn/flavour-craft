import React from "react";
import { FormTextField } from "../../styles/ContainerStyles";
import {
  Box,
  Button,
  Divider,
  Typography,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Checkbox,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import theme from "../../theme/theme";
import { useAuth } from "../../hooks/useAuth";

const RegisterForm = (props) => {
  const {
    showPassword,
    setToggleAuthForm,
    togglePasswordVisibility,
    isMobile,
  } = props;

  const { accountUser, handleInputChange, accountRegister } = useAuth();
  return (
    <form onSubmit={accountRegister} style={{ padding: "1rem 0" }}>
      <Typography variant={isMobile ? "h3" : "h1"} className="text-center">
        Create an account
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "2rem",
        }}
      >
        <Box display="flex" gap="1rem">
          <FormTextField
            required
            fullWidth
            variant="outlined"
            label="First Name"
            size="small"
            name="firstName"
            value={accountUser.firstName}
            onChange={handleInputChange}
          />
          <FormTextField
            required
            fullWidth
            variant="outlined"
            label="Last Name"
            size="small"
            name="lastName"
            value={accountUser.lastName}
            onChange={handleInputChange}
          />
        </Box>
        <FormTextField
          required
          fullWidth
          variant="outlined"
          label="Email"
          size="small"
          margin="normal"
          name="email"
          type="email"
          onChange={handleInputChange}
          value={accountUser?.email}
          sx={{ marginTop: "1rem" }}
        />
        <FormTextField
          required
          fullWidth
          variant="outlined"
          label="Password"
          name="password"
          onChange={handleInputChange}
          value={accountUser?.password}
          size="small"
          sx={{ marginTop: ".5rem" }}
          type={showPassword ? "text" : "password"}
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

        {/* Terms and Conditions */}
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              name="termsAndConditions"
              checked={accountUser?.termsAndConditions}
              onChange={handleInputChange}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.primary }}
            >
              I agree to the{" "}
              <a
                href="/terms"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                }}
              >
                Terms & Conditions *
              </a>
            </Typography>
          }
          sx={{ marginBottom: "1rem" }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            padding: "0.5rem",
            fontWeight: "bold",
            borderRadius: "25px",
            marginBottom: "1rem",

            fontFamily: theme.typography.fontFamily[1],
          }}
        >
          Create Account
        </Button>
        <Typography variant="body2" color="text.primary">
          Already have an account?{" "}
          <span
            style={{
              color: "#2470b3",
              cursor: "pointer",
            }}
            onClick={() => {
              setToggleAuthForm(true);
            }}
          >
            Login here!
          </span>{" "}
        </Typography>
        <Divider sx={{ margin: "1rem 0" }}>or register with</Divider>

        <Button
          fullWidth
          variant="outlined"
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
    </form>
  );
};

export default RegisterForm;
