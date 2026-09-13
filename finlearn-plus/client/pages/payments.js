import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiCreditCard, FiSmartphone, FiGlobe, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const RAZORPAY_KEY_ID = "rzp_test_TbOYJm8wubGZqm";

// Load Razorpay script dynamically
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const paymentMethods = [
  { id: "upi", label: "UPI", icon: FiSmartphone, desc: "GPay, PhonePe, Paytm, BHIM UPI", color: "indigo" },
  { id: "card", label: "Debit / Credit Card", icon: FiCreditCard, desc: "Visa, Mastercard, RuPay accepted", color: "cyan" },
  { id: "netbanking", label: "Net Banking", icon: FiGlobe, desc: "All major Indian banks supported", color: "amber" },
];

const quickAmounts = [500, 1000, 5000, 10000, 25000, 50000];

// Test credentials hint
const testCards = [
  { label: "Success Card", number: "4111 1111 1111 1111", expiry: "Any future date", cvv: "Any 3 digits" },
  { label: "Test UPI", number: "success@razorpay", expiry: "-", cvv: "-" },
];

export default function Payments() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("deposit");
  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showTestInfo, setShowTestInfo] = useState(false);

  useEffect(() => {
    loadRazorpay();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast.error("Enter a valid amount");

    const loaded = await loadRazorpay();
    if (!loaded) return toast.error("Failed to load payment gateway. Check your internet.");

    setLoading(true);

    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: "INR",
      name: "FinLearn+",
      description: type === "deposit" ? "Wallet Deposit" : "Wallet Withdrawal",
      image: "https://via.placeholder.com/150/6366f1/ffffff?text=F%2B",

      // Pre-fill user info if logged in
      prefill: {
        name: user?.name || "FinLearn User",
        email: user?.email || "test@finlearn.com",
        contact: "9999999999",
      },

      // Restrict to selected method
      method: {
        upi: method === "upi",
        card: method === "card",
        netbanking: method === "netbanking",
        wallet: false,
        emi: false,
      },

      theme: {
        color: "#6366f1",
        backdrop_color: "#0f172a",
      },

      modal: {
        ondismiss: () => {
          setLoading(false);
          toast("Payment cancelled", { icon: "ℹ️" });
        },
        confirm_close: true,
      },

      handler: function (response) {
        // Payment successful
        setLoading(false);
        const newBalance = balance + Number(amount);
        setBalance(newBalance);
        setLastTransaction({
          id: response.razorpay_payment_id,
          amount: Number(amount),
          type,
          method,
          time: new Date().toLocaleTimeString(),
          status: "success",
        });
        toast.success(`✅ ₹${Number(amount).toLocaleString()} ${type === "deposit" ? "deposited" : "withdrawn"} successfully!`);
        setAmount("");
      },

      notes: {
        transaction_type: type,
        user_id: user?._id || "guest",
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setLoading(false);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      setLoading(false);
      toast.error("Could not open payment gateway");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
      <p className="text-slate-400 mb-8">Deposit or withdraw funds securely via Razorpay</p>

      {/* Balance Card */}
      <div className="glass rounded-xl p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs mb-1">Current Wallet Balance</p>
          <p className="text-3xl font-bold text-indigo-400">₹{balance.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <span className="text-xs px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
            🔒 Secured by Razorpay
          </span>
        </div>
      </div>

      {/* Last Transaction */}
      {lastTransaction && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 mb-6 border border-green-500/30 bg-green-500/5"
        >
          <div className="flex items-center gap-3">
            <FiCheckCircle className="text-green-400" size={20} />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">
                ₹{lastTransaction.amount.toLocaleString()} {lastTransaction.type === "deposit" ? "deposited" : "withdrawn"} successfully
              </p>
              <p className="text-slate-400 text-xs">
                Payment ID: {lastTransaction.id} • {lastTransaction.time}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Amount + Method */}
        <div className="space-y-5">

          {/* Deposit / Withdraw Toggle */}
          <div className="flex gap-3">
            {["deposit", "withdraw"].map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition capitalize ${
                  type === t ? "bg-indigo-500 text-white" : "glass text-slate-400 hover:text-white"
                }`}>
                {t === "deposit" ? "💰 Deposit" : "💸 Withdraw"}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <div className="glass rounded-xl p-5">
            <label className="block text-slate-400 text-sm mb-3">Enter Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="1"
              className="w-full bg-transparent text-5xl font-bold text-white placeholder-slate-700 focus:outline-none mb-5 border-b border-slate-700 pb-3"
            />
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((a) => (
                <button key={a} onClick={() => setAmount(String(a))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    amount === String(a)
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}>
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
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition border ${
                    method === id
                      ? `bg-${color}-500/20 border-${color}-500/40`
                      : "bg-slate-800/30 border-transparent hover:bg-slate-800/60"
                  }`}>
                  <div className={`w-9 h-9 rounded-lg bg-${color}-500/20 flex items-center justify-center shrink-0`}>
                    <Icon className={`text-${color}-400`} size={16} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-slate-500 text-xs">{desc}</p>
                  </div>
                  {method === id && <div className={`w-2 h-2 rounded-full bg-${color}-400`} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Summary + Pay Button */}
        <div className="space-y-5">
          <div className="glass rounded-xl p-6">
            <h2 className="text-white font-semibold mb-5">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Transaction Type</span>
                <span className="text-white capitalize font-medium">{type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Payment Method</span>
                <span className="text-white capitalize font-medium">{method === "netbanking" ? "Net Banking" : method.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Amount</span>
                <span className="text-white font-semibold">₹{Number(amount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Processing Fee</span>
                <span className="text-green-400 font-medium">FREE</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-indigo-400 font-bold text-lg">₹{Number(amount || 0).toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handlePayment}>
              <button
                type="submit"
                disabled={loading || !amount || Number(amount) <= 0}
                className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition text-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Opening Razorpay...
                  </span>
                ) : (
                  <>Pay ₹{Number(amount || 0).toLocaleString()} <FiArrowRight /></>
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 text-xs mt-4 flex items-center justify-center gap-1">
              🔒 Secured by Razorpay • PCI DSS Compliant
            </p>
          </div>

          {/* Test Mode Info */}
          <div className="glass rounded-xl p-4">
            <button
              onClick={() => setShowTestInfo(!showTestInfo)}
              className="w-full flex items-center justify-between text-sm"
            >
              <span className="text-amber-400 font-medium">🧪 Test Mode — Use these credentials</span>
              <span className="text-slate-500">{showTestInfo ? "▲" : "▼"}</span>
            </button>

            {showTestInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 space-y-3"
              >
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-green-400 text-xs font-semibold mb-1">✅ Success Card</p>
                  <p className="text-slate-300 text-xs font-mono">4111 1111 1111 1111</p>
                  <p className="text-slate-500 text-xs">Any future expiry • Any CVV</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-indigo-400 text-xs font-semibold mb-1">📱 Test UPI</p>
                  <p className="text-slate-300 text-xs font-mono">success@razorpay</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-red-400 text-xs font-semibold mb-1">❌ Fail Card</p>
                  <p className="text-slate-300 text-xs font-mono">4000 0000 0000 0002</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
