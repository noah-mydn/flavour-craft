import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { isVerifiedSelector } from "../../redux/selectors/selectors";

const PublicRoute = ({ children }) => {
  const isVerified = useSelector(isVerifiedSelector);
  const location = useLocation();

  if (isVerified && location.pathname === "/auth") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
