import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiCreditCard, FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import { RiBankLine } from "react-icons/ri";

const mockTransactions = [
  { id: 1, type: "credit", desc: "Salary Credit", amount: 50000, date: "10 Sep 2026", bank: "HDFC" },
  { id: 2, type: "debit", desc: "Stock Purchase - RELIANCE", amount: 12500, date: "09 Sep 2026", bank: "HDFC" },
  { id: 3, type: "credit", desc: "Dividend Received", amount: 1200, date: "07 Sep 2026", bank: "ICICI" },
  { id: 4, type: "debit", desc: "SIP - Axis Bluechip", amount: 5000, date: "05 Sep 2026", bank: "HDFC" },
  { id: 5, type: "debit", desc: "Mutual Fund Investment", amount: 10000, date: "02 Sep 2026", bank: "SBI" },
];

const linkedBanks = [
  { id: 1, name: "HDFC Bank", accountNo: "****4521", balance: 82500, type: "Savings" },
  { id: 2, name: "ICICI Bank", accountNo: "****7834", balance: 34200, type: "Current" },
];

export default function Banking() {
  const [showLink, setShowLink] = useState(false);
  const [form, setForm] = useState({ bank: "", accountNo: "", ifsc: "" });

  const handleLink = (e) => {
    e.preventDefault();
    toast.success("Bank account linked successfully!");
    setShowLink(false);
    setForm({ bank: "", accountNo: "", ifsc: "" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Banking</h1>
          <p className="text-slate-400 mt-1">Manage linked accounts and transaction history</p>
        </div>
        <button onClick={() => setShowLink(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition">
          <FiPlus size={16} /> Link Account
        </button>
      </div>

      {/* Linked Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {linkedBanks.map((b) => (
          <motion.div key={b.id} whileHover={{ scale: 1.01 }} className="glass rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <RiBankLine className="text-indigo-400" size={20} />
              </div>
              <div>
                <p className="text-white font-semibold">{b.name}</p>
                <p className="text-slate-500 text-xs">{b.type} • {b.accountNo}</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-white">₹{b.balance.toLocaleString()}</p>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 text-xs glass text-slate-300 hover:text-white rounded-lg transition">Deposit</button>
              <button className="flex-1 py-2 text-xs glass text-slate-300 hover:text-white rounded-lg transition">Withdraw</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transactions */}
      <div className="glass rounded-xl p-5">
        <h2 className="text-white font-semibold mb-4">Transaction History</h2>
        <div className="space-y-3">
          {mockTransactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.type === "credit" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                  {t.type === "credit" ? <FiArrowDownLeft className="text-green-400" size={16} /> : <FiArrowUpRight className="text-red-400" size={16} />}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.desc}</p>
                  <p className="text-slate-500 text-xs">{t.date} • {t.bank}</p>
                </div>
              </div>
              <p className={`font-semibold ${t.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Link Account Modal */}
      {showLink && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setShowLink(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-5">Link Bank Account</h2>
            <form onSubmit={handleLink} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Bank Name</label>
                <input value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} required placeholder="e.g. HDFC Bank" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Account Number</label>
                <input value={form.accountNo} onChange={(e) => setForm({ ...form, accountNo: e.target.value })} required placeholder="Enter account number" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">IFSC Code</label>
                <input value={form.ifsc} onChange={(e) => setForm({ ...form, ifsc: e.target.value })} required placeholder="e.g. HDFC0001234" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowLink(false)} className="flex-1 py-3 glass rounded-xl text-slate-400 hover:text-white transition text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition">Link Account</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
