const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const Investment = require("../models/Investment");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

// --- MUTUAL FUNDS ---

// GET /api/investments/mutualfunds
router.get("/mutualfunds", protect, async (req, res, next) => {
  try {
    const funds = await Investment.find({ user: req.user._id, type: "mutual_fund" });
    res.json(funds);
  } catch (err) {
    next(err);
  }
});

// POST /api/investments/mutualfunds/invest
router.post(
  "/mutualfunds/invest",
  protect,
  [
    body("name").notEmpty().withMessage("Fund name required"),
    body("amount").isFloat({ min: 100 }).withMessage("Minimum investment ₹100"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, amount, category = "Large Cap" } = req.body;
      const user = await User.findById(req.user._id);

      if (user.realBalance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const nav = 100 + Math.random() * 900; // Mock NAV
      const units = amount / nav;

      await User.findByIdAndUpdate(req.user._id, { $inc: { realBalance: -amount } });

      const investment = await Investment.create({
        user: req.user._id,
        type: "mutual_fund",
        name,
        category,
        amountInvested: amount,
        currentValue: amount,
        units: parseFloat(units.toFixed(4)),
        nav: parseFloat(nav.toFixed(2)),
      });

      await Transaction.create({
        user: req.user._id,
        type: "mutual_fund",
        category: "mutual_fund",
        amount,
        status: "success",
        notes: `Invested in ${name}`,
      });

      res.status(201).json({ message: `Invested ₹${amount} in ${name}`, investment });
    } catch (err) {
      next(err);
    }
  }
);

// --- SIP ---

// GET /api/investments/sip
router.get("/sip", protect, async (req, res, next) => {
  try {
    const sips = await Investment.find({ user: req.user._id, type: "sip" });
    res.json(sips);
  } catch (err) {
    next(err);
  }
});

// POST /api/investments/sip/create
router.post(
  "/sip/create",
  protect,
  [
    body("name").notEmpty().withMessage("Fund name required"),
    body("monthlyAmount").isFloat({ min: 100 }).withMessage("Minimum SIP ₹100/month"),
    body("sipDay").isInt({ min: 1, max: 28 }).withMessage("SIP day must be between 1 and 28"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, monthlyAmount, sipDay, totalInstallments = 12, category } = req.body;

      const nextSIPDate = new Date();
      nextSIPDate.setDate(sipDay);
      if (nextSIPDate < new Date()) nextSIPDate.setMonth(nextSIPDate.getMonth() + 1);

      const sip = await Investment.create({
        user: req.user._id,
        type: "sip",
        name,
        category,
        monthlyAmount,
        sipDay,
        totalInstallments,
        completedInstallments: 0,
        nextSIPDate,
        amountInvested: 0,
        sipActive: true,
      });

      res.status(201).json({ message: `SIP started for ${name} — ₹${monthlyAmount}/month`, sip });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/investments/sip/:id/pause
router.put("/sip/:id/pause", protect, async (req, res, next) => {
  try {
    const sip = await Investment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { sipActive: false, status: "paused" },
      { new: true }
    );
    if (!sip) return res.status(404).json({ message: "SIP not found" });
    res.json({ message: "SIP paused", sip });
  } catch (err) {
    next(err);
  }
});

// --- BONDS ---

// GET /api/investments/bonds
router.get("/bonds", protect, async (req, res, next) => {
  try {
    const bonds = await Investment.find({ user: req.user._id, type: "bond" });
    res.json(bonds);
  } catch (err) {
    next(err);
  }
});

// POST /api/investments/bonds/invest
router.post(
  "/bonds/invest",
  protect,
  [
    body("name").notEmpty().withMessage("Bond name required"),
    body("amount").isFloat({ min: 1000 }).withMessage("Minimum bond investment ₹1,000"),
    body("interestRate").isFloat({ min: 0 }).withMessage("Invalid interest rate"),
    body("tenure").notEmpty().withMessage("Tenure required"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, amount, interestRate, tenure, type: bondType = "Government" } = req.body;
      const user = await User.findById(req.user._id);

      if (user.realBalance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const tenureYears = parseInt(tenure);
      const maturityDate = new Date();
      maturityDate.setFullYear(maturityDate.getFullYear() + (tenureYears || 5));

      await User.findByIdAndUpdate(req.user._id, { $inc: { realBalance: -amount } });

      const bond = await Investment.create({
        user: req.user._id,
        type: "bond",
        name,
        category: bondType,
        amountInvested: amount,
        currentValue: amount,
        interestRate,
        tenure,
        maturityDate,
      });

      await Transaction.create({
        user: req.user._id,
        type: "bond",
        category: "bond",
        amount,
        status: "success",
        notes: `Invested in ${name}`,
      });

      res.status(201).json({ message: `Invested ₹${amount} in ${name}`, bond });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/investments/all
router.get("/all", protect, async (req, res, next) => {
  try {
    const investments = await Investment.find({ user: req.user._id }).sort("-createdAt");
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amountInvested, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + (inv.currentValue || inv.amountInvested), 0);
    res.json({ investments, totalInvested, totalCurrentValue, returns: totalCurrentValue - totalInvested });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
