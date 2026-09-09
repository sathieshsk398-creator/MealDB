import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Heart,
  UtensilsCrossed,
  MapPin,
  Bike,
  User,
  LogOut,
  ChevronDown,
  Mail,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useCurrency } from "../contexts/CurrencyContext";

const Header = () => {
  const [query, setQuery] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [savedAddress, setSavedAddress] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { isAdminLoggedIn } = useAdminAuth();
  const { totalCount } = useCart();
  const { favorites } = useFavorites();
  const { currency, setCurrency, toggleCurrency, exchangeRate } = useCurrency();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setShowMobileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check active order status and delivery address from localStorage (isolated per user)
  useEffect(() => {
    const checkState = () => {
      const userEmail = currentUser?.email?.toLowerCase()?.trim();

      try {
        const orderKey = userEmail ? `active_order_${userEmail}` : "mealdb_active_order";
        const storedOrder = localStorage.getItem(orderKey);
        setActiveOrder(storedOrder ? JSON.parse(storedOrder) : null);
      } catch {
        setActiveOrder(null);
      }

      try {
        const addressKey = userEmail ? `address_${userEmail}` : "mealdb_delivery_address";
        const storedAddress = localStorage.getItem(addressKey);
        setSavedAddress(storedAddress ? JSON.parse(storedAddress) : null);
      } catch {
        setSavedAddress(null);
      }
    };

    checkState();

    // Listen to storage changes and route changes
    window.addEventListener("storage", checkState);
    return () => window.removeEventListener("storage", checkState);
  }, [location.pathname, currentUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row gap-3 md:gap-6 items-center justify-between">
        {/* Brand & Location */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-5">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-sm transition-colors">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-gray-900 block leading-none">
                Meal<span className="text-emerald-600">DB</span>
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                Food Delivery
              </span>
            </div>
          </Link>

          {/* Quick Location Indicator (Swiggy/Zomato style) */}
          <Link
            to="/cart"
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200/70 transition cursor-pointer"
            title="View or change delivery address"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-gray-800">{savedAddress?.type || "Home"}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 truncate max-w-[130px]">
              {savedAddress?.street || "42 Gourmet Ave"}
            </span>
          </Link>

          {/* Mobile shortcuts */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Mobile Currency Switcher */}
            <button
              type="button"
              onClick={toggleCurrency}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 border border-gray-200 text-xs font-black text-gray-800 transition cursor-pointer"
              title={`Switch Currency (Currently ${currency}, 1 USD = ₹${exchangeRate})`}
              aria-label={`Current currency ${currency}. Tap to switch.`}
            >
              <span className="text-emerald-700">{currency === "INR" ? "₹" : "$"}</span>
              <span className="text-[11px] uppercase tracking-wider font-bold">{currency}</span>
            </button>

            {activeOrder && (
              <Link
                to="/order-tracking"
                className="relative p-2 text-emerald-700 hover:text-emerald-800 flex items-center"
                aria-label="Track Active Order"
                title="Track Active Order"
              >
                <Bike className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </Link>
            )}

            <Link
              to="/favorites"
              className="relative p-2 text-gray-700 hover:text-rose-600 flex items-center transition"
              aria-label="View Favorites"
              title="Favorites"
            >
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              {favorites.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-emerald-700 flex items-center"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-emerald-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Mobile Auth Button & Dropdown */}
            <div className="relative" ref={mobileDropdownRef}>
              <button
                type="button"
                onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs ml-1 cursor-pointer transition"
                title={currentUser?.name || "Account Menu"}
                aria-label="Account Menu"
              >
                {currentUser ? (
                  currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>

              {showMobileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-left">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100 bg-emerald-50/40">
                        <p className="text-xs font-bold text-gray-900 truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                      <div className="py-1 text-xs">
                        <Link
                          to="/admin"
                          onClick={() => setShowMobileDropdown(false)}
                          className="flex items-center justify-between px-4 py-2 font-bold text-slate-800 hover:bg-emerald-50 transition border-b border-gray-100"
                        >
                          <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                            <span>Admin Analytics</span>
                          </div>
                          <span className="text-[9px] uppercase font-mono px-1 rounded bg-slate-100 text-slate-600 font-bold">
                            {isAdminLoggedIn ? "Active" : "Portal"}
                          </span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setShowMobileDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                          <User className="w-4 h-4 text-emerald-600" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/favorites"
                          onClick={() => setShowMobileDropdown(false)}
                          className="flex items-center justify-between px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                            <span>Favorite Dishes</span>
                          </div>
                          {favorites.length > 0 && (
                            <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-1.5 py-0.5 rounded-full">
                              {favorites.length}
                            </span>
                          )}
                        </Link>
                        <Link
                          to="/order-history"
                          onClick={() => setShowMobileDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span>Past Orders</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMobileDropdown(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 font-bold text-red-600 hover:bg-red-50 transition border-t border-gray-100 mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-1 text-xs">
                      <Link
                        to="/login"
                        onClick={() => setShowMobileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 font-bold text-emerald-700 hover:bg-emerald-50 transition"
                      >
                        <User className="w-4 h-4" />
                        <span>Login / Sign Up</span>
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setShowMobileDropdown(false)}
                        className="flex items-center justify-between px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                          <span>Favorite Dishes</span>
                        </div>
                        {favorites.length > 0 && (
                          <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-1.5 py-0.5 rounded-full">
                            {favorites.length}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setShowMobileDropdown(false)}
                        className="flex items-center justify-between px-4 py-2 font-bold text-slate-800 hover:bg-emerald-50 transition border-t border-gray-100 mt-1"
                      >
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                          <span>Admin Analytics</span>
                        </div>
                        <span className="text-[9px] uppercase font-mono px-1 rounded bg-slate-100 text-slate-600 font-bold">
                          {isAdminLoggedIn ? "Active" : "Portal"}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="w-full md:flex-1 max-w-md relative flex items-center"
        >
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-sm text-gray-900 pl-10 pr-20 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 transition"
            placeholder="Search dishes, cuisines, ingredients..."
          />
          <button
            type="submit"
            className="absolute right-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Navigation Links, Cart Icon & User Auth */}
        <div className="hidden md:flex items-center gap-5 text-sm font-semibold">
          <Link
            to="/"
            className={`transition-colors hover:text-emerald-600 ${
              location.pathname === "/" ? "text-emerald-600 font-bold" : "text-gray-700"
            }`}
          >
            Explore
          </Link>

          <Link
            to="/favorites"
            className={`flex items-center gap-1.5 transition-colors hover:text-emerald-600 ${
              location.pathname === "/favorites" ? "text-emerald-600 font-bold" : "text-gray-700"
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Favorites</span>
            {favorites.length > 0 && (
              <span className="text-xs bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full font-bold">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Track Active Order link */}
          {activeOrder && (
            <Link
              to="/order-tracking"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition text-xs font-bold ${
                location.pathname === "/order-tracking"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border-emerald-200 shadow-2xs"
              }`}
            >
              <Bike className="w-4 h-4 text-emerald-600" />
              <span>Track Order</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </Link>
          )}

          {/* Desktop Currency Toggle (INR ₹ / USD $) */}
          <div
            className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-2xs"
            role="group"
            aria-label="Currency Selector"
            title={`Active currency: ${currency} • Static rate: 1 USD = ₹${exchangeRate}`}
          >
            <button
              type="button"
              onClick={() => setCurrency("INR")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currency === "INR"
                  ? "bg-white text-emerald-700 shadow-xs font-black"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              aria-pressed={currency === "INR"}
              aria-label="Switch to Indian Rupee"
            >
              <span>₹</span>
              <span>INR</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currency === "USD"
                  ? "bg-white text-emerald-700 shadow-xs font-black"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              aria-pressed={currency === "USD"}
              aria-label="Switch to US Dollar"
            >
              <span>$</span>
              <span>USD</span>
            </button>
          </div>

          {/* Cart Button with Count Badge */}
          <Link
            to="/cart"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition shadow-xs cursor-pointer ${
              totalCount > 0
                ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
            {totalCount > 0 ? (
              <span className="bg-white text-emerald-700 text-xs font-extrabold px-1.5 py-0.5 rounded-full">
                {totalCount}
              </span>
            ) : (
              <span className="text-xs text-gray-400 font-medium">0</span>
            )}
          </Link>

          {/* Auth Section: Login/Sign Up vs Profile / Logout Dropdown */}
          {!currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                aria-expanded={showDropdown}
              >
                <User className="w-3.5 h-3.5" />
                <span>Account</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                    <p className="text-xs font-black text-gray-900">MealDB Account</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Sign in to track orders, addresses & cart
                    </p>
                  </div>

                  <div className="py-1 text-xs">
                    <Link
                      to="/login"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 font-bold text-emerald-700 hover:bg-emerald-50 transition"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>Consumer Login / Sign Up</span>
                    </Link>

                    <Link
                      to="/admin"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center justify-between px-4 py-2.5 font-bold text-slate-800 hover:text-emerald-700 hover:bg-emerald-50 transition border-t border-gray-100 mt-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>Admin Analytics</span>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-extrabold ${
                          isAdminLoggedIn
                            ? "bg-emerald-200 text-emerald-900"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isAdminLoggedIn ? "Active" : "Portal"}
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/40 transition cursor-pointer text-xs font-bold text-gray-800 shadow-2xs"
                aria-expanded={showDropdown}
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="max-w-[100px] truncate">
                  {currentUser.name ? currentUser.name.split(" ")[0] : "Account"}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile / Logout Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {/* Profile Header with user's email */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-emerald-50/40">
                    <p className="text-xs font-black text-gray-900 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-800 truncate mt-0.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{currentUser.email}</span>
                    </p>
                  </div>

                  {/* Dropdown Links */}
                  <div className="py-1 text-xs">
                    <Link
                      to="/admin"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center justify-between px-4 py-2 font-bold text-slate-800 hover:text-emerald-700 hover:bg-emerald-50 transition border-b border-gray-100 mb-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>Admin Analytics</span>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-extrabold ${
                          isAdminLoggedIn
                            ? "bg-emerald-200 text-emerald-900"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isAdminLoggedIn ? "Active" : "Portal"}
                      </span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>My Profile & Settings</span>
                    </Link>

                    <Link
                      to="/order-tracking"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                    >
                      <Bike className="w-4 h-4 text-emerald-600" />
                      <span>Track Active Order</span>
                    </Link>

                    <Link
                      to="/order-history"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                    >
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Past Orders History</span>
                    </Link>

                    <Link
                      to="/favorites"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Favorite Dishes ({favorites.length})</span>
                    </Link>

                    <Link
                      to="/cart"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                    >
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                      <span>My Cart ({totalCount})</span>
                    </Link>
                  </div>

                  {/* Logout Action */}
                  <div className="pt-1 mt-1 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
