//const socket = require("./config/socket");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
require("./config/db");
const http = require("http");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const preferenceRoutes = require("./routes/preferences");
const batchGenerateRoute = require("./routes/recipes");
const communityRoute = require("./routes/community");
const ingredientRoute = require("./routes/ingredient");
const reportRoutes = require("./routes/report");
const campaignRoutes = require("./routes/campaign");

const app = express();
app.use("/uploads", express.static("public/uploads"));
const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "eGfCNdTNek",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport for Google OAuth
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/preferences", preferenceRoutes);
app.use("/recipes", batchGenerateRoute);
app.use("/posts", communityRoute);
app.use("/ingredients", ingredientRoute);
app.use("/report", reportRoutes);
app.use("/campaign", campaignRoutes);

app.options("/auth/google", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

app.get("/auth/google", (req, res, next) => {
  console.log("Google Auth Route Hit");
  next();
});
app.get("/auth/google/callback", (req, res, next) => {
  console.log("Google Callback Route Hit");
  next();
});

const server = http.createServer(app);

// const io = socket.init(server);
// io.on("connection", (socket) => {
//   console.log("a new client connected");

//   socket.on("joinRoom", (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} has joined the room`);
//   });
//   socket.on("disconnect", () => {
//     console.log("a user disconnected");
//   });
// });

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
