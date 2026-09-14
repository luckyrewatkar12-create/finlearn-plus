import Link from "next/link";
import { motion } from "framer-motion";
import { FiTrendingUp, FiShield, FiBookOpen, FiAward, FiArrowRight } from "react-icons/fi";

const features = [
  { icon: FiBookOpen, title: "Learn Finance", desc: "Gamified modules covering stocks, mutual funds, SIP, and more.", color: "indigo", href: "/demo" },
  { icon: FiTrendingUp, title: "Trade Stocks", desc: "Real-time simulator with live market data and portfolio tracking.", color: "cyan", href: "/trading" },
  { icon: FiShield, title: "Demo Mode", desc: "Practice with ₹1,00,000 virtual currency — zero risk.", color: "green", href: "/demo" },
  { icon: FiAward, title: "Earn Badges", desc: "Unlock achievements as you complete learning milestones.", color: "amber", href: "/demo#badges" },
];

const modules = [
  { title: "Basics of Investing", level: "Beginner", modules: 8, color: "indigo", href: "/demo" },
  { title: "Stock Market 101", level: "Beginner", modules: 12, color: "cyan", href: "/trading" },
  { title: "Mutual Funds Deep Dive", level: "Intermediate", modules: 10, color: "amber", href: "/investments?tab=mf" },
  { title: "SIP & Long-term Wealth", level: "Intermediate", modules: 9, color: "green", href: "/investments?tab=sip" },
  { title: "Advanced Trading", level: "Advanced", modules: 15, color: "red", href: "/trading" },
  { title: "Portfolio Management", level: "Advanced", modules: 11, color: "purple", href: "/analytics" },
];

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* Live Demo Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-center py-2.5 px-4 text-sm font-medium">
        🌐 Live App →{" "}
        <a
          href="https://client-one-theta-27.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white/80 transition font-bold"
        >
          https://client-one-theta-27.vercel.app
        </a>
        {" "}— Open in any browser, share with anyone!
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30">
            🚀 India's #1 Financial Learning Platform
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <span className="gradient-text">Learn. Simulate.</span>
            <br />
            <span className="text-white">Invest Smart.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            FinLearn+ combines financial education, stock market simulation, and real investment tools
            in one powerful platform — built for India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold flex items-center gap-2 transition glow">
              Get Started Free <FiArrowRight />
            </Link>
            <Link href="/demo" className="px-8 py-4 glass text-white rounded-xl font-semibold hover:bg-white/10 transition">
              Try Demo Mode
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Everything you need to master finance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc, color, href }, i) => (
            <Link href={href} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.04, y: -4 }}
                className="glass rounded-xl p-6 hover:border-indigo-500/40 transition cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center mb-4 group-hover:bg-${color}-500/30 transition`}>
                  <Icon size={22} className={`text-${color}-400`} />
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-indigo-400 transition">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
                <p className={`text-${color}-400 text-xs mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition`}>
                  Explore <FiArrowRight size={11} />
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Learning Modules */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Learning Modules</h2>
          <Link href="/demo" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
            View all <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map(({ title, level, modules: count, href }, i) => (
            <Link href={href} key={i}>
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                className="glass rounded-xl p-5 cursor-pointer hover:border-indigo-500/40 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    level === "Beginner" ? "bg-green-500/20 text-green-400" :
                    level === "Intermediate" ? "bg-amber-500/20 text-amber-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>{level}</span>
                  <span className="text-xs text-slate-500">{count} lessons</span>
                </div>
                <h3 className="text-white font-semibold group-hover:text-indigo-400 transition">{title}</h3>
                <div className="mt-3 h-1.5 bg-slate-700 rounded-full">
                  <div className="h-full w-0 bg-indigo-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-slate-500 text-xs">0% complete</p>
                  <p className="text-indigo-400 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    Start <FiArrowRight size={11} />
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto glass rounded-2xl p-12 glow">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to start your financial journey?</h2>
          <p className="text-slate-400 mb-8">Join thousands of Indians building wealth the smart way.</p>
          <Link href="/signup" className="px-10 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold inline-flex items-center gap-2 transition">
            Create Free Account <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
