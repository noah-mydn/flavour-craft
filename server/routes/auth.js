const express = require("express");
const jwt = require("jsonwebtoken");
const {
  register,
  login,
  logout,
  updateLoginStatus,
} = require("../controllers/authController");
const passport = require("passport");
const { authenticateToken } = require("../middlewares/authVerification");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update", authenticateToken, updateLoginStatus);

// Route to initiate Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.REACT_APP_BASE_API}/login?error=authentication_failed`,
  }),
  async (req, res) => {
    try {
      const user = {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        isFirstLoggedIn: req.user.isFirstLoggedIn,
      };
      // Generate tokens from authenticated user
      const accessToken = jwt.sign(
        {
          userId: req.user._id,
          email: req.user.email,
          firstName: req.user.firstName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const refreshToken = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      req.user.refreshToken = refreshToken;
      await req.user.save();

      res.redirect(
        `${process.env.HOST_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&userId=${req.user._id}`
      );
    } catch (error) {
      console.error("Error in callback handling:", error);
      res.redirect(`${process.env.HOST_URL}/login?error=server_error`);
    }
  }
);

module.exports = router;
