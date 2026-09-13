const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    type: {
      type: String,
      enum: ["mutual_fund", "bond", "sip"],
      required: true,
    },

    name: { type: String, required: true },
    category: { type: String },

    // For mutual funds & bonds
    amountInvested: { type: Number, required: true },
    currentValue: { type: Number },
    units: { type: Number },
    nav: { type: Number }, // Net Asset Value

    // For SIP
    monthlyAmount: { type: Number },
    sipDay: { type: Number, min: 1, max: 28 }, // day of month
    totalInstallments: { type: Number },
    completedInstallments: { type: Number, default: 0 },
    nextSIPDate: { type: Date },
    sipActive: { type: Boolean, default: true },

    // Bond specific
    interestRate: { type: Number },
    maturityDate: { type: Date },
    tenure: { type: String },

    returns: { type: Number, default: 0 },
    returnsPercent: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "matured", "cancelled", "paused"],
      default: "active",
    },
  },
  { timestamps: true }
);

investmentSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model("Investment", investmentSchema);
