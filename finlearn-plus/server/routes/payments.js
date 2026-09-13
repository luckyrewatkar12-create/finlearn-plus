const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const crypto = require("crypto");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Helper: mock Razorpay order (replace with real Razorpay SDK when key is set)
const createRazorpayOrder = async (amount) => {
  const key = process.env.RAZORPAY_KEY_ID;
  if (!key || key === "your_razorpay_key_id") {
    // Mock order for development
    return {
      id: `order_mock_${Date.now()}`,
      amount: amount * 100,
      currency: "INR",
      status: "created",
    };
  }

  // Real Razorpay integration
  const Razorpay = require("razorpay");
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  return razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });
};

// POST /api/payments/order
router.post(
  "/order",
  protect,
  [body("amount").isFloat({ min: 1 }).withMessage("Amount must be greater than 0")],
  validate,
  async (req, res, next) => {
    try {
      const { amount, type = "deposit" } = req.body;
      const order = await createRazorpayOrder(amount);

      // Pending transaction record
      await Transaction.create({
        user: req.user._id,
        type,
        category: "wallet",
        amount,
        razorpayOrderId: order.id,
        status: "pending",
        paymentMethod: "card",
      });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || "mock_key",
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/payments/verify
router.post(
  "/verify",
  protect,
  [
    body("razorpayOrderId").notEmpty(),
    body("razorpayPaymentId").notEmpty(),
    body("razorpaySignature").notEmpty(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature, amount } = req.body;
      const secret = process.env.RAZORPAY_KEY_SECRET || "mock_secret";

      // Verify signature
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const expectedSignature = hmac.digest("hex");

      const isMock = razorpayOrderId.startsWith("order_mock_");

      if (!isMock && expectedSignature !== razorpaySignature) {
        return res.status(400).json({ message: "Payment verification failed — invalid signature" });
      }

      // Credit user balance
      await User.findByIdAndUpdate(req.user._id, { $inc: { realBalance: amount } });

      // Update transaction
      await Transaction.findOneAndUpdate(
        { razorpayOrderId },
        { razorpayPaymentId, status: "success" }
      );

      res.json({ message: `Payment of ₹${amount} verified and credited`, success: true });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
