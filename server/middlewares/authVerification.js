const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

const verifyToken = (req) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) throw new Error("Unauthorized Access");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Token is missing");

  return jwt.verify(token, process.env.JWT_SECRET);
};

const userAuth = (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message || "Unauthorized" });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    const user = await Users.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message || "Invalid token" });
  }
};

module.exports = { userAuth, adminAuth };
