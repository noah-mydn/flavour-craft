import { jwtDecode } from "jwt-decode";

export const verifySession = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.error("Token has expired.");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};
