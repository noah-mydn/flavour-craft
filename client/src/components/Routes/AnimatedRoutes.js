import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "../../pages/Home";
import NotFound from "../../pages/NotFound";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Auth from "../../pages/Auth";
import GetStarted from "../../pages/GetStarted";
import { BottomNavigation, useMediaQuery } from "@mui/material";
import TopNavigationBar from "../Navigations/TopNavigationBar";
import Recipes from "../../pages/Recipes";
import Community from "../../pages/Community";
import TermsAndConditions from "../../pages/TermsAndConditions";
import RecipeDetail from "../../pages/recipes/RecipeDetailCard";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserProfile } from "../../redux/apiClients/userAPI";
import {
  isVerifiedSelector,
  tokenSelector,
  userSelector,
} from "../../redux/selectors/selectors";
import { verifySession } from "../../utils/verifySession";
import GenerateRecipe from "../../pages/recipes/GenerateRecipe";
import { GenerateRecipeProvider } from "../../context/GenerateRecipeContext";
import UserProfile from "../../pages/UserProfile";
import AdminLayout from "../../layout/AdminLayout";
import Dashboard from "../../pages/admin/Dashboard";
import RecipeGenerator from "../../pages/admin/RecipeGenerator";
import ReportedContent from "../../pages/admin/ReportedContent";
import ManageCategories from "../../pages/admin/ManageCategories";
import CampaignManager from "../../pages/admin/CampaignManager";
import RecipeImageManagement from "../../pages/admin/RecipeManagement";
import RecipesByCuisines from "../../pages/recipes/RecipeByCuisines";
import { displayErrorToast, displaySuccessToast } from "../../utils/toastUtil";
import Post from "../Community/Post";
import { Main } from "../Main/Main";
import SavedRecipes from "../../pages/recipes/SavedRecipes";
import GeneratedRecipes from "../../pages/recipes/GeneratedRecipes";

const AnimatedRoutes = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 900px)");
  const user = useSelector(userSelector);
  const isVerified = useSelector(isVerifiedSelector);
  const accessToken = useSelector(tokenSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (user && isVerified) {
      dispatch(getCurrentUserProfile());
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (accessToken) {
      verifySession(accessToken);
    }
  }, [accessToken]);

  //Google Auth
  React.useEffect(() => {
    // Only process if we have search parameters
    if (location.search) {
      console.log("IT RUNS");
      const handleOAuthCallback = async () => {
        try {
          // Get tokens from URL parameters
          const params = new URLSearchParams(location.search);
          const accessToken = params.get("accessToken");
          const refreshToken = params.get("refreshToken");
          const userId = params.get("userId");
          const error = params.get("error");

          // Check for errors
          if (error) {
            displayErrorToast({ message: `Authentication failed: ${error}` });
            navigate("/auth");
            return;
          }

          // Validate tokens exist
          if (!accessToken || !refreshToken || !userId) {
            displayErrorToast({ message: "Missing authentication data" });
            navigate("/auth");
            return;
          }

          // Fetch user data with the token
          const response = await fetch(
            `${process.env.REACT_APP_BASE_API}/user/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await response.json();

          // Store tokens and user data
          sessionStorage.setItem("accessToken", accessToken);
          sessionStorage.setItem("userData", JSON.stringify(userData.user));
          localStorage.setItem("refreshToken", refreshToken);

          // Update Redux state
          dispatch({
            type: "auth/loginSuccess",
            payload: {
              user: userData.user,
              accessToken,
              refreshToken,
            },
          });

          displaySuccessToast("Successfully logged in with Google");

          // Redirect to home page
          navigate("/home");
        } catch (error) {
          console.error("OAuth callback error:", error);
          displayErrorToast({ message: "Authentication process failed" });
          navigate("/auth");
        }
      };

      handleOAuthCallback();
    }
  }, [dispatch, location, navigate]);

  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/"
        element={
          <PublicRoute>
            <GetStarted isMobile={isMobile} isTablet={isTablet} />
          </PublicRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth isMobile={isMobile} isTablet={isTablet} />
          </PublicRoute>
        }
      />
      <Route
        path="/terms"
        element={
          <PublicRoute>
            <TermsAndConditions isMobile={isMobile} isTablet={isTablet} />
          </PublicRoute>
        }
      />

      {/* Private Routes */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Main />
          </PrivateRoute>
        }
      />

      <Route path="/recipes" element={<PrivateRoute />}>
        <Route index element={<Recipes />} />
        <Route path=":recipeId" element={<RecipeDetail />} />
        <Route path="cuisines/:cuisineType" element={<RecipesByCuisines />} />
        <Route path="me/saved" element={<SavedRecipes />} />
        <Route path="me/generated" element={<GeneratedRecipes />} />
      </Route>

      <Route path="/forum" element={<PrivateRoute />}>
        <Route index element={<Community isMobile={isMobile} />} />
        <Route path=":postId" element={<Post />} />
      </Route>

      {/* <Route
        path="/recipes/:recipeId"
        element={
          <PrivateRoute>
            <RecipeDetail isMobile={isMobile} />
          </PrivateRoute>
        }
      /> */}

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />

      <Route
        path="/generate"
        element={
          <PrivateRoute>
            <GenerateRecipeProvider>
              <GenerateRecipe />
            </GenerateRecipeProvider>
          </PrivateRoute>
        }
      />

      <Route
        path="/recipes/cuisine/:cuisineType"
        element={
          <PrivateRoute>
            <RecipesByCuisines />
          </PrivateRoute>
        }
      />

      {/* Admin-Only Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="recipes" element={<RecipeImageManagement />} />
        <Route path="generator" element={<RecipeGenerator />} />
        <Route path="reported" element={<ReportedContent />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="campaigns" element={<CampaignManager />} />
      </Route>

      <Route path="/not-found" element={<NotFound />} />
    </Routes>
  );
};

export default AnimatedRoutes;
