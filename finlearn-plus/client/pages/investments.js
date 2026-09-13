import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const mutualFunds = [
  { id: 1, name: "Axis Bluechip Fund", category: "Large Cap", returns1Y: 15.2, returns3Y: 18.5, risk: "Low", minSIP: 500 },
  { id: 2, name: "Mirae Asset Emerging Bluechip", category: "Large & Mid Cap", returns1Y: 22.1, returns3Y: 24.3, risk: "Medium", minSIP: 1000 },
  { id: 3, name: "Parag Parikh Flexi Cap", category: "Flexi Cap", returns1Y: 19.8, returns3Y: 21.7, risk: "Medium", minSIP: 1000 },
  { id: 4, name: "Quant Small Cap Fund", category: "Small Cap", returns1Y: 35.4, returns3Y: 42.1, risk: "High", minSIP: 1000 },
];

const bonds = [
  { id: 1, name: "RBI Floating Rate Bond", type: "Government", rate: 7.35, tenure: "7 years", minInvest: 1000 },
  { id: 2, name: "HDFC Corporate Bond", type: "Corporate", rate: 8.2, tenure: "5 years", minInvest: 5000 },
  { id: 3, name: "Sovereign Gold Bond", type: "Government", rate: 2.5, tenure: "8 years", minInvest: 5000 },
];

function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const months = years * 12;
  const r = rate / 100 / 12;
  const maturity = monthly * (((1 + r) ** months - 1) / r) * (1 + r);
  const invested = monthly * months;
  const gains = maturity - invested;

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-white font-semibold mb-5">SIP Calculator</h2>
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Monthly Investment</span>
            <span className="text-white font-medium">₹{monthly.toLocaleString()}</span>
          </div>
          <input type="range" min="500" max="100000" step="500" value={monthly} onChange={(e) => setMonthly(+e.target.value)} className="w-full accent-indigo-500" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Time Period</span>
            <span className="text-white font-medium">{years} years</span>
          </div>
          <input type="range" min="1" max="30" value={years} onChange={(e) => setYears(+e.target.value)} className="w-full accent-indigo-500" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Expected Return Rate</span>
            <span className="text-white font-medium">{rate}% p.a.</span>
          </div>
          <input type="range" min="6" max="30" step="0.5" value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full accent-indigo-500" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-slate-400 text-xs mb-1">Invested</p>
          <p className="text-white font-bold">₹{(invested / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
          <p className="text-slate-400 text-xs mb-1">Est. Gains</p>
          <p className="text-indigo-400 font-bold">₹{(gains / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <p className="text-slate-400 text-xs mb-1">Maturity</p>
          <p className="text-green-400 font-bold">₹{(maturity / 100000).toFixed(1)}L</p>
        </div>
      </div>
    </div>
  );
}

export default function Investments() {
  const [tab, setTab] = useState("mf");

  const riskColor = { Low: "green", Medium: "amber", High: "red" };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Investments</h1>
      <p className="text-slate-400 mb-8">Mutual funds, bonds, and SIP planning tools</p>

      <div className="flex gap-3 mb-6">
        {[["mf", "Mutual Funds"], ["bonds", "Bonds"], ["sip", "SIP Calculator"]].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === val ? "bg-indigo-500 text-white" : "glass text-slate-400 hover:text-white"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "mf" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mutualFunds.map((f) => (
            <motion.div key={f.id} whileHover={{ scale: 1.01 }} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{f.name}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{f.category}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full bg-${riskColor[f.risk]}-500/20 text-${riskColor[f.risk]}-400`}>{f.risk} Risk</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                <div><p className="text-slate-500 text-xs">1Y Returns</p><p className="text-green-400 font-semibold">+{f.returns1Y}%</p></div>
                <div><p className="text-slate-500 text-xs">3Y Returns</p><p className="text-green-400 font-semibold">+{f.returns3Y}%</p></div>
                <div><p className="text-slate-500 text-xs">Min SIP</p><p className="text-white font-semibold">₹{f.minSIP}</p></div>
              </div>
              <button onClick={() => toast.success(`SIP started for ${f.name}`)} className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg text-sm font-medium transition">
                Start SIP
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "bonds" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bonds.map((b) => (
            <motion.div key={b.id} whileHover={{ scale: 1.01 }} className="glass rounded-xl p-5">
              <span className={`text-xs px-2 py-1 rounded-full ${b.type === "Government" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>{b.type}</span>
              <h3 className="text-white font-semibold mt-3 mb-3">{b.name}</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-slate-400">Interest Rate</span><span className="text-cyan-400 font-semibold">{b.rate}% p.a.</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Tenure</span><span className="text-white">{b.tenure}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Min Investment</span><span className="text-white">₹{b.minInvest}</span></div>
              </div>
              <button onClick={() => toast.success(`Invested in ${b.name}`)} className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition">
                Invest Now
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "sip" && <SIPCalculator />}
    </div>
  );
}
