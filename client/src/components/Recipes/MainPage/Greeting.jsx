import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { userSelector } from "../../../redux/selectors/selectors";
import { useSelector } from "react-redux";

export const Greeting = () => {
  const [heading, setHeading] = React.useState("");
  const [bodyText, setBodyText] = React.useState("");
  const hour = new Date().getHours();
  const theme = useTheme();
  const user = useSelector(userSelector);

  const getGreetingText = () => {
    switch (hour) {
      case hour < 11:
        setHeading("Good Morning");
        setBodyText("Ready to discover some tasty recipes?");
        break;
      case hour < 17:
        setHeading("Good Afternoon");
        setBodyText("Looking for delicious lunch meals?");
        break;
      case hour < 21:
        setHeading("Good Evening");
        setBodyText("Let's find a perfect recipe for tonight!");
        break;
      default:
        setHeading("Good Night");
        setBodyText("Looking for quick and easy late night snacks?");
        break;
    }
  };

  React.useEffect(() => {
    getGreetingText();
  }, []);

  return (
    <>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="primary.main"
        gutterBottom
      >
        {heading}, {user?.firstName}
      </Typography>
      <Typography variant="subtitle1" color="#bbb">
        {bodyText}
      </Typography>
    </>
  );
};
