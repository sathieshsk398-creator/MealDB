import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
  LayoutDashboard,
  Utensils,
  LogOut,
  Plus,
} from "lucide-react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { useAdmin } from "../../contexts/AdminContext";
import { useCurrency } from "../../contexts/CurrencyContext";

const AdminHeader = () => {
  const { adminUser, adminLogout } = useAdminAuth();
  const { refreshData, lastRefreshed, resetToMockSeed } = useAdmin();
  const { currency, setCurrency, exchangeRate } = useCurrency();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const formattedTime = new Date(lastRefreshed).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    MealDB
                  </span>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Admin Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Live Operations & Analytics Console
                </p>
              </div>
            </Link>

            {/* Live System Indicator */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-full text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium">Storefront: Online</span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-slate-400">Synced {formattedTime}</span>
            </div>
          </div>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Currency Selector */}
            <div
              className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/80 text-xs font-bold"
              title={`Toggle currency (1 USD = ₹${exchangeRate})`}
            >
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  currency === "INR"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Add New Dish Action */}
            <Link
              to="/admin/add-dish"
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-sm shadow-emerald-500/20"
              title="Add a new dish to the menu catalog"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Add Dish</span>
            </Link>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-60"
              title="Refresh telemetry and order data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            {/* Return to Consumer Storefront */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Consumer Store</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Quick Admin Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-xl cursor-pointer text-left transition"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                    {adminUser?.name || "Shop Owner"}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono">isAdminLoggedIn: true</p>
                </div>
              </button>

              {/* Menu Popover */}
              {showSettings && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 space-y-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setShowSettings(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{adminUser?.name || "Shop Owner"}</p>
                    <p className="text-[11px] text-slate-400 truncate">{adminUser?.email || "Shop Owner Account"}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Shop Owner Portal</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetToMockSeed();
                      setShowSettings(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reset Mock Order Seeds</span>
                  </button>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        setShowSettings(false);
                        adminLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out Admin</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
