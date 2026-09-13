const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// GET /api/banking/accounts
router.get("/accounts", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("bankAccounts");
    res.json(user.bankAccounts);
  } catch (err) {
    next(err);
  }
});

// POST /api/banking/link
router.post(
  "/link",
  protect,
  [
    body("bankName").notEmpty().withMessage("Bank name required"),
    body("accountNo").notEmpty().withMessage("Account number required"),
    body("ifscCode")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .withMessage("Invalid IFSC code format"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { bankName, accountNo, ifscCode, isPrimary = false } = req.body;

      const user = await User.findById(req.user._id);

      // Check for duplicate
      const alreadyLinked = user.bankAccounts.some(
        (a) => a.accountNo === accountNo && a.ifscCode === ifscCode
      );
      if (alreadyLinked) {
        return res.status(400).json({ message: "This bank account is already linked" });
      }

      // If setting as primary, unset others
      if (isPrimary) {
        user.bankAccounts.forEach((a) => (a.isPrimary = false));
      }

      user.bankAccounts.push({ bankName, accountNo, ifscCode, isPrimary });
      await user.save();

      res.status(201).json({
        message: `${bankName} account linked successfully`,
        bankAccounts: user.bankAccounts,
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/banking/accounts/:id
router.delete("/accounts/:id", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.bankAccounts = user.bankAccounts.filter(
      (a) => a._id.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: "Bank account removed" });
  } catch (err) {
    next(err);
  }
});

// GET /api/banking/transactions
router.get("/transactions", protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
