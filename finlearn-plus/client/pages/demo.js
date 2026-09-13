import { useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiCheckCircle, FiAward, FiPlay } from "react-icons/fi";
import toast from "react-hot-toast";

const modules = [
  {
    id: 1, title: "What is Investing?", lessons: 5, xp: 100, unlocked: true,
    content: "Investing means putting your money to work to generate returns over time. Unlike saving, investing involves some risk but offers higher potential rewards.",
  },
  {
    id: 2, title: "Understanding Stocks", lessons: 8, xp: 150, unlocked: true,
    content: "A stock represents ownership in a company. When you buy a stock, you become a partial owner (shareholder). Stock prices fluctuate based on company performance and market sentiment.",
  },
  {
    id: 3, title: "Mutual Funds Explained", lessons: 7, xp: 150, unlocked: false,
    content: "A mutual fund pools money from many investors to invest in a diversified portfolio of stocks, bonds, or other securities managed by a professional fund manager.",
  },
  {
    id: 4, title: "SIP — Systematic Investment Plan", lessons: 6, xp: 200, unlocked: false,
    content: "SIP allows you to invest a fixed amount regularly (monthly) in a mutual fund. It leverages rupee cost averaging and compounding to build wealth over time.",
  },
  {
    id: 5, title: "Risk & Diversification", lessons: 9, xp: 250, unlocked: false,
    content: "Risk is the possibility of losing money. Diversification spreads investments across assets to reduce risk. Never put all your eggs in one basket!",
  },
  {
    id: 6, title: "Reading Financial Statements", lessons: 10, xp: 300, unlocked: false,
    content: "Financial statements reveal a company's health. Key ones: Income Statement (revenue & profit), Balance Sheet (assets & liabilities), Cash Flow Statement.",
  },
];

export default function Demo() {
  const [activeModule, setActiveModule] = useState(null);
  const [completed, setCompleted] = useState([1]);
  const [virtualBalance] = useState(100000);

  const completeModule = (id) => {
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
      const m = modules.find((m) => m.id === id);
      toast.success(`🎉 Module completed! +${m.xp} XP earned`);
    }
    setActiveModule(null);
  };

  const totalXP = completed.reduce((sum, id) => {
    const m = modules.find((m) => m.id === id);
    return sum + (m?.xp || 0);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Beginner Demo Mode</h1>
          <p className="text-slate-400 mt-1">Learn, practice, and earn XP — zero real money involved</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-slate-400 text-xs mb-1">Virtual Balance</p>
          <p className="text-2xl font-bold text-indigo-400">₹{virtualBalance.toLocaleString()}</p>
          <p className="text-amber-400 text-sm mt-1">⚡ {totalXP} XP</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Overall Progress</span>
          <span className="text-white text-sm font-medium">{completed.length}/{modules.length} modules</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completed.length / modules.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-amber-400 text-sm"><FiAward size={14} /> {totalXP} XP earned</div>
          <div className="flex items-center gap-1.5 text-green-400 text-sm"><FiCheckCircle size={14} /> {completed.length} completed</div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((m) => {
          const isCompleted = completed.includes(m.id);
          const isLocked = !m.unlocked && m.id > 2 && !completed.includes(m.id - 1);

          return (
            <motion.div
              key={m.id}
              whileHover={!isLocked ? { scale: 1.02 } : {}}
              className={`glass rounded-xl p-5 transition ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-indigo-500/40"}`}
              onClick={() => !isLocked && setActiveModule(m)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-slate-500">{m.lessons} lessons</span>
                {isCompleted ? (
                  <FiCheckCircle className="text-green-400" size={18} />
                ) : isLocked ? (
                  <FiLock className="text-slate-600" size={16} />
                ) : (
                  <span className="text-xs text-amber-400">+{m.xp} XP</span>
                )}
              </div>
              <h3 className={`font-semibold ${isCompleted ? "text-green-400" : "text-white"}`}>{m.title}</h3>
              {isCompleted && <p className="text-green-400/70 text-xs mt-2">✓ Completed</p>}
              {!isLocked && !isCompleted && (
                <button className="mt-3 flex items-center gap-1.5 text-indigo-400 text-xs hover:text-indigo-300">
                  <FiPlay size={12} /> Start Learning
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Module Modal */}
      {activeModule && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setActiveModule(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-8 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-2">{activeModule.title}</h2>
            <p className="text-slate-400 text-sm mb-6">{activeModule.lessons} lessons • +{activeModule.xp} XP</p>
            <div className="bg-slate-800/50 rounded-xl p-5 mb-6">
              <p className="text-slate-300 leading-relaxed">{activeModule.content}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setActiveModule(null)} className="flex-1 py-3 glass rounded-xl text-slate-400 hover:text-white transition text-sm">
                Back
              </button>
              <button onClick={() => completeModule(activeModule.id)} className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition text-sm">
                Complete Module 🎉
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
