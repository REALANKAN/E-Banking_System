const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Debugging Middleware to Log Incoming Requests (Useful for Troubleshooting)
router.use((req, res, next) => {
  console.log(` Auth Route Hit: ${req.method} ${req.originalUrl}`);
  next();
});

// Test Route (API Health Check)
router.get("/", (req, res) => {
  res.json({
    message: "✅ Auth API is working!",
    endpoints: [
      { method: "POST", path: "/register", description: "Register a new user" },
      { method: "POST", path: "/login", description: "Login a user" },
      { method: "GET", path: "/profile", description: "Get user profile (Protected)" },
    ],
  });
});

// Register a new user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Get user profile (Protected Route)
router.get("/profile", protect, getUserProfile);

module.exports = router;

