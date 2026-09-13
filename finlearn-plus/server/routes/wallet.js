const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// GET /api/wallet
router.get("/", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("virtualBalance realBalance");
    res.json({
      virtualBalance: user.virtualBalance,
      realBalance: user.realBalance,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/wallet/deposit
router.post(
  "/deposit",
  protect,
  [body("amount").isFloat({ min: 1 }).withMessage("Amount must be greater than 0")],
  validate,
  async (req, res, next) => {
    try {
      const { amount, paymentMethod = "upi" } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { realBalance: amount } },
        { new: true }
      );

      await Transaction.create({
        user: req.user._id,
        type: "deposit",
        category: "wallet",
        amount,
        paymentMethod,
        status: "success",
      });

      res.json({
        message: `₹${amount} deposited successfully`,
        realBalance: user.realBalance,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/wallet/withdraw
router.post(
  "/withdraw",
  protect,
  [body("amount").isFloat({ min: 1 }).withMessage("Amount must be greater than 0")],
  validate,
  async (req, res, next) => {
    try {
      const { amount } = req.body;
      const user = await User.findById(req.user._id);

      if (user.realBalance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      await User.findByIdAndUpdate(req.user._id, { $inc: { realBalance: -amount } });

      await Transaction.create({
        user: req.user._id,
        type: "withdraw",
        category: "wallet",
        amount,
        status: "success",
      });

      res.json({ message: `₹${amount} withdrawn successfully`, realBalance: user.realBalance - amount });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
