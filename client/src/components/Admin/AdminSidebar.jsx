import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import FlagIcon from "@mui/icons-material/Flag";
import CategoryIcon from "@mui/icons-material/Category";
import CampaignIcon from "@mui/icons-material/Campaign";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import theme from "../../theme/theme";
import { FoodBank } from "@mui/icons-material";

const SidebarLogo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text.primary,
  "&.active": {
    "& .MuiListItem-root": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
      "& .MuiListItemIcon-root": {
        color: theme.palette.common.white,
      },
    },
  },
}));

const AdminSidebar = ({ open, onToggle }) => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    {
      text: "Recipe Management",
      icon: <FoodBank />,
      path: "/admin/recipes",
    },
    {
      text: "Recipe Generator",
      icon: <AutoFixHighIcon />,
      path: "/admin/generator",
    },
    // { text: "Reported Content", icon: <FlagIcon />, path: "/admin/reported" },
    {
      text: "Manage Categories",
      icon: <CategoryIcon />,
      path: "/admin/categories",
    },
    {
      text: "Campaign Manager",
      icon: <CampaignIcon />,
      path: "/admin/campaigns",
    },
  ];

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMobile ? "75%" : 240,
          boxSizing: "border-box",
          overflow: "hidden",
        },
      }}
    >
      <SidebarLogo>
        <Box
          component="img"
          src="../logo.png"
          alt="FlavourCraft Logo"
          width="130px"
          height="auto"
        />
        <IconButton onClick={onToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </SidebarLogo>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <StyledNavLink
            to={item.path}
            key={item.text}
            end={item.path === "/admin"}
          >
            <ListItem button sx={{ py: 1.5 }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </StyledNavLink>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
