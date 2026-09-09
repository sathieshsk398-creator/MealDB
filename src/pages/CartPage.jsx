import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  Receipt,
  UtensilsCrossed,
  Home,
  Briefcase,
  Pencil,
  CheckCircle2,
  Phone,
  User,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  Loader2,
  Zap,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useAddress } from "../contexts/AddressContext";
import { useCurrency } from "../contexts/CurrencyContext";
import AddressBook from "../components/AddressBook";
import AddressFormModal from "../components/AddressFormModal";
import { registerOrderInAdminStore } from "../utils/adminAnalytics";

const CartPage = () => {
  const {
    cartItems,
    cartLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemTotal,
    totalCount,
  } = useCart();
  const { currentUser } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();

  // Buy Now item (Direct single-dish checkout, bypasses adding other cart items)
  const locationBuyNow = location.state?.buyNowItem;
  const [userBuyNowOverride, setUserBuyNowOverride] = useState(undefined);

  const buyNowItem = userBuyNowOverride !== undefined
    ? userBuyNowOverride
    : (locationBuyNow || (() => {
        try {
          const saved = sessionStorage.getItem("mealdb_buy_now");
          return saved ? JSON.parse(saved) : null;
        } catch {
          return null;
        }
      })());

  useEffect(() => {
    if (locationBuyNow) {
      try {
        sessionStorage.setItem("mealdb_buy_now", JSON.stringify(locationBuyNow));
      } catch (e) {
        console.error("Failed to store buyNowItem in sessionStorage", e);
      }
    }
  }, [locationBuyNow]);

  const handleSwitchToRegularCart = () => {
    setUserBuyNowOverride(null);
    try {
      sessionStorage.removeItem("mealdb_buy_now");
    } catch {
      // ignore
    }
  };

  const isBuyNowMode = Boolean(buyNowItem);
  const displayItems = isBuyNowMode && buyNowItem ? [buyNowItem] : cartItems;

  const handleUpdateQuantity = (idMeal, delta) => {
    if (isBuyNowMode && buyNowItem) {
      const newQty = (buyNowItem.quantity || 1) + delta;
      if (newQty <= 0) {
        handleSwitchToRegularCart();
        return;
      }
      const updated = { ...buyNowItem, quantity: newQty };
      setUserBuyNowOverride(updated);
      try {
        sessionStorage.setItem("mealdb_buy_now", JSON.stringify(updated));
      } catch {
        // ignore
      }
    } else {
      updateQuantity(idMeal, delta);
    }
  };

  const handleRemoveItem = (idMeal) => {
    if (isBuyNowMode) {
      handleSwitchToRegularCart();
    } else {
      removeFromCart(idMeal);
    }
  };

  const activeItemTotal = useMemo(() => {
    if (isBuyNowMode) {
      return buyNowItem ? (buyNowItem.price || 0) * (buyNowItem.quantity || 1) : 0;
    }
    return itemTotal;
  }, [isBuyNowMode, buyNowItem, itemTotal]);

  const activeDeliveryFee = activeItemTotal > 500 || activeItemTotal === 0 ? 0 : 40;
  const activeTotalAmount = activeItemTotal + activeDeliveryFee;
  const activeTotalCount = isBuyNowMode ? (buyNowItem?.quantity || 0) : totalCount;

  const userEmail = currentUser?.email?.toLowerCase().trim() || null;
  const activeOrderKey = userEmail ? `active_order_${userEmail}` : "mealdb_active_order";

  const [deliveryNote, setDeliveryNote] = useState("");
  const [cookingNote, setCookingNote] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Payment method state (persisted per user preference, default to 'Cash on Delivery')
  const paymentPrefKey = userEmail ? `payment_pref_${userEmail}` : "mealdb_payment_pref";
  const [paymentMethod, setPaymentMethod] = useState(() => {
    try {
      const saved = localStorage.getItem(paymentPrefKey);
      if (saved && ["Cash on Delivery", "Credit/Debit Card", "UPI"].includes(saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return "Cash on Delivery";
  });

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
    try {
      localStorage.setItem(paymentPrefKey, method);
    } catch (err) {
      console.error("Failed to save payment preference to localStorage", err);
    }
  };

  const [existingActiveOrder] = useState(() => {
    try {
      const stored = localStorage.getItem(activeOrderKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const {
    addresses,
    selectedAddress,
    formatAddress,
  } = useAddress();

  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Active delivery address derived from selected or first address
  const activeDeliveryAddress = selectedAddress || (addresses.length > 0 ? addresses[0] : null);

  const formattedAddressString = activeDeliveryAddress
    ? formatAddress(activeDeliveryAddress)
    : "Standard Home Delivery";

  const handlePlaceOrder = () => {
    const orderItems = isBuyNowMode ? (buyNowItem ? [{ ...buyNowItem }] : []) : [...cartItems];
    if (orderItems.length === 0 || isPlacingOrder) return;
    setIsPlacingOrder(true);

    const orderId = `SW-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = Date.now();
    const newOrder = {
      id: orderId,
      userEmail: currentUser?.email || null,
      userName: currentUser?.name || null,
      items: orderItems,
      itemTotal: activeItemTotal,
      deliveryFee: activeDeliveryFee,
      totalAmount: activeTotalAmount,
      totalCount: activeTotalCount,
      placedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: now,
      statusIndex: 0,
      status: "Order Accepted",
      lastUpdatedAt: now,
      cookingNote: cookingNote.trim(),
      deliveryNote: deliveryNote.trim(),
      deliveryAddress: formattedAddressString,
      deliveryAddressObj: activeDeliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending on Delivery" : "Paid Online (Mock)",
      userId: currentUser?.uid || null,
      isBuyNowOrder: isBuyNowMode,
    };

    // Save active order to localStorage
    try {
      localStorage.setItem(activeOrderKey, JSON.stringify(newOrder));
      registerOrderInAdminStore(newOrder);
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to save order:", e);
    }

    if (isBuyNowMode) {
      try {
        sessionStorage.removeItem("mealdb_buy_now");
      } catch {
        // ignore
      }
      setUserBuyNowOverride(null);
      // Notice: Do NOT clear the regular cart! User only bought this one dish.
    } else {
      clearCart();
    }

    // Brief transition effect then redirect to OrderTracking.jsx
    setTimeout(() => {
      setIsPlacingOrder(false);
      navigate("/order-tracking");
    }, 400);
  };

  if (cartLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-20">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-gray-500">Syncing your cart...</p>
      </div>
    );
  }

  // Empty Cart View (when neither Buy Now item nor regular cart items exist)
  if (displayItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        {existingActiveOrder ? (
          <div className="mb-10 max-w-md mx-auto bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Active Order in Progress
              </span>
              <span className="text-xs text-gray-500 font-mono">#{existingActiveOrder.id}</span>
            </div>
            <p className="font-bold text-gray-900 text-sm">
              Current Status:{" "}
              <span className="text-emerald-700">{existingActiveOrder.status || "Order Accepted"}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {existingActiveOrder.totalCount} items • Total {formatPrice(existingActiveOrder.totalAmount)}
            </p>
            <Link
              to="/order-tracking"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition text-xs shadow-sm"
            >
              <span>Track Active Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : null}

        {cartItems.length > 0 && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto flex items-center justify-between gap-3 text-left shadow-xs">
            <div>
              <p className="text-xs font-bold text-emerald-900">
                You have {cartItems.length} {cartItems.length === 1 ? "dish" : "dishes"} saved in your regular cart.
              </p>
              <p className="text-[11px] text-emerald-700">Would you like to continue with your full cart?</p>
            </div>
            <button
              type="button"
              onClick={handleSwitchToRegularCart}
              className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Full Cart</span>
            </button>
          </div>
        )}

        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm sm:text-base">
          Good food is always cooking! Go ahead and explore delicious dishes from top cuisines and add them to your cart.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-sm tracking-wide"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Explore Delicious Meals</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <span>{isBuyNowMode ? "Instant Checkout" : "Order Checkout"}</span>
            {isBuyNowMode && (
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1 shadow-2xs">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Buy Now</span>
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isBuyNowMode
              ? "Checking out directly with this selected dish only"
              : "Review your dishes and place your delivery order"}
          </p>
        </div>
        <span className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full border ${
          isBuyNowMode
            ? "text-amber-900 bg-amber-50 border-amber-200"
            : "text-emerald-800 bg-emerald-50 border-emerald-200"
        }`}>
          {isBuyNowMode
            ? `${activeTotalCount} ${activeTotalCount === 1 ? "dish" : "dishes"} (Direct)`
            : `${totalCount} ${totalCount === 1 ? "item" : "items"} in cart`}
        </span>
      </div>

      {/* Buy Now Active Banner */}
      {isBuyNowMode && buyNowItem && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="w-5 h-5 fill-current" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-extrabold text-amber-950">
                  Instant Single-Dish Checkout Active
                </p>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Only This Dish
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Buying only <strong className="font-bold text-amber-950">{buyNowItem.strMeal}</strong>. Dishes already added to your regular cart are not included in this order.
              </p>
            </div>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={handleSwitchToRegularCart}
              className="text-xs font-bold text-amber-950 hover:bg-amber-100 bg-white border border-amber-300 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-2xs"
            >
              Switch to Full Cart ({totalCount} {totalCount === 1 ? "dish" : "dishes"})
            </button>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Address & Cart Items */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Address Section (Swiggy / Zomato style) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                        Delivery Address
                      </span>
                      {addresses.length > 1 && (
                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                          {addresses.length} saved
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      Order will be delivered to this location
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-emerald-700 bg-gray-50 hover:bg-emerald-50 px-2.5 py-1.5 rounded-xl transition cursor-pointer border border-gray-200"
                    title="Add new address"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add New</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddressPicker(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-xl transition cursor-pointer border border-emerald-200 shadow-2xs"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Change</span>
                  </button>
                </div>
              </div>

              {activeDeliveryAddress ? (
                <div className="mt-4 space-y-2">
                  {/* Address Tag & Contact Details */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[11px] ${
                        activeDeliveryAddress.type === "Work"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : activeDeliveryAddress.type === "Other"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {activeDeliveryAddress.type === "Work" ? (
                        <Briefcase className="w-3 h-3" />
                      ) : activeDeliveryAddress.type === "Other" ? (
                        <MapPin className="w-3 h-3" />
                      ) : (
                        <Home className="w-3 h-3" />
                      )}
                      {activeDeliveryAddress.type || "Home"}
                    </span>

                    {activeDeliveryAddress.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50/70 border border-emerald-200 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}

                    <span className="font-bold text-gray-900 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {activeDeliveryAddress.fullName}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-600 flex items-center gap-1 font-medium">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {activeDeliveryAddress.mobile}
                    </span>
                  </div>

                  {/* House No, Street, Area */}
                  <p className="font-extrabold text-gray-900 text-sm sm:text-base leading-snug">
                    {activeDeliveryAddress.houseNo}
                  </p>

                  <p className="text-xs text-gray-700 font-medium">
                    {activeDeliveryAddress.area}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {activeDeliveryAddress.landmark && (
                      <span>Landmark: {activeDeliveryAddress.landmark}</span>
                    )}
                    {activeDeliveryAddress.landmark && <span>•</span>}
                    <span>Pincode: {activeDeliveryAddress.pincode}</span>
                  </div>

                  {/* Status and Speed Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Estimated arrival: 25 - 35 mins</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50/70 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px]">Saved in user address book</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-600 mb-3">No delivery address saved yet.</p>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Delivery Address</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Address Picker Modal */}
          {showAddressPicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
              <div
                className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">Select Delivery Address</h3>
                      <p className="text-xs text-gray-500">
                        Choose an address for this order or add a new one
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddressPicker(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <AddressBook
                  title=""
                  subtitle=""
                  allowSelect={true}
                  compact={true}
                  onAddressSelect={() => setShowAddressPicker(false)}
                />
              </div>
            </div>
          )}

          {/* Add New Address Modal */}
          <AddressFormModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
          />

          {/* Cart Items List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                {isBuyNowMode ? (
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                ) : (
                  <UtensilsCrossed className="w-4 h-4 text-emerald-700" />
                )}
                <h2 className="font-bold text-gray-900 text-base">
                  {isBuyNowMode ? "Buy Now Dish" : "Your Selected Dishes"}
                </h2>
                <span className="text-xs text-gray-400 font-semibold">
                  ({activeTotalCount})
                </span>
              </div>
              {isBuyNowMode ? (
                cartItems.length > 0 && (
                  <button
                    onClick={handleSwitchToRegularCart}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    View Regular Cart ({totalCount})
                  </button>
                )
              ) : (
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Clear all items"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              )}
            </div>

            <div className="divide-y divide-gray-100">
              {displayItems.map((item) => {
                const itemSubtotal = (item.price || 0) * item.quantity;
                return (
                  <div
                    key={item.idMeal}
                    className="p-4 sm:p-5 flex items-center gap-4 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Thumbnail */}
                    <Link to={`/meal/${item.idMeal}`} className="shrink-0">
                      <img
                        src={item.strMealThumb}
                        alt={item.strMeal}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-100 shadow-xs"
                      />
                    </Link>

                    {/* Meal Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/meal/${item.idMeal}`}
                        className="font-bold text-gray-900 text-sm sm:text-base hover:text-emerald-700 transition line-clamp-1"
                      >
                        {item.strMeal}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.strCategory} • {formatPrice(item.price)} each
                      </p>
                      <p className="text-xs font-bold text-emerald-800 mt-1 sm:hidden">
                        Total: {formatPrice(itemSubtotal)}
                      </p>
                    </div>

                    {/* Quantity Stepper (Swiggy/Zomato pill) */}
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center bg-white border border-emerald-600 text-emerald-800 rounded-xl overflow-hidden shadow-xs">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.idMeal, -1)}
                          className="px-2.5 py-1.5 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <span className="px-2.5 text-xs sm:text-sm font-bold min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.idMeal, 1)}
                          className="px-2.5 py-1.5 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Subtotal on desktop */}
                      <div className="hidden sm:block text-right min-w-[75px]">
                        <span className="text-sm font-extrabold text-gray-900">
                          {formatPrice(itemSubtotal)}
                        </span>
                      </div>

                      {/* Delete icon */}
                      <button
                        onClick={() => handleRemoveItem(item.idMeal)}
                        className="text-gray-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                        title={isBuyNowMode ? "Cancel Buy Now" : "Remove item"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cooking and Delivery Instructions */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Special Instructions
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={cookingNote}
                onChange={(e) => setCookingNote(e.target.value)}
                placeholder="Cooking note (e.g. less spicy, cutlery)"
                className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-600 transition"
              />
              <input
                type="text"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                placeholder="Delivery note (e.g. leave at door, ring bell)"
                className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-600 transition"
              />
            </div>
          </div>

          {/* Payment Selection Section (Mock Checkout) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                    Payment Method
                  </h3>
                  <p className="text-xs text-gray-500">
                    Select your preferred payment option
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Mock Checkout
              </span>
            </div>

            {/* Radio Buttons for Payment Options */}
            <div className="space-y-3" role="radiogroup" aria-label="Payment Options">
              {/* Option 1: Cash on Delivery */}
              <label
                htmlFor="payment-cod"
                onClick={() => handlePaymentChange("Cash on Delivery")}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === "Cash on Delivery"
                    ? "bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500 shadow-2xs"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <div className="pt-0.5">
                  <input
                    type="radio"
                    id="payment-cod"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={(e) => handlePaymentChange(e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                  />
                </div>
                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl shrink-0 mt-0.5">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      Cash on Delivery
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Pay on Delivery
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pay with physical cash or scan the delivery partner's QR code upon arrival at your doorstep.
                  </p>
                </div>
              </label>

              {/* Option 2: Credit/Debit Card */}
              <label
                htmlFor="payment-card"
                onClick={() => handlePaymentChange("Credit/Debit Card")}
                className={`flex flex-col gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === "Credit/Debit Card"
                    ? "bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500 shadow-2xs"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="pt-0.5">
                    <input
                      type="radio"
                      id="payment-card"
                      name="paymentMethod"
                      value="Credit/Debit Card"
                      checked={paymentMethod === "Credit/Debit Card"}
                      onChange={(e) => handlePaymentChange(e.target.value)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                    />
                  </div>
                  <div className="p-2 bg-blue-50 text-blue-700 rounded-xl shrink-0 mt-0.5">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        Credit/Debit Card
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Mock Online
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Visa, Mastercard, RuPay, Maestro & American Express cards accepted.
                    </p>
                  </div>
                </div>

                {/* Mock Card Preview when selected */}
                {paymentMethod === "Credit/Debit Card" && (
                  <div
                    className="mt-1 pt-3 border-t border-emerald-200/60 space-y-2 pl-7 animate-in fade-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>Mock Card Gateway</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted
                        </span>
                      </div>
                      <div className="font-mono text-xs font-semibold text-gray-800 tracking-wider">
                        •••• •••• •••• 4242
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                        <span>{currentUser?.name || "CARD HOLDER"}</span>
                        <span>EXP: 12/28</span>
                      </div>
                    </div>
                  </div>
                )}
              </label>

              {/* Option 3: UPI */}
              <label
                htmlFor="payment-upi"
                onClick={() => handlePaymentChange("UPI")}
                className={`flex flex-col gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === "UPI"
                    ? "bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500 shadow-2xs"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="pt-0.5">
                    <input
                      type="radio"
                      id="payment-upi"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={(e) => handlePaymentChange(e.target.value)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                    />
                  </div>
                  <div className="p-2 bg-purple-50 text-purple-700 rounded-xl shrink-0 mt-0.5">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        UPI
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                        Fast & Direct
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pay instantly with Google Pay, PhonePe, Paytm, BHIM, or any UPI ID.
                    </p>
                  </div>
                </div>

                {/* Mock UPI Apps & ID when selected */}
                {paymentMethod === "UPI" && (
                  <div
                    className="mt-1 pt-3 border-t border-emerald-200/60 space-y-2.5 pl-7 animate-in fade-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-wrap gap-2">
                      {["Google Pay", "PhonePe", "Paytm", "BHIM UPI"].map((app) => (
                        <span
                          key={app}
                          className="text-[11px] font-semibold px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex items-center justify-between">
                      <span className="font-mono text-gray-700 font-semibold truncate">
                        {(currentUser?.name || "user").toLowerCase().replace(/[^a-z0-9]/g, "")}@okaxis
                      </span>
                      <span className="text-emerald-700 font-bold shrink-0 ml-2">✓ Verified Mock VPA</span>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Bill Details Card */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-4">
              <Receipt className="w-5 h-5 text-emerald-700" />
              <h2 className="font-bold text-gray-900 text-lg">Bill Details</h2>
            </div>

            {/* Bill Breakdown */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Item Total ({activeTotalCount} {activeTotalCount === 1 ? "item" : "items"})</span>
                <span className="font-semibold text-gray-900">{formatPrice(activeItemTotal)}</span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-1.5">
                  <span>Delivery Fee</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                    Fast
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatPrice(activeDeliveryFee)}
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span className="text-xs text-gray-500">Restaurant Packaging & Platform</span>
                <span className="text-xs text-emerald-700 font-bold">FREE</span>
              </div>

              {/* Selected Payment Method Breakdown row */}
              <div className="flex items-center justify-between text-gray-600 pt-1">
                <span className="text-xs">Payment Preference</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1.5">
                  {paymentMethod === "Cash on Delivery" && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                  {paymentMethod === "Credit/Debit Card" && <CreditCard className="w-3.5 h-3.5 text-emerald-600" />}
                  {paymentMethod === "UPI" && <Smartphone className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{paymentMethod}</span>
                </span>
              </div>

              <div className="pt-4 border-t border-dashed border-gray-200 mt-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-extrabold text-gray-900 tracking-tight">
                      TO PAY
                    </span>
                    <p className="text-[11px] text-gray-400">
                      {isBuyNowMode ? "Single dish instant order" : "Inclusive of all applicable fees"}
                    </p>
                  </div>
                  <span className="text-2xl font-black text-emerald-800 tracking-tight">
                    {formatPrice(activeTotalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Destination Summary before Place Order */}
            <div className="mt-5 p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    Delivering to {activeDeliveryAddress?.type || "Home"}
                  </p>
                  <p className="text-gray-500 truncate text-[11px]">
                    {activeDeliveryAddress
                      ? `${activeDeliveryAddress.houseNo}, ${activeDeliveryAddress.area}`
                      : "Select or add an address"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressPicker(true)}
                className="text-emerald-700 hover:text-emerald-800 font-bold ml-2 shrink-0 cursor-pointer text-xs underline underline-offset-2"
              >
                Change
              </button>
            </div>

            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || activeTotalCount === 0}
              className={`mt-4 w-full active:scale-[0.98] disabled:opacity-60 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-between cursor-pointer text-base ${
                isBuyNowMode
                  ? "bg-amber-500 hover:bg-amber-600 shadow-amber-600/20"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20"
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="text-xs opacity-90 font-medium">Total: {formatPrice(activeTotalAmount)}</span>
                <span className="tracking-wide flex items-center gap-1.5">
                  {isPlacingOrder
                    ? "Placing Order..."
                    : isBuyNowMode
                    ? paymentMethod === "Cash on Delivery"
                      ? "Buy Now (Pay on Delivery)"
                      : `Buy Now • Pay ${formatPrice(activeTotalAmount)}`
                    : paymentMethod === "Cash on Delivery"
                    ? "Place Order (Pay on Delivery)"
                    : `Pay ${formatPrice(activeTotalAmount)} & Place Order`}
                </span>
              </div>
              {isBuyNowMode ? (
                <Zap className="w-5 h-5 fill-current" />
              ) : (
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Safe & Contactless Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
