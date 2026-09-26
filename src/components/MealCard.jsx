import { Link } from "react-router-dom";
import { BookOpen, Star } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { useFavorites } from "../contexts/FavoritesContext";
import { getMealRating } from "../utils/price";

const MealCard = ({ meal }) => {
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(meal.idMeal);
  const rating = getMealRating(meal);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100/90 shadow-sm hover:shadow-2xl hover:border-emerald-200/80 transition-all duration-300 flex flex-col h-full relative transform hover:-translate-y-1">
      {/* Recipe Image Container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
        <Link to={`/meal/${meal.idMeal}`} className="block h-full w-full">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </Link>

        {/* Gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 pointer-events-none" />

        {/* Favorite Button on top right */}
        <div className="absolute top-3 right-3 z-10 transition-transform active:scale-90">
          <FavoriteButton meal={meal} onToggle={toggle} isFav={fav} />
        </div>

        {/* Diet Type Dot Badge on Image */}
        {meal.dietType && (
          <div className="absolute top-3 left-3 z-10">
            <span
              title={meal.dietType === "veg" ? "Vegetarian Recipe" : "Non-Vegetarian Recipe"}
              className={`inline-flex items-center justify-center w-5 h-5 rounded-md border-2 bg-white shadow-md ${
                meal.dietType === "veg" ? "border-emerald-600" : "border-rose-600"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  meal.dietType === "veg" ? "bg-emerald-600" : "bg-rose-600"
                }`}
              />
            </span>
          </div>
        )}

        {/* Cuisine / Area tag on bottom left of image */}
        {meal.strArea && (
          <div className="absolute bottom-3 left-3 bg-slate-950/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md border border-white/10">
            <span>{meal.strArea} Cuisine</span>
          </div>
        )}
      </div>

      {/* Recipe Details Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata Row: Rating and Category (Unboxed Text with · separator) */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-black px-1.5 py-0.5 rounded-md shadow-2xs">
                <Star className="w-3 h-3 fill-white" />
                <span>{rating}</span>
              </span>
              {meal.isCustom && (
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  Chef Pick
                </span>
              )}
            </div>

            {meal.strCategory && (
              <span className="text-xs font-semibold text-emerald-800 truncate max-w-[140px]">
                {meal.strCategory}
              </span>
            )}
          </div>

          {/* Recipe Title */}
          <Link to={`/meal/${meal.idMeal}`} className="block group-hover:text-emerald-600 transition-colors">
            <h3
              title={meal.strMeal}
              className="font-extrabold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors"
            >
              {meal.strMeal}
            </h3>
          </Link>

          {/* Quick Subtitle */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">
            {meal.strArea ? `${meal.strArea} recipe with step-by-step instructions` : "Authentic recipe with complete ingredients"}
          </p>
        </div>

        {/* View Recipe Action (Replaces Add to Cart & Buy Now) */}
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <Link
            to={`/meal/${meal.idMeal}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all duration-200 group-hover:bg-emerald-600 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            <span>View Recipe</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
