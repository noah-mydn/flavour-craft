import { Box, Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import theme from "../theme/theme";

export const MainContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  padding: "0 1.2rem",
  gap: "1.5rem",

  marginTop: "-3rem",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "start",
  },
}));
export const HeadingsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "2rem 0 2rem 5rem",

  [theme.breakpoints.down("md")]: {
    marginBottom: "6rem",
    padding: "2rem 1rem",
  },
}));

export const WelcomeButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  background: theme.palette.primary.main,
  fontWeight: "bold",
  padding: "10px 20px",
  borderRadius: "2rem",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  fontFamily: theme.typography.fontFamily[0],
  fontSize: "1.25rem",
  "&:hover": {
    background: theme.palette.primary.dark,
    color: theme.palette.background.paper,
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.15)",
    transform: "scale(1.05)",
  },
  "&:active": {
    background: theme.palette.primary.dark,
    boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
  },
}));

export const LogoArea = styled(Box)({
  width: "100%",
  display: "flex",
  marginTop: "1rem",
  justifyContent: "center",
});

export const AuthContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  //   margin: "2.5rem 2rem 1rem 2rem",
  //   background: theme.palette.secondary.dark,
  //   borderRadius: "2rem",

  minHeight: "100vh",
  [theme.breakpoints.down("md")]: {
    display: "block",
    marginTop: "3rem",
  },
}));

export const BannerContainer = styled(Box)({
  width: "40%",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
});

export const FormArea = styled(Box)({
  width: "60%",
  padding: "1rem 8rem",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    padding: "0 2rem",
  },
});

export const FormTextField = styled(TextField)(({ theme }) => ({
  background: "rgba(0,0,0,0.07)",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "transparent",
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "#b78489",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#b78489",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#aeaeae",
    "&.Mui-focused": {
      color: theme.palette.primary.dark,
    },
  },
}));
