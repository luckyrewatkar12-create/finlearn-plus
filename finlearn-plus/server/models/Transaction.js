const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    type: {
      type: String,
      enum: ["buy", "sell", "deposit", "withdraw", "sip", "mutual_fund", "bond", "dividend"],
      required: true,
    },

    category: {
      type: String,
      enum: ["stock", "mutual_fund", "bond", "sip", "wallet", "payment"],
      required: true,
    },

    // Stock-specific
    symbol: { type: String },
    stockName: { type: String },
    quantity: { type: Number },
    price: { type: Number },

    // General
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    // Payment
    paymentMethod: { type: String, enum: ["upi", "card", "netbanking", "wallet", null] },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },

    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "success",
    },

    isDemo: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

// Index for faster queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
