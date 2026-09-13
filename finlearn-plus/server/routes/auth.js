const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const LearningProgress = require("../models/LearningProgress");
const Portfolio = require("../models/Portfolio");
const generateToken = require("../utils/generateToken");

// POST /api/auth/signup
router.post(
  "/signup",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await User.create({ name, email, password });

      // Initialize learning progress and portfolio for new user
      await Promise.all([
        LearningProgress.create({ user: user._id }),
        Portfolio.create({ user: user._id }),
      ]);

      const token = generateToken(user._id);

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          virtualBalance: user.virtualBalance,
          realBalance: user.realBalance,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user._id);

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          virtualBalance: user.virtualBalance,
          realBalance: user.realBalance,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/profile
router.get("/profile", protect, async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile
router.put(
  "/profile",
  protect,
  [
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name too short"),
    body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, phone, avatar } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { ...(name && { name }), ...(phone && { phone }), ...(avatar && { avatar }) },
        { new: true, runValidators: true }
      );
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/auth/change-password
router.put(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select("+password");

      if (!(await user.matchPassword(currentPassword))) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
