import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  isVerifiedSelector,
  userSelector,
} from "../../redux/selectors/selectors";
import TopNavigationBar from "../Navigations/TopNavigationBar";

const PrivateRoute = ({ adminOnly = false, children }) => {
  const isVerified = useSelector(isVerifiedSelector);
  const user = useSelector(userSelector);

  if (!isVerified) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  if (!adminOnly && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <TopNavigationBar />
      {children || <Outlet />}
    </>
  );
};

export default PrivateRoute;
