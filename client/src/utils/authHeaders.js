export const getAuthConfig = () => {
  let token = sessionStorage.getItem("accessToken");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  return authHeaders;
};
