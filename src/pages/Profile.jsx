import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Calendar,
  LogOut,
  Database,
  ShoppingCart,
  Heart,
  Bike,
  MapPin,
  Check,
  Edit2,
  ShieldCheck,
  ArrowRight,
  Clock,
  Coins,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAddress } from "../contexts/AddressContext";
import { useCurrency } from "../contexts/CurrencyContext";
import AddressBook from "../components/AddressBook";
import { getOrderHistory } from "../utils/orderStorage";

const Profile = () => {
  const { currentUser, logout, updateProfile } = useAuth();
  const { totalCount, cartItems } = useCart();
  const { favorites } = useFavorites();
  const { addresses } = useAddress();
  const { currency, setCurrency, exchangeRate, formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || "");
  const [successMsg, setSuccessMsg] = useState("");

  if (!currentUser) return null;

  const handleUpdateName = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateProfile({ name: nameInput });
    setIsEditingName(false);
    setSuccessMsg("Profile name updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const joinDate = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  // Check active order for this user
  let activeOrder = null;
  try {
    const rawOrder = localStorage.getItem(`active_order_${currentUser.email.toLowerCase()}`);
    if (rawOrder) activeOrder = JSON.parse(rawOrder);
  } catch {
    activeOrder = null;
  }

  // Check past completed orders
  const pastOrders = getOrderHistory(currentUser.email, currentUser.name);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shadow-emerald-700/20">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <form onSubmit={handleUpdateName} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="text-lg sm:text-xl font-extrabold text-gray-900 border border-emerald-500 rounded-lg px-2.5 py-1 outline-none bg-emerald-50/30"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition cursor-pointer"
                      title="Save name"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                      {currentUser.name}
                    </h1>
                    <button
                      onClick={() => {
                        setNameInput(currentUser.name);
                        setIsEditingName(true);
                      }}
                      className="p-1 text-gray-400 hover:text-emerald-700 transition cursor-pointer"
                      title="Edit name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentUser.email}</span>
              </p>

              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {joinDate}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100/80 border border-red-200 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {successMsg && (
          <div className="mt-4 p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
            {successMsg}
          </div>
        )}
      </div>

      {/* Account Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Cart items */}
        <Link
          to="/cart"
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Cart</span>
            <div className="p-1.5 bg-emerald-50 rounded-xl text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-black text-gray-900">{totalCount}</span>
            <span className="text-xs text-gray-500 ml-1 font-medium">
              {totalCount === 1 ? "item" : "items"}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
            <span>Checkout</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        {/* Favorites count */}
        <Link
          to="/favorites"
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-rose-200 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Favorites</span>
            <div className="p-1.5 bg-rose-50 rounded-xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-black text-gray-900">{favorites.length}</span>
            <span className="text-xs text-gray-500 ml-1 font-medium">dishes</span>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-2 flex items-center gap-1">
            <span>Favorites</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        {/* Past Orders History */}
        <Link
          to="/order-history"
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {activeOrder ? "Orders (Active)" : "Past Orders"}
            </span>
            <div className="p-1.5 bg-emerald-50 rounded-xl text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
              {activeOrder ? <Bike className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-black text-gray-900">
              {pastOrders.length}
            </span>
            <span className="text-xs text-gray-500 ml-1 font-medium">
              {pastOrders.length === 1 ? "order" : "orders"}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
            <span>{activeOrder ? "1 Active Tracking" : "Order History"}</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        {/* Addresses */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Addresses</span>
            <div className="p-1.5 bg-purple-50 rounded-xl text-purple-700">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-black text-gray-900">{addresses.length}</span>
            <span className="text-xs text-gray-500 ml-1 font-medium">saved</span>
          </div>
          <p className="text-[11px] text-purple-700 font-semibold mt-2">
            <span>Swiggy / Zomato Book</span>
          </p>
        </div>
      </div>

      {/* Currency & Regional Preferences Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">
                Currency & Pricing Display
              </h2>
              <p className="text-xs text-gray-500">
                Choose how prices and totals are displayed throughout the storefront (1 USD = ₹{exchangeRate})
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-700">
            Active: {currency}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => setCurrency("INR")}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
              currency === "INR"
                ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-gray-900">Indian Rupee (₹ INR)</span>
                {currency === "INR" && (
                  <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Prices shown as base INR amounts (e.g. {formatPrice(299, "INR")})
              </p>
            </div>
            <span className="w-6 h-6 rounded-full flex items-center justify-center border text-sm font-bold ml-2 shrink-0 border-emerald-500 text-emerald-600 bg-white">
              ₹
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
              currency === "USD"
                ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-gray-900">US Dollar ($ USD)</span>
                {currency === "USD" && (
                  <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Converted dynamically using rate 1 USD = 94.5 INR (e.g. {formatPrice(299, "USD")})
              </p>
            </div>
            <span className="w-6 h-6 rounded-full flex items-center justify-center border text-sm font-bold ml-2 shrink-0 border-emerald-500 text-emerald-600 bg-white">
              $
            </span>
          </button>
        </div>
      </div>

      {/* Address Book Management Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm">
        <AddressBook
          title="My Delivery Addresses"
          subtitle="Add, edit, or delete delivery addresses saved to your isolated profile"
          allowSelect={true}
        />
      </div>

      {/* Local Storage Data Partitioning Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">
                Local Storage Partitioning
              </h2>
              <p className="text-xs text-gray-500">
                Your addresses, cart, and orders are isolated cleanly per user account in browser storage
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Isolated Local Partition</span>
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100">
            <div className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-1">
              Address Storage Key
            </div>
            <code className="text-emerald-700 font-mono font-bold block truncate">
              addresses_{currentUser.email?.toLowerCase().trim()}
            </code>
            <p className="text-gray-500 text-[11px] mt-1">
              {addresses.length} saved delivery addresses
            </p>
          </div>

          <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100">
            <div className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-1">
              Cart Storage Key
            </div>
            <code className="text-emerald-700 font-mono font-bold block truncate">
              cart_{currentUser.email?.toLowerCase().trim()}
            </code>
            <p className="text-gray-500 text-[11px] mt-1">
              {cartItems.length} items ({totalCount} total quantity)
            </p>
          </div>

          <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100">
            <div className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-1">
              Favorites Storage Key
            </div>
            <code className="text-rose-600 font-mono font-bold block truncate">
              favorites_{currentUser.email?.toLowerCase().trim()}
            </code>
            <p className="text-gray-500 text-[11px] mt-1">
              {favorites.length} saved favorite dishes
            </p>
          </div>

          <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100">
            <div className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-1">
              Active Order Tracker Key
            </div>
            <code className="text-emerald-700 font-mono font-bold block truncate">
              active_order_{currentUser.email?.toLowerCase().trim()}
            </code>
            <p className="text-gray-500 text-[11px] mt-1">
              Live status progression & order history
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
