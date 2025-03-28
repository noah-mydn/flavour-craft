import {
  Box,
  Button,
  Card,
  Chip,
  Link,
  ListItemButton,
  TextField,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import theme from "../theme/theme";

export const Section = styled(Box)(({ theme }) => ({
  height: "auto",
  minHeight: "100vh",
  background: theme.palette.background.default,
  backgroundImage: "linear-gradient(to right, #feffea 0%, #e7e3de 100%)",
  padding: "1rem ",
}));

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

export const HomeContainer = styled(Box)(({ theme }) => ({
  padding: "1rem 2rem",
  background: theme.palette.background.default,
  minHeight: "100vh",
  marginTop: "2.5rem",
}));

export const PreferenceContainer = styled(Box)(({ theme, isMobile }) => ({
  marginTop: isMobile ? "8.9rem " : "7rem",
}));

export const PreferenceOptionsContainer = styled(Box)(({ theme }) => ({
  margin: "0 auto",
  padding: "1rem 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "1.7rem",
  width: "70%",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    gap: "1rem",
  },
}));

export const BannerArea = styled("img")(({ theme }) => ({
  width: "100%",
  objectFit: "cover",
}));

export const SelectableChip = styled(Chip)(({ theme }) => ({
  cursor: "pointer",
}));

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

export const NavigationLink = styled(Link)({
  color: theme.palette.secondary.dark,
  display: "block",
  paddingBottom: "15px",
  textTransform: "uppercase",
  textDecoration: "none",
  position: "relative",
  fontSize: "1rem",
  cursor: "pointer",
  "&:hover": {
    color: theme.palette.primary.light,
  },
  "&::before": { transition: "all 0.5s" },
  "&::after": {
    position: "absolute",
    width: 0,
    content: "''",
    background: theme.palette.primary.light,
    color: "transparent",
    height: "2px",
    right: 0,
    bottom: 0,
    left: 0,
    transition: "all 0.5s",
  },
  "&:hover::after": {
    width: "100%",
  },
});

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const PostCard = styled(Card)(({ theme }) => ({
  margin: "2rem 0",
  padding: "1rem 1rem 0 1rem",
  borderRadius: 10,
  background: "#FFFFF7",
  width: "100%",
}));

export const PreviewPostCard = styled(Card)(({ theme }) => ({
  padding: "1rem 1rem 0 1rem",
  //background: "#FFF8DC",
  // background: theme.palette.success.dark,
  borderRadius: 10,
  width: "100%",
  boxShadow:
    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
  cursor: "pointer",
  transition: "all 0.5s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
  },
}));

export const Wrapper = styled(Box)({
  paddingTop: "5rem",
  margin: "1rem 2rem 0 2rem",
  [theme.breakpoints.down("md")]: {
    margin: "0 .5rem",
    paddingTop: "6rem",
  },
  [theme.breakpoints.down("sm")]: {
    margin: "0 .25rem",
    paddingTop: "7.5rem",
  },
});

export const ContentContainer = styled(Box)({
  width: "100%",

  [theme.breakpoints.down("md")]: {
    width: "90%",
    margin: "0 auto",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
});

export const ForumImage = styled(Box)({
  width: "48%",
  border: "1px solid #eee",
  px: 1,
  boxShadow: "0 0 4px -3px #333",
  [theme.breakpoints.down("sm")]: {
    width: "90%",
  },
});

export const AnimatedChip = styled(Chip)(({ theme }) => ({
  borderRadius: 20,
  height: 28,
  padding: "0 6px",
  fontWeight: 500,
  transition: "all 0.2s ease",
  background: alpha(theme.palette.success.main, 0.08),
  color: theme.palette.success.main,
  "&:hover": {
    background: alpha(theme.palette.success.main, 0.1),
    transform: "translateY(-2px)",
  },
}));

export const ActionButton = styled(Box)(({ theme, active }) => ({
  display: "flex",
  alignItems: "center",
  padding: "4px 6px",
  borderRadius: 20,
  cursor: "pointer",
  transition: "all 0.2s ease",

  background: active ? alpha(theme.palette.primary.main, 0.1) : "transparent",
  "&:hover": {
    background: alpha(theme.palette.primary.main, active ? 0.15 : 0.05),
  },
}));

export const GradientCard = styled(Card)(({ theme }) => ({
  marginBottom: "1rem",
  borderRadius: 16,
  background: theme.palette.common.white,
  position: "relative",
  transition: "all 0.3s ease",
  overflow: "visible",
  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  border: "1px solid",
  borderColor: alpha(theme.palette.primary.main, 0.08),
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
}));

export const DetailCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: "white",
  position: "relative",
  transition: "all 0.3s ease",
  overflow: "visible",
  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  border: "1px solid",
  borderColor: alpha(theme.palette.primary.main, 0.08),
  padding: "1rem",
}));
