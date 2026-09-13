import { motion } from "framer-motion";

export default function StatCard({ title, value, change, icon: Icon, color = "indigo" }) {
  const colors = {
    indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 text-indigo-400",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400",
    green: "from-green-500/20 to-green-500/5 border-green-500/30 text-green-400",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400",
    red: "from-red-500/20 to-red-500/5 border-red-500/30 text-red-400",
  };

  const isPositive = change >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-5 transition-all`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? "▲" : "▼"} {Math.abs(change)}% this month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg bg-white/5`}>
            <Icon size={22} className={colors[color].split(" ").at(-1)} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
