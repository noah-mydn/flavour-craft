import { useSelector } from "react-redux";
import {
  isVerifiedSelector,
  userSelector,
} from "../../redux/selectors/selectors";
import { Navigate, Outlet } from "react-router-dom";
import TopNavigationBar from "../Navigations/TopNavigationBar";
import Footer from "../Footer/Footer";
import { Box } from "@mui/material";

const PrivateRoute = ({ adminOnly = false, children }) => {
  const isVerified = useSelector(isVerifiedSelector);
  const user = useSelector(userSelector);

  if (!isVerified) {
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
      <Box minHeight={"50vh"}>{children || <Outlet />}</Box>
      {!adminOnly && <Footer />}
    </>
  );
};

export default PrivateRoute;
