const express = require("express");
const jwt = require("jsonwebtoken");
const {
  register,
  login,
  logout,
  googleAuth,
  googleCallBack,
  googleSuccess,
} = require("../controllers/authController");
const passport = require("passport");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(
        "http://localhost:3000/login?error=authentication_failed"
      );
    }

    const accessToken = jwt.sign(
      { userId: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "2d" }
    );

    // Store refresh token in DB
    req.user.refreshToken = refreshToken;
    req.user.save();

    res.redirect(
      `http://localhost:3000/home?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

module.exports = router;
