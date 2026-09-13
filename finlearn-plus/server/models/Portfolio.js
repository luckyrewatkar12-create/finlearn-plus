const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  name: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  avgBuyPrice: { type: Number, required: true },
  currentPrice: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

holdingSchema.virtual("investedValue").get(function () {
  return this.quantity * this.avgBuyPrice;
});

holdingSchema.virtual("currentValue").get(function () {
  return this.quantity * this.currentPrice;
});

holdingSchema.virtual("pnl").get(function () {
  return this.currentValue - this.investedValue;
});

holdingSchema.virtual("pnlPercent").get(function () {
  if (this.investedValue === 0) return 0;
  return ((this.pnl / this.investedValue) * 100).toFixed(2);
});

const portfolioSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    holdings: [holdingSchema],
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

portfolioSchema.virtual("totalInvested").get(function () {
  return this.holdings.reduce((sum, h) => sum + h.quantity * h.avgBuyPrice, 0);
});

portfolioSchema.virtual("totalValue").get(function () {
  return this.holdings.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0);
});

portfolioSchema.virtual("totalReturns").get(function () {
  return this.totalValue - this.totalInvested;
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
