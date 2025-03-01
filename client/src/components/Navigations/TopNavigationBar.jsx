import { AppBar, Avatar, Box, Menu, MenuItem, Tooltip } from "@mui/material";

import React from "react";
import { NavigationLink } from "../../styles/ContainerStyles";
import theme from "../../theme/theme";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/selectors";

const TopNavigationBar = ({ isMobile }) => {
  const user = useSelector(userSelector);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    console.log(user);
  }, []);

  const showUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const hideUserMenu = () => {
    setAnchorEl(null);
  };

  const NavTabs = [
    {
      label: "Home",
      link: "/home",
    },
    {
      label: "Recipes",
      link: "/recipes",
    },
    {
      label: "Favourites",
      link: "/favourites",
    },
    {
      label: "Community",
      link: "/forum",
    },
  ];
  return (
    <>
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          zIndex: 99,
          background: "#faf8f5",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Box display="flex" justifyContent="center">
            <img src="./logo.png" alt="Logo" width={130} height={60} />
          </Box>

          {!isMobile && (
            <Box display="flex" gap={2} justifyContent="flex-end">
              {NavTabs.map((nav) => {
                return (
                  <NavigationLink
                    key={nav.link}
                    mx={2}
                    color="primary"
                    fontWeight="bolder"
                    href={nav.link}
                  >
                    {nav.label}
                  </NavigationLink>
                );
              })}
            </Box>
          )}
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Tooltip title={user?.firstName}>
              <Avatar
                sx={{ bgcolor: theme.palette.primary.light, cursor: "pointer" }}
                src={user?.userImg}
                onClick={showUserMenu}
              ></Avatar>
            </Tooltip>
          </Box>
        </Box>
      </AppBar>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={hideUserMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>My Profile</MenuItem>

        <MenuItem>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default TopNavigationBar;
