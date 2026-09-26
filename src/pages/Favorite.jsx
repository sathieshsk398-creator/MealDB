import { useFavorites } from "../contexts/FavoritesContext";
import MealCard from "../components/MealCard";
import { Link } from "react-router-dom";
import { Heart, UtensilsCrossed, Trash2, Sparkles, Compass } from "lucide-react";

const Favorite = () => {
  const { favorites, favoritesLoading, clearFavorites } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-rose-500 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wishlist & Favorites</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            <span>Saved Recipes</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Your personal cookbook and saved culinary favorites
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200">
            {favorites.length} saved
          </span>

          {favorites.length > 0 && (
            <button
              type="button"
              onClick={clearFavorites}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-3.5 py-1.5 rounded-full transition cursor-pointer border border-transparent hover:border-red-200"
              title="Clear all saved favorites"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {favoritesLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold">Loading your favorites...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-lg mx-auto p-8 sm:p-10">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-500">
            <Heart className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No Saved Recipes Yet</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            Click the heart icon on any recipe while exploring to save it to your personal cookbook for quick cooking anytime!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/30"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Explore All Recipes</span>
            </Link>
            <Link
              to="/cuisines"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl transition"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Cuisines</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
          {favorites.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;
