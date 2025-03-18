export const getAuthConfig = (isFormData = false) => {
  let token = sessionStorage.getItem("accessToken");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return { headers };
};
