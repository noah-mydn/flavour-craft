const express = require("express");
const jwt = require("jsonwebtoken");
const {
  register,
  login,
  logout,
  googleAuth,
  googleCallBack,
  googleSuccess,
  refreshToken,
} = require("../controllers/authController");
const passport = require("passport");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/refresh-session", refreshToken);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;

    // Generate tokens for your application
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(
      `http://localhost:3000/home?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

module.exports = router;
