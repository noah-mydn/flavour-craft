import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "../../pages/Home";
import NotFound from "../../pages/NotFound";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Auth from "../../pages/Auth";
import GetStarted from "../../pages/GetStarted";
import { useSessionVerifier } from "../../hooks/useSessionVerifier";
import { BottomNavigation, useMediaQuery } from "@mui/material";
import TopNavigationBar from "../Navigations/TopNavigationBar";
import Recipes from "../../pages/Recipes";
import Community from "../../pages/Community";
import Favourites from "../../pages/Favourites";
import TermsAndConditions from "../../pages/TermsAndConditions";
import { useDispatch } from "react-redux";
import { googleAuth } from "../../redux/apiClients/authAPI";
import { PreferenceProvider } from "../../context/PreferenceContext";

const AnimatedRoutes = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 900px)");

  const navigate = useNavigate();

  // useSessionVerifier();
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/"
        element={
          <PublicRoute>
            <GetStarted isMobile={isMobile} isTablet={isTablet} />
          </PublicRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth isMobile={isMobile} isTablet={isTablet} />
          </PublicRoute>
        }
      />
      <Route
        path="/terms"
        element={
          <PublicRoute>
            <TermsAndConditions isMobile={isMobile} isTablet={isTablet} />
          </PublicRoute>
        }
      />

      {/* Private Routes */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <PreferenceProvider>
              <Home isMobile={isMobile} />
              {isMobile && <BottomNavigation />}
            </PreferenceProvider>
          </PrivateRoute>
        }
      />

      <Route
        path="/recipes"
        element={
          <PrivateRoute>
            <TopNavigationBar isMobile={isMobile} />
            <Recipes isMobile={isMobile} />
            {isMobile && <BottomNavigation />}
          </PrivateRoute>
        }
      />

      <Route
        path="/forum"
        element={
          <PrivateRoute>
            <TopNavigationBar isMobile={isMobile} />
            <Community isMobile={isMobile} />
            {isMobile && <BottomNavigation />}
          </PrivateRoute>
        }
      />

      <Route
        path="/favourites"
        element={
          <PrivateRoute>
            <TopNavigationBar isMobile={isMobile} />
            <Favourites isMobile={isMobile} />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AnimatedRoutes;
