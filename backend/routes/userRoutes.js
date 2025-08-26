const express = require("express");
const { registerUser, getUsers } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware"); // Authentication middleware

const router = express.Router();

// Test Route (API Health Check)
router.get("/", (req, res) => {
    res.json({
        message: "User API is working!",
        endpoints: [
            { method: "POST", path: "/register", description: "Register a new user" },
            { method: "GET", path: "/all", description: "Get all users (Admin only)" }
        ],
    });
});

//Register a new user
router.post("/register", registerUser);

//Get all users (Admin Only)
router.get("/all", protect, getUsers);

module.exports = router;
