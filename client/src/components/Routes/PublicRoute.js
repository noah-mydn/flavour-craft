import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isVerifiedSelector } from "../../redux/selectors/selectors";

const PublicRoute = ({ children }) => {
  const isVerified = useSelector(isVerifiedSelector);

  return isVerified ? <Navigate to="/home" replace /> : children;
};

export default PublicRoute;
