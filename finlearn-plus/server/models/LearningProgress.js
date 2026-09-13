const mongoose = require("mongoose");

const moduleProgressSchema = new mongoose.Schema({
  moduleId: { type: Number, required: true },
  title: { type: String },
  completedAt: { type: Date, default: Date.now },
  xpEarned: { type: Number, default: 0 },
});

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  earnedAt: { type: Date, default: Date.now },
});

const learningProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },

    completedModules: [moduleProgressSchema],
    badges: [badgeSchema],

    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },

    quizScores: [
      {
        moduleId: Number,
        score: Number,
        maxScore: Number,
        takenAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Auto level up based on XP
learningProgressSchema.pre("save", function (next) {
  this.level = Math.floor(this.totalXP / 500) + 1;
  next();
});

module.exports = mongoose.model("LearningProgress", learningProgressSchema);
