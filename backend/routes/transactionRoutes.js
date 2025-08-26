const express = require("express");
const {
  getTransactions,
  depositMoney,
  withdrawMoney,
} = require("../controllers/transactionController");
const protect = require("../middleware/authMiddleware"); // Fixed import

const router = express.Router();

// Test Route (API Health Check)
router.get("/", (req, res) => {
  res.json({
    message: "Transaction API is working!",
    endpoints: [
      { method: "GET", path: "/transactions", description: "Fetch all transactions for the logged-in user" },
      { method: "POST", path: "/deposit", description: "Deposit money into the account" },
      { method: "POST", path: "/withdraw", description: "Withdraw money from the account" },
    ],
  });
});

// Fetch all transactions for the logged-in user
router.get("/transactions", protect, getTransactions);

// Deposit money into the account
router.post("/deposit", protect, depositMoney);

// Withdraw money from the account
router.post("/withdraw", protect, withdrawMoney);

module.exports = router;
