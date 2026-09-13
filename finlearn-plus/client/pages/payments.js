import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiCreditCard, FiSmartphone, FiGlobe, FiArrowRight } from "react-icons/fi";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: FiSmartphone, desc: "Pay instantly via UPI ID or QR code", color: "indigo" },
  { id: "card", label: "Debit/Credit Card", icon: FiCreditCard, desc: "Visa, Mastercard, RuPay accepted", color: "cyan" },
  { id: "netbanking", label: "Net Banking", icon: FiGlobe, desc: "All major banks supported", color: "amber" },
];

export default function Payments() {
  const [method, setMethod] = useState("upi");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("deposit");
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });

  const quickAmounts = [500, 1000, 5000, 10000, 25000, 50000];

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast.error("Enter a valid amount");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success(`₹${Number(amount).toLocaleString()} ${type === "deposit" ? "deposited" : "withdrawn"} successfully!`);
    setAmount("");
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
      <p className="text-slate-400 mb-8">Deposit or withdraw funds securely</p>

      {/* Type Toggle */}
      <div className="flex gap-3 mb-6">
        {["deposit", "withdraw"].map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition capitalize ${type === t ? "bg-indigo-500 text-white" : "glass text-slate-400 hover:text-white"}`}>
            {t === "deposit" ? "💰 Deposit" : "💸 Withdraw"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Amount */}
        <div className="space-y-5">
          <div className="glass rounded-xl p-6">
            <label className="block text-slate-400 text-sm mb-3">Enter Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-4xl font-bold text-white placeholder-slate-700 focus:outline-none mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((a) => (
                <button key={a} onClick={() => setAmount(String(a))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${amount === String(a) ? "bg-indigo-500 text-white" : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"}`}>
                  ₹{a.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass rounded-xl p-5">
            <p className="text-slate-400 text-sm mb-4">Payment Method</p>
            <div className="space-y-3">
              {paymentMethods.map(({ id, label, icon: Icon, desc, color }) => (
                <button key={id} onClick={() => setMethod(id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${method === id ? `bg-${color}-500/20 border border-${color}-500/40` : "bg-slate-800/30 hover:bg-slate-800/60"}`}>
                  <div className={`w-9 h-9 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                    <Icon className={`text-${color}-400`} size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-slate-500 text-xs">{desc}</p>
                  </div>
                  {method === id && <div className={`ml-auto w-2 h-2 rounded-full bg-${color}-400`} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-5">
            {method === "upi" ? "UPI Details" : method === "card" ? "Card Details" : "Select Bank"}
          </h2>
          <form onSubmit={handlePayment} className="space-y-4">
            {method === "upi" && (
              <div>
                <label className="block text-slate-400 text-sm mb-2">UPI ID</label>
                <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
              </div>
            )}
            {method === "card" && (
              <>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Card Number</label>
                  <input value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="1234 5678 9012 3456" required
                    maxLength={19} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Expiry</label>
                    <input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="MM/YY" required
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">CVV</label>
                    <input value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} placeholder="•••" required maxLength={4} type="password"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Cardholder Name</label>
                  <input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="As on card" required
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                </div>
              </>
            )}
            {method === "netbanking" && (
              <div>
                <label className="block text-slate-400 text-sm mb-2">Select Bank</label>
                <select className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                  {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Bank", "Yes Bank"].map((b) => (
                    <option key={b} value={b} className="bg-slate-800">{b}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-2 border-t border-slate-700/50">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-slate-400">Amount</span>
                <span className="text-white font-semibold">₹{Number(amount || 0).toLocaleString()}</span>
              </div>
              <button type="submit" disabled={loading || !amount}
                className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition">
                {loading ? "Processing..." : (<>{type === "deposit" ? "Deposit Now" : "Withdraw Now"} <FiArrowRight /></>)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
