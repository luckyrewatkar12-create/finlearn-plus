import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { getStockQuote, buyStock, sellStock, getPortfolio } from "../utils/api";
import toast from "react-hot-toast";
import { FiSearch, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const popularStocks = ["RELIANCE", "TCS", "INFY", "HDFC", "WIPRO", "TATAMOTORS", "SBIN", "ICICIBANK"];

export default function Trading() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [symbol, setSymbol] = useState("");
  const [quote, setQuote] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [qty, setQty] = useState(1);
  const [searching, setSearching] = useState(false);
  const [trading, setTrading] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/login"); }, [user, loading]);
  useEffect(() => {
    if (user) getPortfolio().then((r) => setPortfolio(r.data.holdings || [])).catch(() => {});
  }, [user]);

  const searchStock = async (sym) => {
    if (!sym) return;
    setSearching(true);
    try {
      const { data } = await getStockQuote(sym.toUpperCase());
      setQuote(data);
    } catch {
      toast.error("Stock not found or API limit reached");
    } finally {
      setSearching(false);
    }
  };

  const handleBuy = async () => {
    if (!quote) return;
    setTrading(true);
    try {
      await buyStock({ symbol: quote.symbol, quantity: qty, price: quote.price });
      toast.success(`Bought ${qty} shares of ${quote.symbol}`);
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
    setTrading(true);
    try {
      await sellStock({ symbol: quote.symbol, quantity: qty, price: quote.price });
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
      <h1 className="text-3xl font-bold text-white mb-2">Stock Trading</h1>
      <p className="text-slate-400 mb-8">Buy and sell stocks in real-time simulation</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search & Trade */}
        <div className="lg:col-span-2 space-y-5">
          {/* Search Bar */}
          <div className="glass rounded-xl p-5">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-3.5 text-slate-500" size={16} />
                <input
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && searchStock(symbol)}
                  placeholder="Search symbol (e.g. RELIANCE)"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <button
                onClick={() => searchStock(symbol)}
                disabled={searching}
                className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition"
              >
                {searching ? "..." : "Search"}
              </button>
            </div>

            {/* Popular */}
            <div className="flex flex-wrap gap-2 mt-4">
              {popularStocks.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSymbol(s); searchStock(s); }}
                  className="px-3 py-1 text-xs bg-slate-700/50 text-slate-300 rounded-lg hover:bg-indigo-500/20 hover:text-indigo-400 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quote Card */}
          {quote && (
            <div className="glass rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{quote.symbol}</h2>
                  <p className="text-slate-400 text-sm">{quote.name || "NSE / BSE"}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">₹{Number(quote.price).toFixed(2)}</p>
                  <p className={`text-sm font-medium flex items-center gap-1 justify-end ${quote.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {quote.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                    {quote.change >= 0 ? "+" : ""}{quote.change?.toFixed(2)} ({quote.changePercent?.toFixed(2)}%)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-5 text-sm">
                <div><p className="text-slate-500">Open</p><p className="text-white">₹{quote.open}</p></div>
                <div><p className="text-slate-500">High</p><p className="text-green-400">₹{quote.high}</p></div>
                <div><p className="text-slate-500">Low</p><p className="text-red-400">₹{quote.low}</p></div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex-1 text-slate-400 text-sm">
                  Total: <span className="text-white font-semibold">₹{(qty * quote.price).toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleBuy} disabled={trading} className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition">
                    Buy
                  </button>
                  <button onClick={handleSell} disabled={trading} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition">
                    Sell
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Portfolio Holdings */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">My Holdings</h2>
          {portfolio.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No holdings yet. Start by buying a stock!</p>
          ) : (
            <div className="space-y-3">
              {portfolio.map((h) => (
                <div key={h.symbol} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium text-sm">{h.symbol}</p>
                    <p className="text-slate-500 text-xs">{h.quantity} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">₹{(h.currentPrice * h.quantity).toFixed(0)}</p>
                    <p className={`text-xs ${h.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
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
