const express = require("express");
const {
  getBalance,
  depositMoney,
  withdrawMoney,
  transferMoney,
  getTransactionHistory,
} = require("../controllers/accountController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

//  Middleware to validate transaction requests
const validateTransaction = (req, res, next) => {
  const { amount, receiverEmail } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid transaction amount" });
  }

  // Check for transfer-specific validation
  if (req.path === "/transfer" && (!receiverEmail || receiverEmail === req.user.email)) {
    return res.status(400).json({ message: "Invalid receiver email" });
  }

  next();
};

//  Test Route (API Health Check)
router.get("/", (req, res) => {
  res.json({
    message: "API is working!",
    endpoints: [
      { method: "GET", path: "/balance", description: "Get account balance" },
      { method: "POST", path: "/deposit", description: "Deposit money" },
      { method: "POST", path: "/withdraw", description: "Withdraw money" },
      { method: "POST", path: "/transfer", description: "Transfer money" },
      { method: "GET", path: "/transactions", description: "Get transaction history" },
    ],
  });
});

//  Get Account Balance
router.get("/balance", protect, getBalance);

//  Deposit Money
router.post("/deposit", protect, validateTransaction, depositMoney);

//  Withdraw Money
router.post("/withdraw", protect, validateTransaction, withdrawMoney);

//  Transfer Money
router.post("/transfer", protect, validateTransaction, transferMoney);

//  Get Transaction History
router.get("/transactions", protect, getTransactionHistory);

module.exports = router;
