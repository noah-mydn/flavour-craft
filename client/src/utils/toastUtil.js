import toast from "react-hot-toast";

export const displayErrorToast = (error) => {
  console.log(error);
  let errorMsg = error.message;
  console.log(error);
  if (error?.response?.data) {
    errorMsg = error.response.data.message;
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
  toast.success(message, {
    icon: "📝",
  });
};
