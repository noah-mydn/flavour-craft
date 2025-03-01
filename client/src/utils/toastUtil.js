import toast from "react-hot-toast";

export const displayErrorToast = (error) => {
  let errorMsg = "";
  if (error?.response?.data) {
    errorMsg = error.response.data || error.message;
  }
  toast.error(errorMsg, {
    icon: "😞",
  });
};

export const displaySuccessToast = (message) => {
  toast.success(message, {
    icon: "🎉",
  });
};

export const displayInfoToast = (message) => {
  toast.info(message, {
    icon: "📝",
  });
};
