import { useSelector } from "react-redux";
import {
  isVerifiedSelector,
  userSelector,
} from "../../redux/selectors/selectors";
import { Navigate, Outlet } from "react-router-dom";
import TopNavigationBar from "../Navigations/TopNavigationBar";

const PrivateRoute = ({ adminOnly = false, children }) => {
  const isVerified = useSelector(isVerifiedSelector);
  const user = useSelector(userSelector);

  // Check for session or token validity here
  if (!isVerified || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role === "admin") {
    if (!adminOnly) {
      return <Navigate to="/admin" replace />;
    }
  } else {
    if (adminOnly) {
      return <Navigate to="/home" replace />;
    }
  }

  return (
    <>
      {!adminOnly && <TopNavigationBar />}
      {children || <Outlet />}
    </>
  );
};

export default PrivateRoute;
