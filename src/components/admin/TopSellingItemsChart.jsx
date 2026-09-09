import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
} from "recharts";
import { Flame, BarChart2, PieChart as PieIcon } from "lucide-react";
import { useAdmin } from "../../contexts/AdminContext";
import { useCurrency } from "../../contexts/CurrencyContext";

// Custom Tooltip for Top Dishes
const CustomDishTooltip = ({ active, payload, formatPrice }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 min-w-[150px]">
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.fill }} />
          <span className="font-bold text-white truncate max-w-[180px]">{data.name}</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Orders Fulfilled:</span>
          <span className="font-bold text-white font-mono">{data.orders} units</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Gross Volume:</span>
          <span className="font-bold text-emerald-400 font-mono">{formatPrice(data.revenue)}</span>
        </div>
        <div className="text-[10px] text-slate-500 pt-0.5">
          <span>Cuisine: Indian • {data.category}</span>
        </div>
      </div>
    );
  }
  return null;
};

const TopSellingItemsChart = () => {
  const { topIndianDishes, topItemsChartType, setTopItemsChartType } = useAdmin();
  const { formatPrice } = useCurrency();

  const totalIndianOrders = topIndianDishes.reduce((acc, curr) => acc + curr.orders, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header & Chart Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Top 5 Indian Dishes
            </h2>
            <span className="bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
              Most Ordered
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Highest volume Indian cuisines and meals from mock checkout data
          </p>
        </div>

        {/* Bar vs Pie Switch */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTopItemsChartType("bar")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              topItemsChartType === "bar"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Bar</span>
          </button>
          <button
            type="button"
            onClick={() => setTopItemsChartType("pie")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              topItemsChartType === "pie"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Pie</span>
          </button>
        </div>
      </div>

      {/* Visual Chart Area */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {topItemsChartType === "bar" ? (
            <BarChart
              data={topIndianDishes}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} opacity={0.5} />
              <XAxis
                type="number"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#64748b"
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                width={120}
                tickFormatter={(name) =>
                  name.length > 15 ? `${name.substring(0, 14)}…` : name
                }
              />
              <Tooltip content={<CustomDishTooltip formatPrice={formatPrice} />} />
              <Bar dataKey="orders" radius={[0, 8, 8, 0]} barSize={20}>
                {topIndianDishes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Tooltip content={<CustomDishTooltip formatPrice={formatPrice} />} />
              <Pie
                data={topIndianDishes}
                dataKey="orders"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
              >
                {topIndianDishes.map((entry, index) => (
                  <Cell key={`pie-cell-${index}`} fill={entry.fill || "#10b981"} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Top 5 Ranked List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2">
        {topIndianDishes.map((dish, rank) => {
          const sharePct =
            totalIndianOrders > 0
              ? Math.round((dish.orders / totalIndianOrders) * 100)
              : 20;

          return (
            <div
              key={dish.name}
              className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: dish.fill }}
                />
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  #{rank + 1}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white truncate" title={dish.name}>
                  {dish.name}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{dish.orders} orders</span>
                  <span className="font-mono text-emerald-400 font-semibold">{sharePct}%</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Revenue:</span>
                <span className="font-mono text-slate-200 font-bold">{formatPrice(dish.revenue)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopSellingItemsChart;
