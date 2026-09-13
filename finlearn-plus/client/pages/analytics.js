import PortfolioChart from "../components/charts/PortfolioChart";
import AllocationChart from "../components/charts/AllocationChart";
import ReturnsChart from "../components/charts/ReturnsChart";
import StatCard from "../components/ui/StatCard";
import { FiTrendingUp, FiBarChart2, FiPieChart, FiActivity } from "react-icons/fi";

const portfolioData = [
  { date: "Apr", value: 85000 }, { date: "May", value: 92000 },
  { date: "Jun", value: 88000 }, { date: "Jul", value: 105000 },
  { date: "Aug", value: 118000 }, { date: "Sep", value: 125000 },
];

const allocationData = [
  { name: "Stocks", value: 45 }, { name: "Mutual Funds", value: 25 },
  { name: "Bonds", value: 15 }, { name: "Cash", value: 10 }, { name: "SIP", value: 5 },
];

const returnsData = [
  { month: "Apr", return: 3.2 }, { month: "May", return: 8.1 },
  { month: "Jun", return: -4.3 }, { month: "Jul", return: 19.3 },
  { month: "Aug", return: 12.4 }, { month: "Sep", return: 5.9 },
];

export default function Analytics() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
      <p className="text-slate-400 mb-8">Deep insights into your portfolio performance</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Net Worth" value="₹1,25,000" change={8.5} icon={FiTrendingUp} color="indigo" />
        <StatCard title="Total Invested" value="₹1,00,000" icon={FiBarChart2} color="cyan" />
        <StatCard title="Unrealized P&L" value="+₹25,000" change={25} icon={FiPieChart} color="green" />
        <StatCard title="Risk Score" value="6.2/10" icon={FiActivity} color="amber" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Portfolio Growth</h2>
          <p className="text-slate-400 text-xs mb-4">Last 6 months</p>
          <PortfolioChart data={portfolioData} />
        </div>
        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Asset Allocation</h2>
          <p className="text-slate-400 text-xs mb-4">Current distribution</p>
          <AllocationChart data={allocationData} />
        </div>
      </div>

      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-1">Monthly Returns</h2>
        <p className="text-slate-400 text-xs mb-4">% gain/loss per month</p>
        <ReturnsChart data={returnsData} />
      </div>

      {/* Risk Breakdown */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Risk Analysis</h2>
        <div className="space-y-3">
          {[
            { label: "Market Risk", value: 65, color: "amber" },
            { label: "Concentration Risk", value: 40, color: "red" },
            { label: "Liquidity Risk", value: 20, color: "green" },
            { label: "Currency Risk", value: 10, color: "indigo" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">{label}</span>
                <span className={`text-${color}-400 font-medium`}>{value}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full">
                <div className={`h-full bg-${color}-500 rounded-full transition-all`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
