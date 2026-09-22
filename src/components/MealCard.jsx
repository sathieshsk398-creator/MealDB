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
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
        <Link to={`/meal/${meal.idMeal}`} className="block h-full w-full">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </Link>
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton meal={meal} onToggle={toggle} isFav={fav} />
        </div>
        <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{deliveryTime}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                <Star className="w-3 h-3 fill-white" />
                <span>{rating}</span>
              </span>
              {meal.dietType && (
                <span
                  title={meal.dietType === "veg" ? "Pure Vegetarian" : "Non-Vegetarian"}
                  className={`inline-flex items-center justify-center w-4 h-4 rounded border ${
                    meal.dietType === "veg"
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-rose-600 bg-rose-50"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      meal.dietType === "veg" ? "bg-emerald-600" : "bg-rose-600"
                    }`}
                  />
                </span>
              )}
              {meal.isCustom && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  Chef Special
                </span>
              )}
            </div>
            {meal.strCategory && (
              <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                {meal.strCategory}
              </span>
            )}
          </div>

          <Link to={`/meal/${meal.idMeal}`} className="block">
            <h3
              title={meal.strMeal}
              className="font-bold text-gray-900 text-base leading-snug line-clamp-1 hover:text-emerald-700 transition-colors"
            >
              {meal.strMeal}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {meal.strArea ? `${meal.strArea} Style Cuisine` : "Chef's Special Recommendation"}
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Price</span>
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">
              {formatPrice(price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {quantity === 0 ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-2 rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
                title="Add to cart"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </button>
            ) : (
              <div className="inline-flex items-center bg-emerald-50 border border-emerald-600 text-emerald-800 rounded-xl overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="px-2 py-1.5 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus className="w-3 h-3 stroke-[2.5]" />
                </button>
                <span className="px-1.5 text-xs font-bold min-w-[18px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="px-2 py-1.5 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleBuyNow}
              className="inline-flex items-center justify-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-2 rounded-xl shadow-xs transition-all duration-200 cursor-pointer whitespace-nowrap"
              title="Buy now - checkout only this dish"
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
