import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isVerifiedSelector } from "../../redux/selectors/selectors";

const PrivateRoute = ({ children }) => {
  const isVerified = useSelector(isVerifiedSelector);

  return isVerified ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
