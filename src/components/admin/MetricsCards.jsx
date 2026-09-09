import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, Award } from "lucide-react";
import { useAdmin } from "../../contexts/AdminContext";
import { useCurrency } from "../../contexts/CurrencyContext";

const MetricsCards = () => {
  const { metrics } = useAdmin();
  const { formatPrice } = useCurrency();
  const { totalRevenue, totalOrders, activeUsers, avgOrderValue } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Total Revenue Card */}
      <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80" />

        <div className="flex items-center justify-between pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Total Revenue
          </span>
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {formatPrice(totalRevenue)}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated gross checkout receipts
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4%</span>
          </span>
          <span className="text-slate-500 text-[11px]">vs. previous 7-day period</span>
        </div>
      </div>

      {/* 2. Total Orders Card */}
      <div className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-500 opacity-80" />

        <div className="flex items-center justify-between pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Total Orders
          </span>
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {totalOrders.toLocaleString()}
            </h3>
            <span className="text-xs text-slate-400 font-medium">transactions</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fulfilled and active checkout orders
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 font-semibold text-sky-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2%</span>
          </span>
          <span className="text-slate-500 text-[11px]">Consistent order velocity</span>
        </div>
      </div>

      {/* 3. Active Users Card */}
      <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-80" />

        <div className="flex items-center justify-between pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Active Users
          </span>
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeUsers.toLocaleString()}
            </h3>
            <span className="text-xs text-slate-400 font-medium">accounts</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Registered customers with checkout activity
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 font-semibold text-purple-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>94.8%</span>
          </span>
          <span className="text-slate-500 text-[11px]">Customer repeat rate</span>
        </div>
      </div>

      {/* 4. Average Order Value Card (Enriches the 3 core metrics) */}
      <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400 opacity-80" />

        <div className="flex items-center justify-between pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Avg. Order Value (AOV)
          </span>
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {formatPrice(avgOrderValue)}
            </h3>
            <span className="text-xs text-slate-400 font-medium">per checkout</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Net average transaction basket size
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Healthy</span>
          </span>
          <span className="text-slate-500 text-[11px]">Optimized for multi-item carts</span>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
