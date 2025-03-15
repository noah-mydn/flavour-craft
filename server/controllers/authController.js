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
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "2d" }
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
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
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "2d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    // Step 4: Send response
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
          lastName: profile.name.familyName || profile.name.givenName,
          email: profile.emails[0].value,
          password: null,
          userImg: profile.photos[0]
            ? profile.photos[0].value
            : "upload/avatar.png",
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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create new user if doesn't exist
          user = await User.create({
            firstName:
              profile.name.givenName || profile.displayName.split(" ")[0],
            lastName:
              profile.name.familyName ||
              profile.displayName.split(" ").slice(1).join(" "),
            email: profile.emails[0].value,
            googleId: profile.id,
            profileImage: profile.photos[0]?.value || "",
            // Set a random password or handle this differently based on your requirements
            password:
              Math.random().toString(36).slice(-8) +
              Math.random().toString(36).slice(-8),
          });
        } else if (!user.googleId) {
          // If user exists but doesn't have googleId (maybe they registered with email)
          user.googleId = profile.id;
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
        // Check if user exists in database
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
            // Set other required fields with default values as needed
          });
        } else if (!user.googleId) {
          // If user exists but hasn't used Google auth before, update their record
          user.googleId = profile.id;
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
