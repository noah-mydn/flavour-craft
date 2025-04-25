const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/Users");
const UserAnalytics = require("../models/UserAnalytics");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: 400, message: "User already exists!" });
    }

    // Create new user and save
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      isFirstLoggedIn: true,
    });
    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "2d" }
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    await UserAnalytics.updateOne(
      { userId: newUser._id },
      {
        userId: newUser._id,
        generatedRecipeCount: 0,
        status: "Active",
        lastActiveAt: newUser.createdAt,
      },
      { upsert: true }
    );

    res.status(201).json({
      message: "User registered successfully!",
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        isFirstLoggedIn: newUser.isFirstLoggedIn,
        authProvider: "local",
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
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, firstName: user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "2d" }
    );

    user.refreshToken = refreshToken;
    if (user.isFirstLoggedIn) {
      user.isFirstLoggedIn = false;
      await user.save();
    }

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        isFirstLoggedIn: user.isFirstLoggedIn,
        authProvider: "user.authProvider",
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//Google Auth Config
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL + "/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create new user if not found
          user = await User.create({
            firstName:
              profile.name.givenName || profile.displayName.split(" ")[0],
            lastName:
              profile.name.familyName ||
              profile.displayName.split(" ").slice(1).join(" "),
            email: profile.emails[0].value,
            googleId: profile.id,
            profileImage: profile.photos[0]?.value || "",
            password:
              Math.random().toString(36).slice(-8) +
              Math.random().toString(36).slice(-8),
          });
          isFirstLoggedIn = true;
        } else {
          // Only update firstName and lastName
          if (
            user.firstName === profile.name.givenName &&
            user.lastName === profile.name.familyName
          ) {
            user.firstName = profile.name.givenName;
            user.lastName = profile.name.familyName;
          }

          // Always update Google ID & profile image
          user.googleId = profile.id;
          user.profileImage = profile.photos[0]?.value || user.profileImage;

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Setup Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //check existing users
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create new user - not found
          user = await User.create({
            firstName:
              profile.name.givenName || profile.displayName.split(" ")[0],
            lastName: profile.name?.familyName || profile.name.givenName,
            email: profile.emails[0].value,
            googleId: profile.id,
            isFirstLoggedIn: true,
            authProvider: "google",
          });

          await UserAnalytics.updateOne(
            { userId: newUser._id },
            {
              userId: newUser._id,
              generatedRecipeCount: 0,
              status: "Active",
              lastActiveAt: newUser.createdAt,
            },
            { upsert: true }
          );
        } else if (!user.googleId) {
          // If user exists
          user.googleId = profile.id;
          if (user.isFirstLoggedIn) {
            user.isFirstLoggedIn = false;
            user.authProvider = "google";
          }
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("Error in Google strategy:", error);
        return done(error, null);
      }
    }
  )
);

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
};
