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
import Preferences from "../Preferences/Preferences";

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
    console.log("This runs!");
    if (user && isVerified) {
      dispatch(getCurrentUserProfile());
    }
  }, [dispatch, user]);

  React.useEffect(() => {
    if (accessToken) {
      verifySession(accessToken);
    }
  }, [accessToken]);

  //Google Auth
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasOAuthParams =
      params.has("accessToken") ||
      params.has("refreshToken") ||
      params.has("userId");

    if (!hasOAuthParams) return;

    console.log("Running Google OAuth callback...");

    const handleOAuthCallback = async () => {
      try {
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");
        const userId = params.get("userId");
        const error = params.get("error");

        if (error) {
          displayErrorToast({ message: `Authentication failed: ${error}` });
          navigate("/auth");
          return;
        }

        if (!accessToken || !userId) {
          displayErrorToast({ message: "Missing authentication data" });
          navigate("/auth");
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_BASE_API}/user/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();

        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("userData", JSON.stringify(userData.user));
        localStorage.setItem("refreshToken", refreshToken);

        const authUser = {
          id: userData?.user?._id,
          firstName: userData?.user?.firstName,
          lastName: userData?.user?.lastName,
          username: userData?.user?.username,
          role: userData?.user?.role,
          email: userData?.user?.email,
          isFirstLoggedIn: userData?.user?.isFirstLoggedIn,
        };

        dispatch({
          type: "auth/loginSuccess",
          payload: { user: authUser, accessToken, refreshToken },
        });

        // displaySuccessToast("Successfully logged in with Google");
        if (userData?.user?.isFirstLoggedIn) {
          navigate("/pref");
        } else {
          navigate("/home");
        }
        //navigate("/home");
      } catch (error) {
        console.error("OAuth callback error:", error);
        displayErrorToast({ message: "Authentication process failed" });
        navigate("/auth");
      }
    };

    handleOAuthCallback();
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
            <Home />
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

      <Route path="/post" element={<PrivateRoute />}>
        <Route index element={<Community isMobile={isMobile} />} />
        <Route path=":postId" element={<Post />} />
      </Route>

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
        <Route path="recipes/:recipeId" element={<RecipeDetail />} />
        <Route path="generator" element={<RecipeGenerator />} />
        <Route path="reported" element={<ReportedContent />} />
        <Route path="reported/:postId" element={<Post />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="campaigns" element={<CampaignManager />} />
      </Route>

      <Route path="/not-found" element={<NotFound />} />
      <Route path="/pref" element={<Preferences />} />
    </Routes>
  );
};

export default AnimatedRoutes;
