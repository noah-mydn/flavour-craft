import { jwtDecode } from "jwt-decode";
import store from "../redux/store/store";
import { logout } from "../redux/reducers/authSlice";

let logoutTimeout;

export const verifySession = (accessToken) => {
  if (!accessToken) {
    handleSessionExpiry();
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      handleSessionExpiry();
      return false;
    }

    scheduleAutoLogout(decoded.exp);
    return true;
  } catch (err) {
    console.error("Invalid token:", err);
    handleSessionExpiry();
    return false;
  }
};

const handleSessionExpiry = () => {
  console.warn("Session expired. Logging out...");
  store.dispatch(logout());
  window.location.href = "/auth";
};

const scheduleAutoLogout = (expiryTime) => {
  const currentTime = Date.now() / 1000;
  const timeUntilExpiry = (expiryTime - currentTime) * 1000;

  if (logoutTimeout) {
    clearTimeout(logoutTimeout);
  }

  if (timeUntilExpiry > 0) {
    logoutTimeout = setTimeout(() => {
      handleSessionExpiry();
    }, timeUntilExpiry);
    console.log(`Auto logout scheduled in ${timeUntilExpiry / 1000} seconds.`);
  }
};
