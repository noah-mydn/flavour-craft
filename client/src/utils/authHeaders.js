export const getAuthConfig = () => {
  let token = sessionStorage.getItem("accessToken");

  return {
    headers: {
      // ✅ Wrap headers inside a "headers" object
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};
