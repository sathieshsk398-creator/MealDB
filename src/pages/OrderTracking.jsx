import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  PackageCheck,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  ArrowLeft,
  UtensilsCrossed,
  Copy,
  Check,
  RotateCcw,
  Receipt,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { saveOrderToHistory } from "../utils/orderStorage";

const ORDER_STEPS = [
  {
    key: "accepted",
    label: "Order Accepted",
    sublabel: "Your order has been received by the restaurant",
    eta: "Just now",
    icon: CheckCircle2,
  },
  {
    key: "preparing",
    label: "Food is being Prepared",
    sublabel: "Chef is crafting your fresh dishes",
    eta: "In the kitchen",
    icon: ChefHat,
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    sublabel: "Delivery partner is on the way to your doorstep",
    eta: "Rider on the move",
    icon: Bike,
  },
  {
    key: "delivered",
    label: "Delivered",
    sublabel: "Order handed over safely. Enjoy your food!",
    eta: "Delivered",
    icon: PackageCheck,
  },
];

const OrderTracking = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { formatPrice } = useCurrency();
  const userEmail = currentUser?.email?.toLowerCase().trim() || null;
  const orderStorageKey = userEmail ? `active_order_${userEmail}` : "mealdb_active_order";

  const [order, setOrder] = useState(() => {
    try {
      const stored = localStorage.getItem(orderStorageKey);
      if (!stored) return null;
      const parsedOrder = JSON.parse(stored);
      const now = Date.now();
      const createdAt = parsedOrder.createdAt || now;
      const elapsedSteps = Math.floor((now - createdAt) / 5000);
      const currentSavedIndex =
        typeof parsedOrder.statusIndex === "number" ? parsedOrder.statusIndex : 0;
      const computedStep = Math.min(3, Math.max(currentSavedIndex, elapsedSteps));
      const updated = {
        ...parsedOrder,
        statusIndex: computedStep,
        status: ORDER_STEPS[computedStep].label,
        lastUpdatedAt: now,
      };
      localStorage.setItem(orderStorageKey, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error("Failed to load active order from localStorage:", e);
      return null;
    }
  });

  const [stepIndex, setStepIndex] = useState(() => order?.statusIndex ?? 0);
  const [secondsLeftInStep, setSecondsLeftInStep] = useState(5);
  const [copied, setCopied] = useState(false);
  const [showItemsDetails, setShowItemsDetails] = useState(true);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // Track orderStorageKey transitions when user logs in or switches account
  const [prevStorageKey, setPrevStorageKey] = useState(orderStorageKey);
  if (prevStorageKey !== orderStorageKey) {
    setPrevStorageKey(orderStorageKey);
    try {
      const stored = localStorage.getItem(orderStorageKey);
      if (stored) {
        const parsedOrder = JSON.parse(stored);
        setOrder(parsedOrder);
        setStepIndex(parsedOrder.statusIndex ?? 0);
      } else {
        setOrder(null);
        setStepIndex(0);
      }
    } catch {
      setOrder(null);
      setStepIndex(0);
    }
  }

  // Sync active order if changed in localStorage across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === orderStorageKey || !e.key) {
        try {
          const stored = localStorage.getItem(orderStorageKey);
          if (stored) {
            const parsedOrder = JSON.parse(stored);
            setOrder(parsedOrder);
            if (typeof parsedOrder.statusIndex === "number") {
              setStepIndex(parsedOrder.statusIndex);
            }
          }
        } catch (err) {
          console.error("Error reading order from storage:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [orderStorageKey]);

  // Update order status every 5 seconds using setInterval
  useEffect(() => {
    if (!order) return;
    if (stepIndex >= 3) return; // Already reached 'Delivered'

    const intervalId = setInterval(() => {
      setStepIndex((prevIndex) => {
        if (prevIndex >= 3) {
          clearInterval(intervalId);
          return 3;
        }
        const nextIndex = prevIndex + 1;

        // Persist updated status in localStorage so changes sync across tabs
        try {
          const stored = localStorage.getItem(orderStorageKey);
          const existing = stored ? JSON.parse(stored) : order;
          const updatedOrder = {
            ...existing,
            statusIndex: nextIndex,
            status: ORDER_STEPS[nextIndex].label,
            lastUpdatedAt: Date.now(),
          };
          localStorage.setItem(orderStorageKey, JSON.stringify(updatedOrder));
          window.dispatchEvent(new Event("storage"));
          setOrder(updatedOrder);

          // If reached delivered step, archive in past orders history
          if (nextIndex >= 3) {
            saveOrderToHistory(updatedOrder, currentUser?.email || updatedOrder.userEmail);
          }
        } catch (e) {
          console.error("Error saving updated order status:", e);
        }

        // Reset countdown timer
        setSecondsLeftInStep(5);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [order, stepIndex, orderStorageKey, currentUser]);

  // Visual sub-second countdown timer for the 5-second interval
  useEffect(() => {
    if (stepIndex >= 3) return;

    const countdownTimer = setInterval(() => {
      setSecondsLeftInStep((prev) => (prev > 1 ? prev - 1 : 5));
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [stepIndex]);

  const handleCopyOrderId = () => {
    if (!order?.id) return;
    navigator.clipboard?.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartNewOrder = () => {
    // Save to history if not already saved
    if (order) {
      saveOrderToHistory(order, currentUser?.email || order.userEmail);
    }
    // Clear active order and return to home
    localStorage.removeItem(orderStorageKey);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  // If no active order exists in localStorage
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-xs border border-emerald-100">
          <UtensilsCrossed className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          No Active Order Found
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm sm:text-base">
          You don't have any ongoing deliveries right now. Select your favorite meals from our menu and place an order!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95 text-sm"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Browse Food Menu</span>
        </Link>
      </div>
    );
  }

  const currentStep = ORDER_STEPS[stepIndex];
  const isDelivered = stepIndex === 3;
  const progressPercentage = (stepIndex / (ORDER_STEPS.length - 1)) * 100;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Breadcrumbs & Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Live Order Tracking
            </h1>
            {!isDelivered ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Update</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-500">
            <span>Order ID: <strong className="text-gray-800">{order.id}</strong></span>
            <button
              onClick={handleCopyOrderId}
              className="text-emerald-700 hover:text-emerald-800 p-1 cursor-pointer transition-colors"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <span>•</span>
            <span>Placed at {order.placedAt || "Recently"}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isDelivered ? (
            <>
              <Link
                to="/order-history"
                className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition cursor-pointer"
              >
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Order History</span>
              </Link>
              <button
                onClick={handleStartNewOrder}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Order Again</span>
              </button>
            </>
          ) : (
            <div className="bg-amber-50 text-amber-900 border border-amber-200/80 px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 animate-spin-slow" />
              <span>Next update in <strong>{secondsLeftInStep}s</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Ambient Top Glow Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 transition-all duration-700 ${
            isDelivered
              ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500"
              : "bg-gradient-to-r from-emerald-500 to-teal-500"
          }`}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors duration-500 ${
                isDelivered
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-emerald-600 text-white"
              }`}
            >
              <currentStep.icon className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-emerald-700 mb-1">
                <span>Step {stepIndex + 1} of 4</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {currentStep.label}
              </h2>
              <p className="text-sm text-gray-600 mt-1 max-w-md">
                {currentStep.sublabel}
              </p>
            </div>
          </div>

          {/* Delivery ETA & PIN badge */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 sm:min-w-[220px] text-right md:text-right">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
              Estimated Delivery
            </span>
            <span className="text-xl sm:text-2xl font-black text-gray-900 block mt-0.5">
              {isDelivered ? "Delivered at Door" : "20 - 25 mins"}
            </span>
            {!isDelivered && (
              <div className="mt-2 pt-2 border-t border-gray-200/70 flex items-center justify-end gap-2 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Delivery PIN: <strong>4892</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Step Progress Indicators Bar */}
        <div className="pt-8">
          {/* Progress Bar Track */}
          <div className="relative mb-8 hidden sm:block">
            <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
            {ORDER_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < stepIndex;
              const isCurrent = idx === stepIndex;

              return (
                <div
                  key={step.key}
                  className={`flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 p-3 sm:p-2.5 rounded-2xl transition-all ${
                    isCurrent
                      ? "bg-emerald-50/70 border border-emerald-200 shadow-xs"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* Step Bubble Indicator */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs transition-all duration-300 ${
                      isPast
                        ? "bg-emerald-600 text-white shadow-xs"
                        : isCurrent
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-sm animate-pulse"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                  </div>

                  {/* Step Labels */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`text-xs sm:text-sm font-bold truncate ${
                          isCurrent
                            ? "text-emerald-900"
                            : isPast
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] block mt-0.5 leading-tight ${
                        isCurrent
                          ? "text-emerald-700 font-semibold"
                          : isPast
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    >
                      {isCurrent ? "Active now" : isPast ? "Completed" : "Upcoming"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Delivery Partner Details & Delivery Route Details */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Delivery Partner & Destination */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Partner Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Delivery Executive
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Vaccinated & Sanitized
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  MV
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Marcus Vance</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      ★ 4.9
                    </span>
                    <span>Electric SuperScooter (EV-942)</span>
                  </p>
                </div>
              </div>

              {/* Communication buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPhoneModal(true)}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition cursor-pointer"
                  title="Call Delivery Partner"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowPhoneModal(true)}
                  className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition cursor-pointer"
                  title="Chat with Delivery Partner"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Delivery Route Visualization simulation */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                <span>Route Progress</span>
                <span className="text-emerald-700">
                  {stepIndex === 0 && "At Gourmet Central Kitchen"}
                  {stepIndex === 1 && "Cooking in progress"}
                  {stepIndex === 2 && "En route: 1.8 miles away"}
                  {stepIndex === 3 && "Arrived at destination"}
                </span>
              </div>

              {/* Progress animation track */}
              <div className="relative h-3 bg-gray-200/80 rounded-full overflow-hidden flex items-center">
                <div
                  className="h-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${Math.max(15, progressPercentage)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>Restaurant</span>
                <span>En Route</span>
                <span>Your Doorstep</span>
              </div>
            </div>
          </div>

          {/* Destination Address Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                  Delivery Address
                </span>
                <p className="font-bold text-gray-900 text-sm mt-1">
                  {order.deliveryAddress || "Home • 42 Gourmet Avenue, Foodies District"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Contact:{" "}
                  <span className="font-semibold text-gray-700">
                    {order.deliveryAddressObj?.mobile || order.deliveryAddressObj?.phone || "+1 (555) 019-2834"}
                  </span>
                  {(order.deliveryAddressObj?.fullName || order.deliveryAddressObj?.receiverName) && (
                    <span className="text-gray-500 font-normal">
                      {" • "}{order.deliveryAddressObj.fullName || order.deliveryAddressObj.receiverName}
                    </span>
                  )}
                </p>

                {order.deliveryNote && (
                  <div className="mt-3 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-gray-600">
                    <strong className="text-gray-800">Delivery note:</strong> {order.deliveryNote}
                  </div>
                )}
                {order.cookingNote && (
                  <div className="mt-2 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-gray-600">
                    <strong className="text-gray-800">Kitchen note:</strong> {order.cookingNote}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items & Payment Receipt */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-700" />
                <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>
              </div>
              <button
                onClick={() => setShowItemsDetails(!showItemsDetails)}
                className="text-xs text-emerald-700 font-semibold flex items-center gap-1 hover:text-emerald-800 cursor-pointer"
              >
                <span>{showItemsDetails ? "Hide" : "Show"} Items</span>
                {showItemsDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Ordered Items List */}
            {showItemsDetails && (
              <div className="space-y-3 divide-y divide-gray-100 mb-5 max-h-72 overflow-y-auto pr-1">
                {order.items?.map((item) => {
                  const subtotal = (item.price || 0) * item.quantity;
                  return (
                    <div key={item.idMeal} className="pt-3 first:pt-0 flex items-center gap-3">
                      <img
                        src={item.strMealThumb}
                        alt={item.strMeal}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-gray-900 truncate">
                          {item.strMeal}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-900 shrink-0">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bill Details breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span>Item Subtotal ({order.totalCount} items)</span>
                <span className="font-semibold text-gray-900">{formatPrice(order.itemTotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Partner Fee</span>
                <span className="font-semibold text-gray-900">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Restaurant Packaging</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>

              <div className="pt-3 border-t border-dashed border-gray-200 mt-2 flex items-baseline justify-between font-bold text-gray-900">
                <span className="text-sm">Total Amount</span>
                <span className="text-xl font-black text-emerald-800">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>

              {/* Payment Mode from Saved Order Object */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-500">Payment Mode</span>
                <span className="font-bold text-gray-900 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
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
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    order.paymentMethod === "Credit/Debit Card" || order.paymentMethod === "UPI"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {order.paymentStatus ||
                    (order.paymentMethod === "Cash on Delivery" || !order.paymentMethod
                      ? "Pay at Door"
                      : "Paid Online (Mock)")}
                </span>
              </div>
            </div>

            {/* Bottom Help & Safety badge */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Contactless Delivery with Temperature Checked</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Need help with your order? Our 24/7 support team is available.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Call/Message Contact Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Contact Marcus Vance</h3>
              <p className="text-xs text-gray-500 mt-1">
                Your delivery rider is currently driving safely with your hot meal.
              </p>
              <div className="my-4 bg-gray-50 p-3 rounded-xl border border-gray-200/70 font-mono font-bold text-sm text-gray-800">
                +1 (555) 392-8172
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="tel:+15553928172"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Call Rider
              </a>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
