import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiUser, FiPhone, FiMail, FiCreditCard, FiCheckCircle,
  FiTrendingUp, FiTrendingDown, FiPieChart, FiBarChart2,
  FiShield, FiAlertCircle, FiFileText, FiArrowRight
} from "react-icons/fi";

// Mock holdings data
const mockHoldings = [
  { symbol: "RELIANCE", name: "Reliance Industries", qty: 10, avgPrice: 2750.00, cmp: 2854.50, sector: "Energy" },
  { symbol: "TCS",      name: "Tata Consultancy",   qty: 5,  avgPrice: 3800.00, cmp: 3921.30, sector: "IT" },
  { symbol: "INFY",     name: "Infosys Ltd",         qty: 15, avgPrice: 1700.00, cmp: 1823.75, sector: "IT" },
  { symbol: "HDFC",     name: "HDFC Bank",           qty: 8,  avgPrice: 1600.00, cmp: 1652.40, sector: "Banking" },
  { symbol: "WIPRO",    name: "Wipro Ltd",           qty: 20, avgPrice: 500.00,  cmp: 482.60,  sector: "IT" },
];

const steps = ["Personal Info", "KYC Documents", "Bank Linking", "Account Created"];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i < current ? "bg-green-500 text-white" :
              i === current ? "bg-indigo-500 text-white" :
              "bg-slate-700 text-slate-400"
            }`}>
              {i < current ? <FiCheckCircle size={16} /> : i + 1}
            </div>
            <p className={`text-xs mt-1 text-center hidden sm:block ${i === current ? "text-indigo-400" : "text-slate-500"}`}>
              {step}
            </p>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 ${i < current ? "bg-green-500" : "bg-slate-700"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function AccountOpeningForm({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", dob: "", pan: "", aadhaar: "",
    bankName: "", accountNo: "", ifsc: "", nominee: "",
  });

  const update = (field, val) => setForm({ ...form, [field]: val });

  const next = () => {
    if (step === 0 && (!form.name || !form.email || !form.phone || !form.dob)) {
      return toast.error("Please fill all fields");
    }
    if (step === 1 && (!form.pan || !form.aadhaar)) {
      return toast.error("PAN and Aadhaar required");
    }
    if (step === 2 && (!form.bankName || !form.accountNo || !form.ifsc)) {
      return toast.error("Please fill all bank details");
    }
    if (step === 3) return onComplete(form);
    setStep(step + 1);
  };

  return (
    <div className="glass rounded-2xl p-8 max-w-xl mx-auto">
      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 0 — Personal Info */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-white font-bold text-xl mb-5">Personal Information</h2>
              {[
                { label: "Full Name", field: "name", icon: FiUser, placeholder: "Rahul Sharma" },
                { label: "Email Address", field: "email", icon: FiMail, placeholder: "rahul@example.com", type: "email" },
                { label: "Mobile Number", field: "phone", icon: FiPhone, placeholder: "9876543210" },
                { label: "Date of Birth", field: "dob", icon: FiUser, placeholder: "", type: "date" },
              ].map(({ label, field, icon: Icon, placeholder, type = "text" }) => (
                <div key={field}>
                  <label className="block text-slate-400 text-sm mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-3.5 text-slate-500" size={15} />
                    <input
                      type={type}
                      value={form[field]}
                      onChange={(e) => update(field, e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 1 — KYC */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-white font-bold text-xl mb-2">KYC Documents</h2>
              <p className="text-slate-400 text-sm mb-5">Your data is encrypted and stored securely</p>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 mb-4">
                <FiAlertCircle className="text-amber-400 shrink-0 mt-0.5" size={16} />
                <p className="text-amber-300 text-xs">This is a simulation — do NOT enter your real PAN or Aadhaar. Use dummy values for testing.</p>
              </div>

              {[
                { label: "PAN Number", field: "pan", placeholder: "ABCDE1234F", maxLength: 10 },
                { label: "Aadhaar Number", field: "aadhaar", placeholder: "XXXX XXXX XXXX", maxLength: 14 },
                { label: "Nominee Name (Optional)", field: "nominee", placeholder: "Parent / Spouse name" },
              ].map(({ label, field, placeholder, maxLength }) => (
                <div key={field}>
                  <label className="block text-slate-400 text-sm mb-1.5">{label}</label>
                  <div className="relative">
                    <FiFileText className="absolute left-3 top-3.5 text-slate-500" size={15} />
                    <input
                      type="text"
                      value={form[field]}
                      onChange={(e) => update(field, e.target.value.toUpperCase())}
                      placeholder={placeholder}
                      maxLength={maxLength}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              ))}

              <div className="glass rounded-xl p-4 mt-2">
                <p className="text-slate-400 text-xs mb-3">Upload Documents (Simulation)</p>
                <div className="grid grid-cols-2 gap-3">
                  {["PAN Card", "Aadhaar Card", "Photo", "Signature"].map((doc) => (
                    <div key={doc} onClick={() => toast.success(`${doc} uploaded ✓`)}
                      className="border-2 border-dashed border-slate-600 hover:border-indigo-500 rounded-lg p-3 text-center cursor-pointer transition">
                      <p className="text-slate-500 text-xs">📄 {doc}</p>
                      <p className="text-indigo-400 text-xs mt-1">Click to upload</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Bank Linking */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-white font-bold text-xl mb-5">Link Your Bank Account</h2>
              {[
                { label: "Bank Name", field: "bankName", placeholder: "HDFC Bank" },
                { label: "Account Number", field: "accountNo", placeholder: "Enter account number" },
                { label: "IFSC Code", field: "ifsc", placeholder: "HDFC0001234" },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-slate-400 text-sm mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => update(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              ))}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                <p className="text-indigo-300 text-xs">✓ Your bank account will be used for fund transfers and dividend credits</p>
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div>
              <h2 className="text-white font-bold text-xl mb-5">Review & Confirm</h2>
              <div className="space-y-3 mb-6">
                {[
                  { label: "Name", value: form.name },
                  { label: "Email", value: form.email },
                  { label: "Phone", value: form.phone },
                  { label: "PAN", value: form.pan },
                  { label: "Bank", value: form.bankName },
                  { label: "IFSC", value: form.ifsc },
                ].map(({ label, value }) => value && (
                  <div key={label} className="flex justify-between p-3 bg-slate-800/40 rounded-lg">
                    <span className="text-slate-400 text-sm">{label}</span>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
                <p className="text-green-400 text-sm">✓ All details verified. Click below to activate your Demat account.</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={next}
        className="w-full mt-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
      >
        {step === 3 ? "🎉 Activate Demat Account" : <>Next Step <FiArrowRight /></>}
      </button>
    </div>
  );
}

function DematDashboard({ accountInfo }) {
  const holdings = mockHoldings.map((h) => ({
    ...h,
    invested: h.qty * h.avgPrice,
    currentVal: h.qty * h.cmp,
    pnl: h.qty * (h.cmp - h.avgPrice),
    pnlPct: (((h.cmp - h.avgPrice) / h.avgPrice) * 100).toFixed(2),
  }));

  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.currentVal, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPct = ((totalPnL / totalInvested) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Account Header */}
      <div className="glass rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
            <FiUser className="text-indigo-400" size={22} />
          </div>
          <div>
            <p className="text-white font-bold">{accountInfo?.name || "Lucky Rewatkar"}</p>
            <p className="text-slate-400 text-xs">Demat A/C: IN301330•••4521 • DP: CDSL</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-medium">Active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Invested", value: `₹${(totalInvested / 1000).toFixed(1)}K`, icon: FiBarChart2, color: "indigo" },
          { label: "Current Value", value: `₹${(totalCurrent / 1000).toFixed(1)}K`, icon: FiPieChart, color: "cyan" },
          { label: "Total P&L", value: `${totalPnL >= 0 ? "+" : ""}₹${totalPnL.toFixed(0)}`, icon: totalPnL >= 0 ? FiTrendingUp : FiTrendingDown, color: totalPnL >= 0 ? "green" : "red" },
          { label: "Returns", value: `${totalPnLPct >= 0 ? "+" : ""}${totalPnLPct}%`, icon: FiTrendingUp, color: totalPnLPct >= 0 ? "green" : "red" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`glass rounded-xl p-4 border border-${color}-500/20`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-xs">{label}</p>
              <Icon className={`text-${color}-400`} size={16} />
            </div>
            <p className={`text-xl font-bold text-${color}-400`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Holdings Table */}
      <div className="glass rounded-xl p-5">
        <h2 className="text-white font-semibold mb-4">📊 My Holdings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs border-b border-slate-700/50">
                <th className="text-left pb-3">Stock</th>
                <th className="text-right pb-3">Qty</th>
                <th className="text-right pb-3">Avg Price</th>
                <th className="text-right pb-3">CMP</th>
                <th className="text-right pb-3">Invested</th>
                <th className="text-right pb-3">Current</th>
                <th className="text-right pb-3">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {holdings.map((h) => (
                <tr key={h.symbol} className="hover:bg-slate-800/30 transition">
                  <td className="py-3">
                    <p className="text-white font-semibold">{h.symbol}</p>
                    <p className="text-slate-500 text-xs">{h.sector}</p>
                  </td>
                  <td className="text-right text-white py-3">{h.qty}</td>
                  <td className="text-right text-slate-300 py-3">₹{h.avgPrice.toFixed(2)}</td>
                  <td className="text-right text-white py-3 font-medium">₹{h.cmp.toFixed(2)}</td>
                  <td className="text-right text-slate-300 py-3">₹{h.invested.toFixed(0)}</td>
                  <td className="text-right text-white py-3">₹{h.currentVal.toFixed(0)}</td>
                  <td className={`text-right py-3 font-semibold ${h.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {h.pnl >= 0 ? "+" : ""}₹{h.pnl.toFixed(0)}
                    <p className="text-xs font-normal">{h.pnlPct >= 0 ? "+" : ""}{h.pnlPct}%</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">🏦 Account Details</h2>
          <div className="space-y-2.5 text-sm">
            {[
              { label: "Demat Account No", value: "IN301330•••4521" },
              { label: "DP Name", value: "CDSL — Central Depository" },
              { label: "DP ID", value: "12034500" },
              { label: "Client ID", value: "•••4521" },
              { label: "Account Type", value: "Individual" },
              { label: "Status", value: "✅ Active" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">🔗 Connect Real Broker</h2>
          <p className="text-slate-400 text-sm mb-4">Open a real Demat account with India's top brokers:</p>
          <div className="space-y-3">
            {[
              { name: "Zerodha", desc: "₹0 equity delivery, ₹20 intraday", color: "indigo", url: "https://zerodha.com" },
              { name: "Upstox", desc: "₹0 delivery, ₹20 per order", color: "cyan", url: "https://upstox.com" },
              { name: "Angel One", desc: "Free delivery trades", color: "amber", url: "https://angelone.in" },
            ].map(({ name, desc, color, url }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                className={`flex items-center justify-between p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20 hover:bg-${color}-500/20 transition`}>
                <div>
                  <p className={`text-${color}-400 font-semibold text-sm`}>{name}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
                <FiArrowRight className={`text-${color}-400`} size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Demat() {
  const [hasAccount, setHasAccount] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);

  const handleAccountCreated = (info) => {
    setAccountInfo(info);
    setHasAccount(true);
    toast.success("🎉 Demat account activated successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Demat Account</h1>
          <span className="text-xs px-2.5 py-1 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30">
            Simulated
          </span>
        </div>
        <p className="text-slate-400">
          {hasAccount
            ? "Your simulated Demat account — track holdings, P&L, and portfolio performance"
            : "Open your simulated Demat account in minutes — practice without real money"}
        </p>
      </div>

      {!hasAccount ? (
        <div>
          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: "🛡️", title: "100% Safe", desc: "No real money involved" },
              { icon: "⚡", title: "Instant Setup", desc: "Account in 3 steps" },
              { icon: "📊", title: "Real UI", desc: "Just like real brokers" },
              { icon: "🔗", title: "Broker Connect", desc: "Link to real accounts" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="glass rounded-xl p-4 text-center">
                <p className="text-2xl mb-2">{icon}</p>
                <p className="text-white text-sm font-semibold">{title}</p>
                <p className="text-slate-500 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
          <AccountOpeningForm onComplete={handleAccountCreated} />
        </div>
      ) : (
        <DematDashboard accountInfo={accountInfo} />
      )}
    </div>
  );
}
