import React from "react";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ForumIcon from "@mui/icons-material/Forum";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import theme from "../../theme/theme";

const BottomNavigationBar = () => {
  const [navTab, setNavTab] = React.useState(0);
  return (
    <BottomNavigation
      sx={{
        width: "100%",
        position: "absolute",
        bottom: 0,
        background: theme.palette.secondary.light,
      }}
      showLabels
      value={navTab}
      onChange={(event, newValue) => {
        setNavTab(newValue);
      }}
    >
      <BottomNavigationAction label="Main" icon={<HomeIcon />} />
      <BottomNavigationAction label="Recipes" icon={<RamenDiningIcon />} />{" "}
      <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Social" icon={<ForumIcon />} />
    </BottomNavigation>
  );
};

export default BottomNavigationBar;
