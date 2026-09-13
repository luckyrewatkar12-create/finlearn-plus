const express = require("express");
const router = express.Router();
const axios = require("axios");
const { protect } = require("../middleware/auth");

const mockNews = [
  { title: "Sensex rallies 500 points on strong FII inflows", source: "Economic Times", url: "#", publishedAt: new Date().toISOString(), description: "Indian equity benchmarks surged as foreign institutional investors poured money into bluechip stocks." },
  { title: "RBI holds repo rate steady at 6.5%", source: "Mint", url: "#", publishedAt: new Date().toISOString(), description: "The Reserve Bank of India kept rates unchanged citing stable inflation and robust GDP growth." },
  { title: "Mutual fund SIP inflows hit record ₹21,000 crore", source: "NDTV Profit", url: "#", publishedAt: new Date().toISOString(), description: "Systematic Investment Plans continue to attract retail investors despite market volatility." },
  { title: "IT sector outlook: TCS, Infosys see order book growth", source: "Business Standard", url: "#", publishedAt: new Date().toISOString(), description: "Top IT companies report healthy deal pipeline amid global demand for digital transformation." },
  { title: "Gold prices surge amid global uncertainty", source: "Livemint", url: "#", publishedAt: new Date().toISOString(), description: "Safe-haven demand pushes gold to multi-month highs as investors seek portfolio protection." },
];

// GET /api/news
router.get("/", protect, async (req, res, next) => {
  try {
    const key = process.env.NEWS_API_KEY;

    if (!key || key === "your_newsapi_key") {
      return res.json({ articles: mockNews, source: "mock" });
    }

    const { data } = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "indian stock market OR mutual funds OR RBI OR Sensex OR Nifty",
        language: "en",
        sortBy: "publishedAt",
        pageSize: 10,
        apiKey: key,
      },
    });

    const articles = data.articles.map((a) => ({
      title: a.title,
      source: a.source.name,
      url: a.url,
      description: a.description,
      publishedAt: a.publishedAt,
      urlToImage: a.urlToImage,
    }));

    res.json({ articles, source: "newsapi" });
  } catch (err) {
    // Fall back to mock on API error
    res.json({ articles: mockNews, source: "mock" });
  }
});

module.exports = router;
