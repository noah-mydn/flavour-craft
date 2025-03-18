import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ca3341",
      light: "#ee7170",
      dark: "#970a1a",
    },
    secondary: {
      main: "#9bbd4c",
      light: "#c8f06b",
      dark: "#5fa158",
    },
    background: {
      default: "#fffff5",
      //default: "#FFF",
      paper: "#fbfbfb",
    },
    text: {
      primary: "#3C3A36",
      secondary: "#6D6875",
    },
    error: {
      main: "#FF6F61",
    },
    warning: {
      main: "#F4A261",
    },
    success: {
      main: "#2A9D8F",
    },
    info: {
      main: "#457B9D",
    },
    common: {
      black: "#222",
      white: "#fff",
    },
  },
  typography: {
    fontFamily: ["Quicksand", "Lexend Deca", "sans-serif"],
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      color: "#3C3A36",
      fontFamily: "Quicksand",
    },
    h2: {
      fontSize: "2.4rem",
      fontWeight: 700,
      color: "#3C3A36",
      fontFamily: "Quicksand",
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#3C3A36",
      fontFamily: "Quicksand",
    },
    button: {
      textTransform: "none",
    },
    input: {
      fontFamily: "Quicksand",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1920,
    },
  },
});

export default theme;
