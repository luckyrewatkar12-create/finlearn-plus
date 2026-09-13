const express = require("express");
const router = express.Router();
const axios = require("axios");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Portfolio = require("../models/Portfolio");
const Transaction = require("../models/Transaction");

// Helper: fetch stock quote from Alpha Vantage
const fetchStockQuote = async (symbol) => {
  const key = process.env.ALPHA_VANTAGE_KEY;

  if (!key || key === "your_alpha_vantage_api_key") {
    // Return mock data when API key is not configured
    const mockPrices = {
      RELIANCE: 2850.5, TCS: 3920.0, INFY: 1820.3, HDFC: 1650.0,
      WIPRO: 480.2, TATAMOTORS: 920.5, SBIN: 620.8, ICICIBANK: 1120.4,
    };
    const price = mockPrices[symbol] || 1000 + Math.random() * 2000;
    const change = (Math.random() - 0.5) * 100;
    return {
      symbol,
      name: symbol,
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(((change / price) * 100).toFixed(2)),
      open: parseFloat((price - Math.random() * 50).toFixed(2)),
      high: parseFloat((price + Math.random() * 80).toFixed(2)),
      low: parseFloat((price - Math.random() * 80).toFixed(2)),
      volume: Math.floor(Math.random() * 1000000),
    };
  }

  const { data } = await axios.get("https://www.alphavantage.co/query", {
    params: {
      function: "GLOBAL_QUOTE",
      symbol: `${symbol}.BSE`,
      apikey: key,
    },
  });

  const q = data["Global Quote"];
  if (!q || !q["05. price"]) throw new Error("Stock not found");

  return {
    symbol,
    name: symbol,
    price: parseFloat(q["05. price"]),
    change: parseFloat(q["09. change"]),
    changePercent: parseFloat(q["10. change percent"]),
    open: parseFloat(q["02. open"]),
    high: parseFloat(q["03. high"]),
    low: parseFloat(q["04. low"]),
    volume: parseInt(q["06. volume"]),
  };
};

// GET /api/stocks/quote/:symbol
router.get("/quote/:symbol", protect, async (req, res, next) => {
  try {
    const quote = await fetchStockQuote(req.params.symbol.toUpperCase());
    res.json(quote);
  } catch (err) {
    next(err);
  }
});

// GET /api/stocks/portfolio
router.get("/portfolio", protect, async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.json({ holdings: [], totalValue: 0, totalInvested: 0, totalReturns: 0 });

    // Update current prices for each holding
    const updatedHoldings = await Promise.all(
      portfolio.holdings.map(async (h) => {
        try {
          const quote = await fetchStockQuote(h.symbol);
          h.currentPrice = quote.price;
          h.lastUpdated = new Date();
        } catch {
          // keep existing price on error
        }
        return {
          symbol: h.symbol,
          name: h.name,
          quantity: h.quantity,
          avgBuyPrice: h.avgBuyPrice,
          currentPrice: h.currentPrice,
          investedValue: h.quantity * h.avgBuyPrice,
          currentValue: h.quantity * h.currentPrice,
          pnl: h.quantity * (h.currentPrice - h.avgBuyPrice),
          pnlPercent: (((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100).toFixed(2),
        };
      })
    );

    await portfolio.save();

    const totalInvested = updatedHoldings.reduce((s, h) => s + h.investedValue, 0);
    const totalValue = updatedHoldings.reduce((s, h) => s + h.currentValue, 0);

    res.json({
      holdings: updatedHoldings,
      totalInvested,
      totalValue,
      totalReturns: totalValue - totalInvested,
      returnsPercent: totalInvested > 0 ? (((totalValue - totalInvested) / totalInvested) * 100).toFixed(2) : 0,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/stocks/buy
router.post(
  "/buy",
  protect,
  [
    body("symbol").notEmpty().withMessage("Symbol required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("price").isFloat({ min: 0.01 }).withMessage("Invalid price"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { symbol, quantity, price, isDemo = false } = req.body;
      const totalCost = quantity * price;

      const user = await User.findById(req.user._id);
      const balanceField = isDemo ? "virtualBalance" : "realBalance";

      if (user[balanceField] < totalCost) {
        return res.status(400).json({ message: `Insufficient ${isDemo ? "virtual" : "real"} balance` });
      }

      // Deduct balance
      await User.findByIdAndUpdate(req.user._id, { $inc: { [balanceField]: -totalCost } });

      // Update portfolio
      let portfolio = await Portfolio.findOne({ user: req.user._id });
      if (!portfolio) portfolio = await Portfolio.create({ user: req.user._id });

      const existingIndex = portfolio.holdings.findIndex((h) => h.symbol === symbol.toUpperCase());
      if (existingIndex > -1) {
        const existing = portfolio.holdings[existingIndex];
        const totalQty = existing.quantity + quantity;
        existing.avgBuyPrice = (existing.avgBuyPrice * existing.quantity + price * quantity) / totalQty;
        existing.quantity = totalQty;
        existing.currentPrice = price;
      } else {
        portfolio.holdings.push({ symbol: symbol.toUpperCase(), name: symbol, quantity, avgBuyPrice: price, currentPrice: price });
      }
      await portfolio.save();

      // Record transaction
      await Transaction.create({
        user: req.user._id,
        type: "buy",
        category: "stock",
        symbol: symbol.toUpperCase(),
        quantity,
        price,
        amount: totalCost,
        isDemo,
        status: "success",
      });

      res.json({ message: `Bought ${quantity} shares of ${symbol} at ₹${price}`, totalCost });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/stocks/sell
router.post(
  "/sell",
  protect,
  [
    body("symbol").notEmpty().withMessage("Symbol required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("price").isFloat({ min: 0.01 }).withMessage("Invalid price"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { symbol, quantity, price, isDemo = false } = req.body;
      const totalAmount = quantity * price;

      const portfolio = await Portfolio.findOne({ user: req.user._id });
      const holdingIndex = portfolio?.holdings.findIndex((h) => h.symbol === symbol.toUpperCase());

      if (holdingIndex === undefined || holdingIndex === -1) {
        return res.status(400).json({ message: "You don't own this stock" });
      }

      const holding = portfolio.holdings[holdingIndex];
      if (holding.quantity < quantity) {
        return res.status(400).json({ message: `You only have ${holding.quantity} shares` });
      }

      // Update holding
      holding.quantity -= quantity;
      if (holding.quantity === 0) {
        portfolio.holdings.splice(holdingIndex, 1);
      }
      await portfolio.save();

      // Credit balance
      const balanceField = isDemo ? "virtualBalance" : "realBalance";
      await User.findByIdAndUpdate(req.user._id, { $inc: { [balanceField]: totalAmount } });

      // Record transaction
      await Transaction.create({
        user: req.user._id,
        type: "sell",
        category: "stock",
        symbol: symbol.toUpperCase(),
        quantity,
        price,
        amount: totalAmount,
        isDemo,
        status: "success",
      });

      res.json({ message: `Sold ${quantity} shares of ${symbol} at ₹${price}`, totalAmount });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
