import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getCurrentUserProfile,
  updateUserProfile,
} from "../redux/apiClients/userAPI";
import { convertBlobsToFiles } from "../utils/blobToFile";
import { displayErrorToast, displaySuccessToast } from "../utils/toastUtil";
import { getAuthConfig } from "../utils/authHeaders";
import axios from "axios";

const useProfile = (user) => {
  const dispatch = useDispatch();

  // Profile State
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userImg: null,
    dietaryRestrictions: [],
    cuisinePreferences: [],
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account state

  const [confirmDeleteError, setConfirmDeleteError] = useState("");
  const [email, setEmail] = useState("");

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        userImg: user.userImg || null,
        dietaryRestrictions: user.dietaryRestrictions || [],
        cuisinePreferences: user.cuisinePreferences || [],
      });
      setProfileImage(user.userImg || null);
    }
  }, [user]);

  // Handle text field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let imgUrl = URL.createObjectURL(file);
      setProfileImage(imgUrl); //preview
      setImageFile(file);
    }
  };
  const handleAutocompleteChange = (name, value) => {
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  // Submit Profile Update
  const handleSubmit = async (onSuccess) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("firstName", profileData.firstName);
    formData.append("lastName", profileData.lastName);
    formData.append("email", profileData.email);

    console.log("Image File:", imageFile);

    if (imageFile) {
      formData.append("userImg", imageFile);
    } else {
      console.log("Image file is not here!");
    }

    const cuisines = profileData.cuisinePreferences.map((item) => item._id);
    const dietary = profileData.dietaryRestrictions.map((item) => item._id);

    dietary.forEach((id) => {
      formData.append("dietaryRestrictions", id);
    });

    cuisines.forEach((id) => {
      formData.append("cuisinePreferences", id);
    });

    try {
      // For debugging - check what's in your FormData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      await dispatch(updateUserProfile(formData));
      await dispatch(getCurrentUserProfile());
      onSuccess();
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePassword = async (onSuccess) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API}/user/update-password`,
        {
          oldPassword: passwordData?.currentPassword,
          newPassword: passwordData?.newPassword,
        },
        getAuthConfig()
      );
      console.log(response.data);
      if (response.data) {
        onSuccess();
        displaySuccessToast(response.data.message);
      }
    } catch (error) {
      console.log(error);
      displayErrorToast(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };
  const deleteAccount = async (onSuccess) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API}/user/delete`,
        {
          email: email,
        },
        getAuthConfig()
      );
      console.log(response.data);
      if (response?.data?.status === 200) {
        onSuccess();
        displaySuccessToast(response?.data?.message);
      }
    } catch (error) {
      console.error("Delete account failed:", error);
      displayErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    passwordData,
    profileData,
    profileImage,
    confirmDeleteError,
    setConfirmDeleteError,
    loading,
    handleInputChange,
    handleImageChange,
    handleAutocompleteChange,
    handleSubmit,
    handleChangePassword,
    handlePasswordChange,
    deleteAccount,
    setEmail,
  };
};

export default useProfile;
