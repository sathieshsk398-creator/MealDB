import { useState } from "react";
import {
  Search,
  CheckCircle2,
  Bike,
  Clock,
  Copy,
  Check,
  Eye,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  Utensils,
  Receipt,
} from "lucide-react";
import { useAdmin } from "../../contexts/AdminContext";
import { useCurrency } from "../../contexts/CurrencyContext";

const RecentOrdersTable = () => {
  const { recentOrders, updateOrderStatus } = useAdmin();
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter 10 most recent orders based on search / status
  const filteredOrders = recentOrders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = (order.id || "").toLowerCase().includes(q);
      const matchEmail = (order.userEmail || "").toLowerCase().includes(q);
      const matchUser = (order.userName || "").toLowerCase().includes(q);
      const matchItem = order.items?.some((it) => (it.strMeal || "").toLowerCase().includes(q));
      return matchId || matchEmail || matchUser || matchItem;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case "In Transit":
      case "Out for Delivery":
        return (
          <span className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold px-2.5 py-1 rounded-full text-xs">
            <Bike className="w-3.5 h-3.5 animate-pulse" />
            <span>In Transit</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-full text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{status || "Processing"}</span>
          </span>
        );
    }
  };

  const getPaymentIcon = (method) => {
    if (method === "Cash on Delivery") return <Banknote className="w-3.5 h-3.5 text-amber-400" />;
    if (method === "Credit/Debit Card") return <CreditCard className="w-3.5 h-3.5 text-blue-400" />;
    return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-4 p-5 sm:p-6">
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recent Transactions
            </h2>
            <span className="bg-slate-800 text-slate-400 text-xs font-mono px-2.5 py-0.5 rounded-full border border-slate-700">
              10 Most Recent
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of latest customer checkouts from localStorage
          </p>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or email..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-semibold">
            {["all", "Delivered", "In Transit", "Preparing"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {st === "all" ? "All" : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-5 sm:mx-0 rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider font-mono text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="py-3.5 px-4">Order ID</th>
              <th scope="col" className="py-3.5 px-4">User Email</th>
              <th scope="col" className="py-3.5 px-4">Amount</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4 hidden md:table-cell">Purchase Date</th>
              <th scope="col" className="py-3.5 px-4 hidden lg:table-cell">Payment</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="font-semibold text-sm">No transactions match criteria</p>
                  <p className="text-xs text-slate-600 mt-0.5">Try resetting search or filters</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  {/* Order ID */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {order.id}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(order.id);
                        }}
                        className="text-slate-500 hover:text-slate-300 p-1 rounded transition cursor-pointer"
                        title="Copy Order ID"
                      >
                        {copiedId === order.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* User Email */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <span className="font-medium text-slate-200 block truncate max-w-[200px]">
                        {order.userEmail}
                      </span>
                      {order.userName && (
                        <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">
                          {order.userName}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <span className="font-mono font-bold text-white text-sm block">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {order.totalCount || order.items?.length || 1} items
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>

                  {/* Purchase Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap hidden md:table-cell text-slate-400 font-mono text-[11px]">
                    {order.purchaseDate || order.placedAt || "Recent"}
                  </td>

                  {/* Payment */}
                  <td className="py-3.5 px-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      {getPaymentIcon(order.paymentMethod)}
                      <span>{order.paymentMethod || "UPI"}</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/40 px-2.5 py-1 rounded-lg transition font-medium cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal for Selected Order */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5 text-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Transaction Details
                </span>
                <h3 className="text-lg font-bold text-white font-mono mt-0.5">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status & Customer Card */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Customer</span>
                <span className="font-bold text-white truncate block">{selectedOrder.userName || "Customer"}</span>
                <span className="text-slate-400 text-[11px] truncate block">{selectedOrder.userEmail}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Current Status</span>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Delivery Destination</span>
                <span className="text-slate-400">{selectedOrder.deliveryAddress || "Standard Address"}</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ordered Dishes</span>
              </div>

              <div className="divide-y divide-slate-800/80 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.strMealThumb && (
                        <img
                          src={item.strMealThumb}
                          alt={item.strMeal}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 truncate">{item.strMeal}</p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity} × {formatPrice(item.price || 12)}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white shrink-0">
                      {formatPrice((item.price || 12) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Items Subtotal</span>
                <span className="font-mono">{formatPrice(selectedOrder.itemTotal || selectedOrder.totalAmount - 2.99)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Delivery & Logistics Fee</span>
                <span className="font-mono">{formatPrice(selectedOrder.deliveryFee || 2.99)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Payment Method</span>
                <span className="font-mono text-slate-200 font-semibold">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-white font-bold text-sm pt-2 border-t border-slate-800">
                <span>Total Amount Paid</span>
                <span className="text-emerald-400 font-mono text-base font-black">
                  {formatPrice(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            {/* Status Override Action for Operator */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Change Status:</span>
              <div className="flex items-center gap-1.5">
                {["Preparing", "In Transit", "Delivered"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, st);
                      setSelectedOrder((prev) => ({ ...prev, status: st }));
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      selectedOrder.status === st
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;
