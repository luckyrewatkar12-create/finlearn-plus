const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const LearningProgress = require("../models/LearningProgress");

const MODULES = [
  { id: 1, title: "What is Investing?", xp: 100, lessons: 5 },
  { id: 2, title: "Understanding Stocks", xp: 150, lessons: 8 },
  { id: 3, title: "Mutual Funds Explained", xp: 150, lessons: 7 },
  { id: 4, title: "SIP — Systematic Investment Plan", xp: 200, lessons: 6 },
  { id: 5, title: "Risk & Diversification", xp: 250, lessons: 9 },
  { id: 6, title: "Reading Financial Statements", xp: 300, lessons: 10 },
  { id: 7, title: "Technical Analysis Basics", xp: 350, lessons: 12 },
  { id: 8, title: "Portfolio Management", xp: 400, lessons: 14 },
];

const BADGES = [
  { id: "first_module", name: "First Step", description: "Completed your first module", icon: "🎯", threshold: 1 },
  { id: "five_modules", name: "On a Roll", description: "Completed 5 modules", icon: "🔥", threshold: 5 },
  { id: "all_modules", name: "Master Investor", description: "Completed all modules", icon: "🏆", threshold: 8 },
  { id: "xp_500", name: "XP Hunter", description: "Earned 500 XP", icon: "⚡", xpThreshold: 500 },
  { id: "xp_1000", name: "Knowledge Seeker", description: "Earned 1000 XP", icon: "🌟", xpThreshold: 1000 },
];

// GET /api/learning/modules
router.get("/modules", protect, async (req, res, next) => {
  try {
    const progress = await LearningProgress.findOne({ user: req.user._id });
    const completedIds = progress?.completedModules.map((m) => m.moduleId) || [];

    const modules = MODULES.map((m, i) => ({
      ...m,
      completed: completedIds.includes(m.id),
      unlocked: i === 0 || completedIds.includes(MODULES[i - 1]?.id),
    }));

    res.json(modules);
  } catch (err) {
    next(err);
  }
});

// POST /api/learning/modules/:id/complete
router.post("/modules/:id/complete", protect, async (req, res, next) => {
  try {
    const moduleId = parseInt(req.params.id);
    const module = MODULES.find((m) => m.id === moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    let progress = await LearningProgress.findOne({ user: req.user._id });
    if (!progress) progress = await LearningProgress.create({ user: req.user._id });

    const alreadyCompleted = progress.completedModules.some((m) => m.moduleId === moduleId);
    if (alreadyCompleted) {
      return res.json({ message: "Module already completed", progress });
    }

    // Add completed module & XP
    progress.completedModules.push({ moduleId, title: module.title, xpEarned: module.xp });
    progress.totalXP += module.xp;

    // Update streak
    const today = new Date().toDateString();
    const lastActive = progress.lastActiveDate?.toDateString();
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      progress.streak = lastActive === yesterday.toDateString() ? progress.streak + 1 : 1;
      progress.lastActiveDate = new Date();
    }

    // Check and award badges
    const completedCount = progress.completedModules.length;
    for (const badge of BADGES) {
      const alreadyHas = progress.badges.some((b) => b.name === badge.name);
      if (alreadyHas) continue;

      const earned =
        (badge.threshold && completedCount >= badge.threshold) ||
        (badge.xpThreshold && progress.totalXP >= badge.xpThreshold);

      if (earned) {
        progress.badges.push({ name: badge.name, description: badge.description, icon: badge.icon });
      }
    }

    await progress.save();

    res.json({
      message: `Module "${module.title}" completed! +${module.xp} XP`,
      xpEarned: module.xp,
      totalXP: progress.totalXP,
      level: progress.level,
      newBadges: progress.badges.slice(-1),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/learning/progress
router.get("/progress", protect, async (req, res, next) => {
  try {
    const progress = await LearningProgress.findOne({ user: req.user._id });
    if (!progress) return res.json({ totalXP: 0, level: 1, completedModules: [], badges: [], streak: 0 });
    res.json(progress);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
