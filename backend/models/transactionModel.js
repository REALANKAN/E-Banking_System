const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Faster lookup
    },

    type: {
      type: String,
      enum: ["Deposit", "Withdrawal", "Transfer"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1, // Prevents negative transactions
    },

    description: {
      type: String,
      default: "",
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      validate: {
        validator: function (value) {
          return this.type === "Transfer" ? value !== null : value === null;
        },
        message: "SenderId should be specified only for Transfer transactions.",
      },
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      validate: {
        validator: function (value) {
          return this.type === "Transfer" ? value !== null : value === null;
        },
        message: "ReceiverId should be specified only for Transfer transactions.",
      },
    },

    transferData: {
      to: { type: String, default: null },
      from: { type: String, default: null },
      transferId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Completed",
      index: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
