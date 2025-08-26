const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware"); // Fixed incorrect import path
const User = require("../models/userModel"); //  Fixed import casing
const Transaction = require("../models/transactionModel"); //  Fixed import casing

// ✅ Middleware to check if user is an admin
const verifyAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized. Token missing or invalid." });
  }

  try {
    const user = await User.findById(req.user.id).select("role"); //  Optimized query
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only!" });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

//  Test Route (API Health Check)
router.get("/", (req, res) => {
  res.json({
    message: "Admin API is working!",
    adminEndpoints: [
      { method: "GET", path: "/users", description: "Get all users (Admin only)" },
      { method: "GET", path: "/transactions", description: "Get all transactions (Admin only)" },
    ],
  });
});

//  Get all users (Admin Only)
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").lean(); // ✅ Faster read-only query
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
});

//  Get all transactions (Admin Only)
router.get("/transactions", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("userId", "name email")
      .lean(); //  Faster read-only query
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching transactions", error: error.message });
  }
});

module.exports = router;
