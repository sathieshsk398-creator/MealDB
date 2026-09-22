import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Sparkles,
  Clock,
  ShieldCheck,
  Flame,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";
import { searchMeals } from "../api/mealdb";
import { useCurrency } from "../contexts/CurrencyContext";
import heroBg from "../assets/images/hero_food_delivery_bg_1790056258373.jpg";

const POPULAR_TAGS = [
  { label: "Mutton Biryani", query: "Mutton Biryani", icon: "🍖" },
  { label: "Masala Dosa", query: "Masala Dosa", icon: "🥞" },
  { label: "Chicken 65", query: "Chicken 65", icon: "🍗" },
  { label: "Bun Parotta", query: "Bun Parotta", icon: "🫓" },
  { label: "Butter Chicken", query: "Butter Chicken", icon: "🍛" },
  { label: "Filter Coffee", query: "Filter Coffee", icon: "☕" },
  { label: "Gulab Jamun", query: "Gulab Jamun", icon: "🍯" },
];

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  // Handle live suggestions
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed || trimmed.length < 2) {
      const timer = setTimeout(() => {
        setSuggestions([]);
        setIsSearching(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    let isMounted = true;
    const timer = setTimeout(() => {
      setIsSearching(true);
      searchMeals(trimmed)
        .then((res) => {
          if (isMounted) {
            const meals = res.data.meals || [];
            setSuggestions(meals.slice(0, 5));
            setIsSearching(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setSuggestions([]);
            setIsSearching(false);
          }
        });
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleTagClick = (query) => {
    setSearchTerm(query);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSelectMeal = (mealId) => {
    setShowSuggestions(false);
    navigate(`/meal/${mealId}`);
  };

  return (
    <div
      id="hero-banner-section"
      className="relative overflow-hidden rounded-3xl sm:rounded-4xl shadow-2xl bg-gray-950 border border-gray-800 text-white min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center"
    >
      {/* AI-Generated Background Image */}
      <img
        src={heroBg}
        alt="Gourmet Indian & Tamil Nadu Food Spread"
        className="absolute inset-0 w-full h-full object-cover object-center lg:object-right transition-transform duration-700 hover:scale-105"
        referrerPolicy="no-referrer"
        loading="eager"
      />

      {/* Cinematic Layered Vignette Overlays for High Legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-950/40 lg:via-gray-950/80 lg:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
      <div className="absolute inset-0 bg-radial-at-tl from-emerald-950/40 via-transparent to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-3xl px-6 py-10 sm:px-10 sm:py-14 lg:py-16 space-y-6 sm:space-y-7">
        {/* Modern Live Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-300 border border-emerald-400/30 shadow-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Authentic Indian & Tamil Cuisines • Fast 30-Min Delivery</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
            Craving Great Food? <br className="hidden sm:inline" />
            Delivered{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Hot, Fresh & Fast.
            </span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
            Savor 100+ chef-crafted specialties — fragrant Seeraga Samba biryanis,
            crispy ghee roast dosas, Chettinad curries, and sizzling tandoori delights.
          </p>
        </div>

        {/* High-Impact Integrated Search Bar */}
        <div ref={searchContainerRef} className="relative max-w-xl pt-1">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-white rounded-2xl p-1.5 sm:p-2 shadow-2xl ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200"
          >
            <div className="pl-3 sm:pl-3.5 pr-2 text-emerald-600">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <input
              id="hero-meal-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (searchTerm.trim().length >= 2) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="Search dishes (e.g. Biryani, Masala Dosa, Parotta)..."
              className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base font-medium focus:outline-hidden py-2"
              autoComplete="off"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSuggestions([]);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors mr-1 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              id="hero-meal-search-btn"
              type="submit"
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs sm:text-sm shadow-md cursor-pointer group"
            >
              <span>Find Food</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Live Suggestions Dropdown */}
          {showSuggestions && searchTerm.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-gray-900 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 border-b border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500 bg-gray-50/70">
                <span className="flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
                  Matching Dishes
                </span>
                {isSearching && (
                  <span className="text-emerald-600 animate-pulse">Searching...</span>
                )}
              </div>

              {suggestions.length > 0 ? (
                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {suggestions.map((meal) => (
                    <button
                      key={meal.idMeal}
                      id={`hero-suggestion-${meal.idMeal}`}
                      type="button"
                      onClick={() => handleSelectMeal(meal.idMeal)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50/60 transition-colors text-left cursor-pointer group"
                    >
                      <img
                        src={meal.strMealThumb}
                        alt={meal.strMeal}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0 group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                            {meal.strMeal}
                          </h4>
                          {meal.isVeg ? (
                            <span className="shrink-0 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200">
                              VEG
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-sm border border-rose-200">
                              NON-VEG
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {meal.strCategory} • {meal.strArea || "Tamil Nadu"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm text-emerald-700">
                          {formatPrice(meal.price || 149)}
                        </span>
                      </div>
                    </button>
                  ))}
                  <button
                    id="hero-view-all-results-btn"
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full py-2.5 px-4 text-center text-xs font-bold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View all matching results for "{searchTerm}"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : !isSearching ? (
                <div className="p-6 text-center text-xs text-gray-500">
                  No meals found matching "{searchTerm}". Try searching for "Dosa", "Biryani", or "Curry".
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Trending Searches Quick Chips */}
        <div className="pt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Trending:
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag.label}
              id={`hero-trending-tag-${tag.label.toLowerCase().replace(/\s+/g, "-")}`}
              type="button"
              onClick={() => handleTagClick(tag.query)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 active:bg-white/30 text-white backdrop-blur-sm border border-white/15 transition-all duration-150 cursor-pointer"
            >
              <span>{tag.icon}</span>
              <span>{tag.label}</span>
            </button>
          ))}
        </div>

        {/* Key Guarantees & Highlights */}
        <div className="pt-2 flex flex-wrap items-center gap-5 sm:gap-8 text-xs font-medium text-gray-300 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span>Avg 25–35 Mins Delivery</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>100+ Chef-Crafted Dishes</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>Sanitized & Safe Packaging</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
