import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { FiHome, FiTrendingUp, FiPieChart, FiCreditCard, FiBarChart2, FiBookOpen, FiLogOut, FiUser } from "react-icons/fi";
import { RiBankLine, RiStockLine } from "react-icons/ri";

const navLinks = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/demo", label: "Demo", icon: FiBookOpen },
  { href: "/trading", label: "Trading", icon: FiTrendingUp },
  { href: "/demat", label: "Demat", icon: RiStockLine },
  { href: "/investments", label: "Invest", icon: FiPieChart },
  { href: "/banking", label: "Banking", icon: RiBankLine },
  { href: "/payments", label: "Payments", icon: FiCreditCard },
  { href: "/analytics", label: "Analytics", icon: FiBarChart2 },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">F+</div>
            <span className="gradient-text font-bold text-xl">FinLearn+</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  router.pathname === href
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition">
                  <div className="w-8 h-8 bg-indigo-500/30 rounded-full flex items-center justify-center">
                    <FiUser size={14} />
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-danger hover:bg-danger/10 transition"
                >
                  <FiLogOut size={15} />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition">Login</Link>
                <Link href="/signup" className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition font-medium">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
