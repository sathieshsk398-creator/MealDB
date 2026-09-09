import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  RotateCcw,
  CheckCircle2,
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  Search,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ArrowRight,
  Bike,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useCurrency } from "../contexts/CurrencyContext";
import {
  getOrderHistory,
  getActiveOrderStorageKey,
  saveOrderToHistory,
} from "../utils/orderStorage";

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const { addItemsToCart, totalCount: activeCartCount } = useCart();
  const { formatPrice } = useCurrency();

  const userEmail = currentUser?.email?.toLowerCase()?.trim() || null;
  const userName = currentUser?.name || "Customer";

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // 'all' | 'recent' | 'online' | 'cod'
  const [copiedId, setCopiedId] = useState(null);
  const [expandedReceipts, setExpandedReceipts] = useState({});
  const [reorderNotification, setReorderNotification] = useState(null);
  const [currentTimestamp] = useState(() => Date.now());

  // Active in-transit order if any
  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      const activeKey = getActiveOrderStorageKey(userEmail);
      const raw = localStorage.getItem(activeKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Past completed orders list from localStorage
  const [orders, setOrders] = useState(() => {
    return getOrderHistory(userEmail, userName);
  });

  // Keep synced with localStorage events
  useEffect(() => {
    const syncOrdersFromStorage = () => {
      const activeKey = getActiveOrderStorageKey(userEmail);
      try {
        const rawActive = localStorage.getItem(activeKey);
        const parsedActive = rawActive ? JSON.parse(rawActive) : null;
        setActiveOrder(parsedActive);

        if (parsedActive && parsedActive.statusIndex >= 3) {
          saveOrderToHistory(parsedActive, userEmail);
        }
      } catch (err) {
        console.error("Error reading active order", err);
      }

      const updatedHistory = getOrderHistory(userEmail, userName);
      setOrders(updatedHistory);
    };

    window.addEventListener("storage", syncOrdersFromStorage);

    return () => {
      window.removeEventListener("storage", syncOrdersFromStorage);
    };
  }, [userEmail, userName]);

  // Handle Order ID copy
  const handleCopyOrderId = (id) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle receipt dropdown
  const toggleReceipt = (orderId) => {
    setExpandedReceipts((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Handle Reorder: batch adds items back into active cart and alerts user
  const handleReorder = (order) => {
    if (!order || !order.items || order.items.length === 0) return;

    const success = addItemsToCart(order.items);
    if (success) {
      const itemCount = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setReorderNotification({
        orderId: order.id,
        itemCount,
        firstItemName: order.items[0]?.strMeal || "Delicious meals",
      });

      // Auto dismiss after 8 seconds
      setTimeout(() => {
        setReorderNotification(null);
      }, 8000);
    }
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter: Order ID, dish names, categories
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatches = order.id?.toLowerCase().includes(q);
        const itemMatches = order.items?.some(
          (item) =>
            item.strMeal?.toLowerCase().includes(q) ||
            item.strCategory?.toLowerCase().includes(q) ||
            item.strArea?.toLowerCase().includes(q)
        );
        const addressMatches = order.deliveryAddress?.toLowerCase().includes(q);
        if (!idMatches && !itemMatches && !addressMatches) return false;
      }

      // Filter chips
      if (selectedFilter === "online") {
        return order.paymentMethod === "UPI" || order.paymentMethod === "Credit/Debit Card";
      }
      if (selectedFilter === "cod") {
        return order.paymentMethod === "Cash on Delivery";
      }
      if (selectedFilter === "recent") {
        // Within last 7 days or first 2 orders
        const sevenDaysAgo = currentTimestamp - 7 * 86400000;
        return (order.completedAt || order.createdAt || 0) >= sevenDaysAgo;
      }

      return true;
    });
  }, [orders, searchQuery, selectedFilter, currentTimestamp]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                <Clock className="w-4 h-4" />
                <span>My Account</span>
                <span>•</span>
                <span>Purchase History</span>
              </div>
              <div className="flex items-baseline gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Past Orders
                </h1>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {orders.length} {orders.length === 1 ? "order" : "orders"} placed
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1 max-w-xl">
                Browse through past completed meals, inspect detailed billing receipts, and
                instantly reorder dishes back into your cart.
              </p>
            </div>

            {/* Quick action: Jump to cart if items exist */}
            {activeCartCount > 0 && (
              <Link
                to="/cart"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs border border-emerald-200 transition shadow-2xs self-start md:self-auto"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Active Cart ({activeCartCount} items)</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Floating Success Reorder Notification */}
        {reorderNotification && (
          <div className="bg-emerald-700 text-white rounded-2xl p-4 sm:p-5 shadow-xl shadow-emerald-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-800 rounded-xl shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <p className="font-bold text-sm">
                  Reordered {reorderNotification.itemCount} items from #{reorderNotification.orderId}!
                </p>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Added to your active cart. You can review quantities or proceed to checkout now.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => setReorderNotification(null)}
                className="p-1.5 text-emerald-200 hover:text-white transition cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <span>View Cart ({activeCartCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Active Order Banner if an order is currently in-transit */}
        {activeOrder && activeOrder.statusIndex < 3 && (
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-emerald-700/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-xs shrink-0">
                <Bike className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded text-emerald-50">
                    Live Order in Transit
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    #{activeOrder.id}
                  </span>
                </div>
                <h3 className="font-bold text-base text-white mt-1">
                  Status: {activeOrder.status || "On the way"}
                </h3>
                <p className="text-xs text-emerald-100">
                  {activeOrder.totalCount} items • Total: {formatPrice(activeOrder.totalAmount)}
                </p>
              </div>
            </div>
            <Link
              to="/order-tracking"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-md transition self-stretch sm:self-auto justify-center cursor-pointer"
            >
              <span>Track Live Status</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by meal name, category, or order ID (#SW-...)"
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedFilter === "all"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-gray-100 hover:bg-gray-200/70 text-gray-700"
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setSelectedFilter("recent")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedFilter === "recent"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-gray-100 hover:bg-gray-200/70 text-gray-700"
              }`}
            >
              Recent (7 Days)
            </button>
            <button
              onClick={() => setSelectedFilter("online")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedFilter === "online"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-gray-100 hover:bg-gray-200/70 text-gray-700"
              }`}
            >
              Paid Online
            </button>
            <button
              onClick={() => setSelectedFilter("cod")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedFilter === "cod"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-gray-100 hover:bg-gray-200/70 text-gray-700"
              }`}
            >
              Cash on Delivery
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 border border-emerald-100">
              <UtensilsCrossed className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {searchQuery ? "No matching orders found" : "No past orders yet"}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
              {searchQuery
                ? `We couldn't find any orders matching "${searchQuery}". Try searching for another meal or clear your filter.`
                : "Explore our rich menu of authentic dishes from around the world and place your first food delivery order!"}
            </p>
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                }}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Clear Search Filter
              </button>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-700/20 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Meals Menu</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const isReceiptExpanded = !!expandedReceipts[order.id];
              const itemCount =
                order.totalCount ||
                order.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) ||
                order.items?.length ||
                1;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Card Header: Order ID, Date of Purchase, Status & Total Paid */}
                  <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Order ID, Copy button, and Date */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
                            #{order.id}
                          </span>
                          <button
                            onClick={() => handleCopyOrderId(order.id)}
                            className="p-1 text-gray-400 hover:text-emerald-700 transition cursor-pointer"
                            title="Copy Order ID"
                          >
                            {copiedId === order.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{order.status || "Delivered"}</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>Purchased on {order.purchaseDate || order.placedAt || "Recently"}</span>
                        </p>
                      </div>

                      {/* Right: Total Amount Paid & Payment Method Badge */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-gray-400 block sm:hidden">
                            Total Paid
                          </span>
                          <span className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>

                        {/* Payment mode chip */}
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-700 bg-white border border-gray-200/80 px-2 py-0.5 rounded-lg shadow-2xs">
                          {order.paymentMethod === "Credit/Debit Card" && (
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          {order.paymentMethod === "UPI" && (
                            <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                          )}
                          {(!order.paymentMethod || order.paymentMethod === "Cash on Delivery") && (
                            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          <span>{order.paymentMethod || "Cash on Delivery"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Items Preview List */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => {
                        const itemQty = item.quantity || 1;
                        const itemPrice = typeof item.price === "number" ? item.price : 9.99;

                        return (
                          <div
                            key={`${order.id}-item-${item.idMeal || idx}`}
                            className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                          >
                            {/* Meal image & details */}
                            <div className="flex items-center gap-3 min-w-0">
                              <Link
                                to={`/meal/${item.idMeal}`}
                                className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 group block"
                                title="View meal details"
                              >
                                <img
                                  src={item.strMealThumb}
                                  alt={item.strMeal}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </Link>
                              <div className="min-w-0">
                                <Link
                                  to={`/meal/${item.idMeal}`}
                                  className="font-bold text-sm text-gray-900 hover:text-emerald-700 transition flex items-center gap-1 truncate"
                                >
                                  <span className="truncate">{item.strMeal}</span>
                                  <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 shrink-0" />
                                </Link>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                                    Qty: {itemQty}
                                  </span>
                                  {item.strCategory && (
                                    <span>• {item.strCategory}</span>
                                  )}
                                  {item.strArea && <span>• {item.strArea}</span>}
                                </div>
                              </div>
                            </div>

                            {/* Item calculated price */}
                            <div className="text-right shrink-0">
                              <span className="font-bold text-sm text-gray-900">
                                {formatPrice(itemPrice * itemQty)}
                              </span>
                              {itemQty > 1 && (
                                <p className="text-[10px] text-gray-400">
                                  {formatPrice(itemPrice)} each
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Delivery Address snippet */}
                    {order.deliveryAddress && (
                      <div className="pt-3 border-t border-gray-100 flex items-start gap-2 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="truncate">
                          Delivered to: <strong className="text-gray-700 font-medium">{order.deliveryAddress}</strong>
                        </span>
                      </div>
                    )}

                    {/* Expandable Bill Receipt Breakdown */}
                    {isReceiptExpanded && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200/70 text-xs space-y-2 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between font-bold text-gray-800 pb-2 border-b border-gray-200">
                          <span className="flex items-center gap-1.5">
                            <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Billing Details</span>
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Payment: {order.paymentMethod || "Cash on Delivery"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Item Subtotal ({itemCount} items)</span>
                          <span className="font-medium text-gray-900">
                            {formatPrice(order.itemTotal || order.totalAmount - (order.deliveryFee || 2.99))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Delivery Partner Fee</span>
                          <span className="font-medium text-gray-900">
                            {formatPrice(order.deliveryFee ?? 2.99)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Restaurant Packaging & Platform</span>
                          <span className="font-bold text-emerald-700">FREE</span>
                        </div>
                        <div className="pt-2 border-t border-dashed border-gray-300 flex items-center justify-between font-bold text-gray-900 text-sm">
                          <span>Total Amount Paid</span>
                          <span className="text-emerald-800 font-black">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer: 'Reorder' Button + 'View Receipt' Toggle */}
                  <div className="px-5 py-4 bg-gray-50/70 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => toggleReceipt(order.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-emerald-700 transition cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{isReceiptExpanded ? "Hide Receipt" : "View Receipt"}</span>
                      {isReceiptExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Primary 'Reorder' button */}
                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Reorder ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
