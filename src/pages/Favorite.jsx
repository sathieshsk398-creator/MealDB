import { useFavorites } from "../contexts/FavoritesContext";
import MealCard from "../components/MealCard";
import { Link } from "react-router-dom";
import { Heart, UtensilsCrossed, Loader2, Trash2 } from "lucide-react";

const Favorite = () => {
  const { favorites, favoritesLoading, clearFavorites } = useFavorites();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Favorite Dishes</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Your saved recipes and frequently ordered meals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
            {favorites.length} saved
          </span>

          {favorites.length > 0 && (
            <button
              type="button"
              onClick={clearFavorites}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-full transition cursor-pointer border border-transparent hover:border-red-200"
              title="Clear all saved favorites"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {favoritesLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-500">Syncing your favorites...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-xs max-w-lg mx-auto p-8">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-rose-400 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No favorites saved yet</h3>
          <p className="text-gray-500 text-xs sm:text-sm mb-6 leading-relaxed">
            Tap the heart icon on any dish while exploring to quickly bookmark it here for fast reordering.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-sm"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Explore Dishes</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;
