import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { useAdmin } from "../../contexts/AdminContext";
import { useCurrency } from "../../contexts/CurrencyContext";

// Custom Tooltip for Recharts
const CustomRevenueTooltip = ({ active, payload, formatPrice }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[160px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
          <span className="font-bold text-white text-sm">{data.date}</span>
          <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
            {data.day}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Daily Revenue:</span>
          <span className="font-bold text-emerald-400 font-mono text-sm">
            {formatPrice(data.revenue)}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Order Volume:</span>
          <span className="font-semibold text-white font-mono">{data.orders} orders</span>
        </div>
        <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
          <span>Avg. Ticket:</span>
          <span className="font-mono text-slate-200">{formatPrice(data.avgTicket)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  const {
    dailyRevenueData,
    activeChartMetric,
    setActiveChartMetric,
    chartType,
    setChartType,
  } = useAdmin();
  const { currency, formatPrice } = useCurrency();

  const chartData = useMemo(() => {
    return dailyRevenueData.map((d) => ({
      ...d,
      displayRevenue:
        currency === "USD"
          ? parseFloat((d.revenue / 94.5).toFixed(2))
          : Math.round(d.revenue),
    }));
  }, [dailyRevenueData, currency]);

  const total7DayRevenue = dailyRevenueData.reduce((acc, curr) => acc + curr.revenue, 0);
  const total7DayOrders = dailyRevenueData.reduce((acc, curr) => acc + curr.orders, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Daily Revenue Trend
            </h2>
            <span className="bg-slate-800 text-slate-400 text-[11px] font-mono px-2 py-0.5 rounded-full border border-slate-700">
              Past 7 Days
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated daily checkout intake across the store network
          </p>
        </div>

        {/* Action Toggles */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Metric Selector (Revenue vs Orders) */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveChartMetric("revenue")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartMetric === "revenue"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Revenue</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveChartMetric("orders")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartMetric === "orders"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Orders</span>
            </button>
          </div>

          {/* Chart View (Area vs Line) */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-semibold">
            <button
              type="button"
              onClick={() => setChartType("area")}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === "area"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Area
            </button>
            <button
              type="button"
              onClick={() => setChartType("line")}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === "line"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Performance Quick Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">7-Day Revenue</span>
          <span className="font-bold text-emerald-400 font-mono text-sm sm:text-base">
            {formatPrice(total7DayRevenue)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">7-Day Orders</span>
          <span className="font-bold text-white font-mono text-sm sm:text-base">
            {total7DayOrders} orders
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-slate-500 block text-[11px]">Daily Average</span>
          <span className="font-bold text-slate-200 font-mono text-sm sm:text-base">
            {formatPrice(total7DayRevenue / 7)} / day
          </span>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                tickFormatter={(val) => {
                  if (activeChartMetric !== "revenue") return `${val}`;
                  if (currency === "USD") return `$${val}`;
                  return val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`;
                }}
              />
              <Tooltip content={<CustomRevenueTooltip formatPrice={formatPrice} />} />
              {activeChartMetric === "revenue" ? (
                <Area
                  type="monotone"
                  dataKey="displayRevenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                  name={`Revenue (${currency === "USD" ? "$" : "₹"})`}
                  activeDot={{ r: 6, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                />
              ) : (
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#ordersGrad)"
                  name="Orders"
                  activeDot={{ r: 6, fill: "#0ea5e9", stroke: "#ffffff", strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          ) : (
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                tickFormatter={(val) => {
                  if (activeChartMetric !== "revenue") return `${val}`;
                  if (currency === "USD") return `$${val}`;
                  return val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`;
                }}
              />
              <Tooltip content={<CustomRevenueTooltip formatPrice={formatPrice} />} />
              {activeChartMetric === "revenue" ? (
                <Line
                  type="monotone"
                  dataKey="displayRevenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 1 }}
                  activeDot={{ r: 7, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                  name={`Revenue (${currency === "USD" ? "$" : "₹"})`}
                />
              ) : (
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 1 }}
                  activeDot={{ r: 7, fill: "#0ea5e9", stroke: "#ffffff", strokeWidth: 2 }}
                  name="Orders"
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
