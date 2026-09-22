import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, Plus, Minus, Zap } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { useFavorites } from "../contexts/FavoritesContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { getMealPrice, getMealRating, getMealDeliveryTime } from "../utils/price";

const MealCard = ({ meal }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toggle, isFavorite } = useFavorites();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { formatPrice } = useCurrency();
  const fav = isFavorite(meal.idMeal);
  const price = getMealPrice(meal);
  const rating = getMealRating(meal);
  const deliveryTime = getMealDeliveryTime(meal);
  const quantity = getItemQuantity(meal.idMeal);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(meal, 1);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(meal.idMeal, -1);
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(meal.idMeal, 1);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate("/login", {
        state: {
          from: "/cart?mode=buynow",
          message: "Please sign in to proceed with Buy Now.",
        },
      });
      return;
    }

    const buyNowDish = {
      idMeal: String(meal.idMeal),
      strMeal: meal.strMeal || "Delicious Dish",
      strMealThumb: meal.strMealThumb || "",
      strCategory: meal.strCategory || "Meal",
      strArea: meal.strArea || "Chef Special",
      price: typeof meal.price === "number" ? meal.price : price,
      quantity: 1,
      deliveryTime: deliveryTime || "25-35 mins",
      dietType: meal.dietType || null,
      isCustom: Boolean(meal.isCustom),
    };

    try {
      sessionStorage.setItem("mealdb_buynow_item", JSON.stringify(buyNowDish));
    } catch (err) {
      console.warn("Failed to persist buy now item to session", err);
    }

    navigate("/cart?mode=buynow", {
      state: { buyNowItem: buyNowDish },
    });
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100/90 shadow-sm hover:shadow-2xl hover:border-emerald-200/80 transition-all duration-300 flex flex-col h-full relative transform hover:-translate-y-1">
      {/* Food Image Container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
        <Link to={`/meal/${meal.idMeal}`} className="block h-full w-full">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Gradient shadow overlay for badge readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />

        {/* Favorite Button on top right */}
        <div className="absolute top-3 right-3 z-10 transition-transform active:scale-90">
          <FavoriteButton meal={meal} onToggle={toggle} isFav={fav} />
        </div>

        {/* Delivery Time Pill (Glassmorphic) */}
        <div className="absolute bottom-3 left-3 bg-slate-950/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md border border-white/10">
          <Clock className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
          <span>{deliveryTime}</span>
        </div>

        {/* Diet Type Dot Badge on Image */}
        {meal.dietType && (
          <div className="absolute top-3 left-3 z-10">
            <span
              title={meal.dietType === "veg" ? "Pure Vegetarian" : "Non-Vegetarian"}
              className={`inline-flex items-center justify-center w-5 h-5 rounded-md border-2 bg-white shadow-md ${
                meal.dietType === "veg"
                  ? "border-emerald-600"
                  : "border-rose-600"
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
      </div>

      {/* Food Details Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Rating & Tag Badges */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-lg shadow-xs">
                <Star className="w-3 h-3 fill-white" />
                <span>{rating}</span>
              </span>

              {meal.isCustom && (
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded-md">
                  Chef Pick
                </span>
              )}
            </div>

            {meal.strCategory && (
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-100 px-2.5 py-0.5 rounded-full truncate max-w-[125px]">
                {meal.strCategory}
              </span>
            )}
          </div>

          {/* Dish Title */}
          <Link to={`/meal/${meal.idMeal}`} className="block group-hover:text-emerald-600 transition-colors">
            <h3
              title={meal.strMeal}
              className="font-extrabold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors"
            >
              {meal.strMeal}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">
            {meal.strArea ? `${meal.strArea} Style Culinary Special` : "Chef's Special Recommendation"}
          </p>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price</span>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              {formatPrice(price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Add to Cart Control */}
            {quantity === 0 ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition-all duration-200 cursor-pointer"
                title="Add to cart"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add</span>
              </button>
            ) : (
              <div className="inline-flex items-center bg-emerald-50 border border-emerald-500/80 text-emerald-800 rounded-xl overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="px-2.5 py-1.5 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus className="w-3 h-3 stroke-[3]" />
                </button>
                <span className="px-2 text-xs font-black min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="px-2.5 py-1.5 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            )}

            {/* Instant Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="inline-flex items-center justify-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xl shadow-md shadow-amber-500/20 transition-all duration-200 cursor-pointer whitespace-nowrap"
              title="Buy now - instant checkout"
            >
              <Zap className="w-3.5 h-3.5 fill-white stroke-white" />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
