const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/Users");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Create new user and save
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "5h" }
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Send response with tokens and user details
    res.status(201).json({
      message: "User registered successfully!",
      accessToken,
      refreshToken,
      user: {
        username: newUser.username,
        userImg: newUser.userImg,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        cuisinePreferences: newUser.cuisinePreferences,
        dietaryRestrictions: newUser.dietaryRestrictions,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, firstName: user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "5h" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    // Step 4: Send response
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        username: user.username,
        userImg: user.userImg,
        firstName: user.firstName,
        lastName: user.lastName,
        cuisinePreferences: user.cuisinePreferences,
        dietaryRestrictions: user.dietaryRestrictions,
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Refresh Session with refreshToken
const refreshToken = async (req, res) => {
  try {
    console.log(req.body);
    const { refreshToken } = req.body;

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if the user exists
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the token matches
    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Refresh token mismatch" });
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, firstName: user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Issue a new refresh token and update the database
    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Refresh token expired. Please log in again." });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Catch-all for other errors
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Google Auth Config
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Profile:", profile);
      try {
        //console.log("Google profile:", profile);
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          //console.log("Existing user found:", existingUser);
          return done(null, existingUser);
        }

        // Creating a new user
        const newUser = new User({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          password: null,
          userImg: profile.photos[0] ? profile.photos[0].value : "./avatar.png",
        });

        console.log("Creating new user:", newUser);
        const savedUser = await newUser.save();
        console.log("User saved successfully:", savedUser);
        return done(null, savedUser);
      } catch (error) {
        console.error("Error during Google Auth:", error);
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});
const googleCallBack = (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err, user, info) => {
      if (err) {
        console.error("Error during Google authentication:", err);
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }

      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const accessToken = jwt.sign(
        { userId: user._id, email: user.email, firstName: user.firstName },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "5h" }
      );

      user.refreshToken = refreshToken;
      await user.save();

      res.status(200).json({
        message: "Google logged in successfully",
        user: {
          username: user.username,
          userImg: user.userImg,
          firstName: user.firstName,
          lastName: user.lastName,
          cuisinePreferences: user.cuisinePreferences,
          dietaryRestrictions: user.dietaryRestrictions,
          email: user.email,
        },
        accessToken,
        refreshToken,
      });
    }
  )(req, res, next);
};

const googleSuccess = (req, res) => {
  console.log("Successful Logged in");
};

const logout = async (req, res) => {
  try {
    req.logout(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  googleAuth,
  googleCallBack,
  googleSuccess,
};
