const express = require("express");
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
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Authentication successful, user:", req.user);
    res.send("Logged in successfully!");
    res.redirect("/login");
  }
);

module.exports = router;
