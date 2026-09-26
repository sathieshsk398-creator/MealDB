import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  UtensilsCrossed,
  Globe,
  Compass,
} from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";

const Header = () => {
  const location = useLocation();
  const { favorites } = useFavorites();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-md shadow-emerald-600/30 transition-all duration-300 group-hover:scale-105">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none">
                Dish<span className="text-emerald-600">ly</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest block mt-0.5">
                Meal Explorer
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile Navigation Shortcuts */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/categories"
            className={`p-2 rounded-xl transition ${
              location.pathname.startsWith("/categories") || location.pathname.startsWith("/category")
                ? "bg-emerald-50 text-emerald-700 font-bold"
                : "text-slate-700 hover:text-emerald-700"
            }`}
            aria-label="Explore Categories"
            title="Categories"
          >
            <Compass className="w-5 h-5" />
          </Link>

          <Link
            to="/cuisines"
            className={`p-2 rounded-xl transition ${
              location.pathname.startsWith("/cuisine")
                ? "bg-emerald-50 text-emerald-700 font-bold"
                : "text-slate-700 hover:text-emerald-700"
            }`}
            aria-label="Explore Cuisines"
            title="Explore Cuisines"
          >
            <Globe className="w-5 h-5" />
          </Link>

          <Link
            to="/favorites"
            className={`relative p-2 rounded-xl transition flex items-center ${
              location.pathname === "/favorites"
                ? "bg-rose-50 text-rose-600 font-bold"
                : "text-slate-700 hover:text-rose-600"
            }`}
            aria-label="View Favorites"
            title="Favorite Recipes"
          >
            <Heart
              className={`w-5 h-5 ${
                favorites.length > 0 ? "text-rose-500 fill-rose-500" : "text-slate-700"
              }`}
            />
            {favorites.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {favorites.length}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link
            to="/"
            className={`transition-colors hover:text-emerald-600 ${
              location.pathname === "/" ? "text-emerald-600 font-bold" : "text-slate-700"
            }`}
          >
            Explore Recipes
          </Link>

          <Link
            to="/categories"
            className={`flex items-center gap-1.5 transition-colors hover:text-emerald-600 ${
              location.pathname.startsWith("/categories") || location.pathname.startsWith("/category")
                ? "text-emerald-600 font-bold"
                : "text-slate-700"
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Categories</span>
          </Link>

          <Link
            to="/cuisines"
            className={`flex items-center gap-1.5 transition-colors hover:text-emerald-600 ${
              location.pathname.startsWith("/cuisine") ? "text-emerald-600 font-bold" : "text-slate-700"
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Cuisines & Areas</span>
          </Link>

          <Link
            to="/favorites"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
              location.pathname === "/favorites"
                ? "bg-rose-50 text-rose-600 font-bold border border-rose-200"
                : "text-slate-700 hover:text-rose-600 hover:bg-slate-50 border border-transparent"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                favorites.length > 0 ? "text-rose-500 fill-rose-500" : "text-slate-500"
              }`}
            />
            <span>Saved Recipes</span>
            {favorites.length > 0 && (
              <span className="text-xs bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                {favorites.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
