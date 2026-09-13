import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/ui/StatCard";
import PortfolioChart from "../components/charts/PortfolioChart";
import AllocationChart from "../components/charts/AllocationChart";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { FiDollarSign, FiTrendingUp, FiPieChart, FiAward } from "react-icons/fi";
import { getPortfolio, getWallet, getLearningProgress } from "../utils/api";

const mockPortfolioData = [
  { date: "Apr", value: 85000 }, { date: "May", value: 92000 },
  { date: "Jun", value: 88000 }, { date: "Jul", value: 105000 },
  { date: "Aug", value: 118000 }, { date: "Sep", value: 125000 },
];

const mockAllocation = [
  { name: "Stocks", value: 45 }, { name: "Mutual Funds", value: 25 },
  { name: "Bonds", value: 15 }, { name: "Cash", value: 10 }, { name: "SIP", value: 5 },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [progress, setProgress] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      Promise.all([getWallet(), getPortfolio(), getLearningProgress()])
        .then(([w, p, lp]) => {
          setWallet(w.data);
          setPortfolio(p.data);
          setProgress(lp.data);
        })
        .catch(() => {})
        .finally(() => setDataLoading(false));
    }
  }, [user]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Good morning, {user.name?.split(" ")[0]} 👋</h1>
        <p className="text-slate-400 mt-1">Here's your financial overview for today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Virtual Balance" value={`₹${wallet?.virtualBalance?.toLocaleString() || "1,00,000"}`} change={2.4} icon={FiDollarSign} color="indigo" />
        <StatCard title="Portfolio Value" value={`₹${portfolio?.totalValue?.toLocaleString() || "1,25,000"}`} change={5.8} icon={FiTrendingUp} color="cyan" />
        <StatCard title="Total Returns" value={`+₹${portfolio?.totalReturns?.toLocaleString() || "25,000"}`} change={8.2} icon={FiPieChart} color="green" />
        <StatCard title="Badges Earned" value={progress?.badges || 4} icon={FiAward} color="amber" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Portfolio Performance</h2>
          <PortfolioChart data={mockPortfolioData} />
        </div>
        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Asset Allocation</h2>
          <AllocationChart data={mockAllocation} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Buy Stock", href: "/trading", color: "indigo" },
            { label: "Start SIP", href: "/investments", color: "cyan" },
            { label: "Practice Demo", href: "/demo", color: "green" },
            { label: "View Analytics", href: "/analytics", color: "amber" },
          ].map(({ label, href, color }) => (
            <a key={href} href={href} className={`p-4 rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 text-center text-sm font-medium hover:bg-${color}-500/20 transition`}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
