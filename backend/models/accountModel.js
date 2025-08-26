const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Deposit", "Withdraw", "Transfer"], required: true },
    amount: { type: Number, required: true, min: 1 }, // Prevents negative transactions
    
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      validate: {
        validator: function (value) {
          return this.type !== "Deposit"; // Deposits should not have a sender
        },
        message: "Sender should only be specified for transfers.",
      },
    },
    
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      validate: {
        validator: function (value) {
          return this.type !== "Withdraw"; // Withdrawals should not have a receiver
        },
        message: "Receiver should only be specified for transfers.",
      },
    },
    
    description: { type: String, default: "" }, // Added for transaction descriptions
    category: { type: String, default: "General" }, // For categorizing transactions
    status: { 
      type: String, 
      enum: ["Pending", "Completed", "Failed", "Cancelled"],
      default: "Completed" 
    }, // For transaction status tracking
    
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    balance: { type: Number, required: true, default: 0, min: 0 }, // Prevents negative balance
    transactions: [transactionSchema], // Embedded transactions
    currency: { type: String, default: "USD" }, // For multi-currency support
    accountType: { type: String, enum: ["Standard", "Premium", "Business"], default: "Standard" }, // Account tiers
    isActive: { type: Boolean, default: true }, // For account status tracking
    lastActivity: { type: Date, default: Date.now }, // Track last activity for dashboard metrics
  },
  { timestamps: true }
);

// Virtual field to count total transactions
accountSchema.virtual("totalTransactions").get(function () {
  return this.transactions.length;
});

// Add virtual fields for dashboard statistics
accountSchema.virtual("totalDeposits").get(function () {
  return this.transactions
    .filter(transaction => transaction.type === "Deposit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
});

accountSchema.virtual("totalWithdrawals").get(function () {
  return this.transactions
    .filter(transaction => transaction.type === "Withdraw")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
});

accountSchema.virtual("totalTransfers").get(function () {
  return this.transactions
    .filter(transaction => transaction.type === "Transfer")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
});

// Method to get recent transactions for dashboard
accountSchema.methods.getRecentTransactions = function(limit = 5) {
  return this.transactions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

// Method to get transactions by date range for dashboard charts
accountSchema.methods.getTransactionsByDateRange = function(startDate, endDate) {
  return this.transactions.filter(transaction => {
    return transaction.timestamp >= startDate && transaction.timestamp <= endDate;
  });
};

// Index for faster querying by transaction date (useful for dashboard date filtering)
accountSchema.index({ "transactions.timestamp": -1 });

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;