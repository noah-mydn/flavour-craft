import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../../pages/Home";
import NotFound from "../../pages/NotFound";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Auth from "../../pages/Auth";
import GetStarted from "../../pages/GetStarted";
import { useSessionVerifier } from "../../hooks/useSessionVerifier";

const AnimatedRoutes = () => {
  useSessionVerifier();
  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/"
        element={
          <PublicRoute>
            <GetStarted />
          </PublicRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />

      {/* Private Routes */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      {/* Fallback for undefined routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AnimatedRoutes;
