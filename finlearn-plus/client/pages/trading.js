import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { buyStock, sellStock, getPortfolio } from "../utils/api";
import toast from "react-hot-toast";
import { FiSearch, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const popularStocks = ["RELIANCE", "TCS", "INFY", "HDFC", "WIPRO", "TATAMOTORS", "SBIN", "ICICIBANK", "BAJFINANCE", "HCLTECH"];

// Mock stock data — works without API key
const mockStockData = {
  RELIANCE:   { name: "Reliance Industries", price: 2854.50, change: 32.4,  changePercent: 1.15,  open: 2822.00, high: 2878.90, low: 2810.00, volume: 8420341 },
  TCS:        { name: "Tata Consultancy Services", price: 3921.30, change: -18.7, changePercent: -0.47, open: 3940.00, high: 3955.00, low: 3905.00, volume: 3120450 },
  INFY:       { name: "Infosys Ltd", price: 1823.75, change: 24.5,  changePercent: 1.36,  open: 1799.00, high: 1834.00, low: 1795.00, volume: 5230120 },
  HDFC:       { name: "HDFC Bank", price: 1652.40, change: -8.2,  changePercent: -0.49, open: 1660.00, high: 1668.00, low: 1645.00, volume: 6540230 },
  WIPRO:      { name: "Wipro Ltd", price: 482.60,  change: 6.3,   changePercent: 1.32,  open: 476.00,  high: 488.00,  low: 474.00,  volume: 4120890 },
  TATAMOTORS: { name: "Tata Motors", price: 924.80,  change: 15.9,  changePercent: 1.75,  open: 908.00,  high: 930.00,  low: 905.00,  volume: 9870234 },
  SBIN:       { name: "State Bank of India", price: 623.45,  change: -4.1,  changePercent: -0.65, open: 627.00,  high: 630.00,  low: 618.00,  volume: 12340567 },
  ICICIBANK:  { name: "ICICI Bank", price: 1124.90, change: 11.2,  changePercent: 1.00,  open: 1113.00, high: 1132.00, low: 1109.00, volume: 7230451 },
  BAJFINANCE: { name: "Bajaj Finance", price: 6842.30, change: 98.4,  changePercent: 1.46,  open: 6743.00, high: 6890.00, low: 6720.00, volume: 1230456 },
  HCLTECH:    { name: "HCL Technologies", price: 1543.20, change: -12.3, changePercent: -0.79, open: 1555.00, high: 1562.00, low: 1538.00, volume: 2340123 },
};

const getStockMock = (symbol) => {
  const base = mockStockData[symbol.toUpperCase()];
  if (base) {
    // Add slight random variation each time
    const variation = (Math.random() - 0.5) * 10;
    return { ...base, symbol: symbol.toUpperCase(), price: parseFloat((base.price + variation).toFixed(2)) };
  }
  // Unknown symbol — generate random data
  const price = parseFloat((500 + Math.random() * 3000).toFixed(2));
  const change = parseFloat(((Math.random() - 0.5) * 80).toFixed(2));
  return {
    symbol: symbol.toUpperCase(),
    name: symbol.toUpperCase(),
    price,
    change,
    changePercent: parseFloat(((change / price) * 100).toFixed(2)),
    open: parseFloat((price - Math.random() * 30).toFixed(2)),
    high: parseFloat((price + Math.random() * 60).toFixed(2)),
    low: parseFloat((price - Math.random() * 60).toFixed(2)),
    volume: Math.floor(Math.random() * 10000000),
  };
};

export default function Trading() {
  const { user, loading } = useAuth();
  const [symbol, setSymbol] = useState("");
  const [quote, setQuote] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [virtualBalance, setVirtualBalance] = useState(100000);
  const [qty, setQty] = useState(1);
  const [searching, setSearching] = useState(false);
  const [trading, setTrading] = useState(false);

  useEffect(() => {
    if (user) {
      getPortfolio()
        .then((r) => setPortfolio(r.data.holdings || []))
        .catch(() => {});
    }
  }, [user]);

  const searchStock = (sym) => {
    if (!sym) return;
    setSearching(true);
    // Simulate slight loading delay
    setTimeout(() => {
      const data = getStockMock(sym);
      setQuote(data);
      setSearching(false);
    }, 400);
  };

  const handleBuy = async () => {
    if (!quote) return;
    const totalCost = qty * quote.price;

    if (!user) {
      // Demo mode — update local state only
      if (virtualBalance < totalCost) {
        return toast.error("Insufficient virtual balance!");
      }
      setVirtualBalance((prev) => prev - totalCost);
      const existing = portfolio.find((h) => h.symbol === quote.symbol);
      if (existing) {
        setPortfolio(portfolio.map((h) =>
          h.symbol === quote.symbol
            ? { ...h, quantity: h.quantity + qty, currentPrice: quote.price, pnl: (h.quantity + qty) * (quote.price - h.avgBuyPrice) }
            : h
        ));
      } else {
        setPortfolio([...portfolio, {
          symbol: quote.symbol, name: quote.name,
          quantity: qty, avgBuyPrice: quote.price,
          currentPrice: quote.price, pnl: 0,
        }]);
      }
      toast.success(`🎉 Bought ${qty} share${qty > 1 ? "s" : ""} of ${quote.symbol} at ₹${quote.price}`);
      return;
    }

    // Logged in — call backend
    setTrading(true);
    try {
      await buyStock({ symbol: quote.symbol, quantity: qty, price: quote.price, isDemo: true });
      toast.success(`🎉 Bought ${qty} shares of ${quote.symbol}`);
      const r = await getPortfolio();
      setPortfolio(r.data.holdings || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Buy failed");
    } finally {
      setTrading(false);
    }
  };

  const handleSell = async () => {
    if (!quote) return;
    const holding = portfolio.find((h) => h.symbol === quote.symbol);

    if (!user) {
      if (!holding || holding.quantity < qty) {
        return toast.error(`You only have ${holding?.quantity || 0} shares of ${quote.symbol}`);
      }
      const totalAmount = qty * quote.price;
      setVirtualBalance((prev) => prev + totalAmount);
      setPortfolio(portfolio
        .map((h) => h.symbol === quote.symbol ? { ...h, quantity: h.quantity - qty } : h)
        .filter((h) => h.quantity > 0)
      );
      toast.success(`Sold ${qty} shares of ${quote.symbol} at ₹${quote.price}`);
      return;
    }

    setTrading(true);
    try {
      await sellStock({ symbol: quote.symbol, quantity: qty, price: quote.price, isDemo: true });
      toast.success(`Sold ${qty} shares of ${quote.symbol}`);
      const r = await getPortfolio();
      setPortfolio(r.data.holdings || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Sell failed");
    } finally {
      setTrading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-white">Stock Trading</h1>
        {!user && (
          <span className="text-xs px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
            🎮 Demo Mode — Sign up to save progress
          </span>
        )}
      </div>
      <p className="text-slate-400 mb-8">Search any Indian stock and simulate buy/sell trades</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search & Trade Panel */}
        <div className="lg:col-span-2 space-y-5">

          {/* Virtual Balance */}
          <div className="glass rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs mb-0.5">Virtual Balance</p>
              <p className="text-2xl font-bold text-indigo-400">₹{virtualBalance.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs mb-0.5">Portfolio Value</p>
              <p className="text-xl font-bold text-green-400">
                ₹{portfolio.reduce((s, h) => s + h.quantity * h.currentPrice, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="glass rounded-xl p-5">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-3.5 text-slate-500" size={16} />
                <input
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && searchStock(symbol)}
                  placeholder="Search symbol e.g. RELIANCE, TCS, INFY..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <button
                onClick={() => searchStock(symbol)}
                disabled={searching || !symbol}
                className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl font-medium transition"
              >
                {searching ? "..." : "Search"}
              </button>
            </div>

            {/* Popular Stocks */}
            <p className="text-slate-500 text-xs mt-4 mb-2">Popular stocks — click to load:</p>
            <div className="flex flex-wrap gap-2">
              {popularStocks.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSymbol(s); searchStock(s); }}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                    quote?.symbol === s
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-700/50 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quote Card */}
          {searching && (
            <div className="glass rounded-xl p-8 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}

          {quote && !searching && (
            <div className="glass rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{quote.symbol}</h2>
                  <p className="text-slate-400 text-sm">{quote.name} • NSE</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">₹{quote.price.toFixed(2)}</p>
                  <p className={`text-sm font-medium flex items-center gap-1 justify-end mt-1 ${quote.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {quote.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                    {quote.change >= 0 ? "+" : ""}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-5 text-sm">
                <div className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                  <p className="text-slate-500 text-xs">Open</p>
                  <p className="text-white font-medium">₹{quote.open}</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-2.5 text-center">
                  <p className="text-slate-500 text-xs">High</p>
                  <p className="text-green-400 font-medium">₹{quote.high}</p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-2.5 text-center">
                  <p className="text-slate-500 text-xs">Low</p>
                  <p className="text-red-400 font-medium">₹{quote.low}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                  <p className="text-slate-500 text-xs">Volume</p>
                  <p className="text-white font-medium">{(quote.volume / 100000).toFixed(1)}L</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                    className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-slate-400 text-xs">Total Cost</p>
                  <p className="text-white font-semibold text-lg">₹{(qty * quote.price).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleBuy}
                    disabled={trading}
                    className="px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-xl font-semibold transition"
                  >
                    {trading ? "..." : "Buy"}
                  </button>
                  <button
                    onClick={handleSell}
                    disabled={trading}
                    className="px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl font-semibold transition"
                  >
                    {trading ? "..." : "Sell"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!quote && !searching && (
            <div className="glass rounded-xl p-10 text-center">
              <p className="text-4xl mb-3">📈</p>
              <p className="text-slate-400">Click any stock above or type a symbol to get started</p>
            </div>
          )}
        </div>

        {/* Portfolio Holdings */}
        <div className="glass rounded-xl p-5 h-fit">
          <h2 className="text-white font-semibold mb-4">My Holdings</h2>
          {portfolio.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📊</p>
              <p className="text-slate-500 text-sm">No holdings yet.</p>
              <p className="text-slate-600 text-xs mt-1">Buy a stock to start!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolio.map((h) => (
                <div key={h.symbol} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium text-sm">{h.symbol}</p>
                    <p className="text-slate-500 text-xs">{h.quantity} shares @ ₹{h.avgBuyPrice?.toFixed(0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">₹{(h.quantity * h.currentPrice).toLocaleString()}</p>
                    <p className={`text-xs font-medium ${h.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {h.pnl >= 0 ? "+" : ""}₹{h.pnl?.toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
