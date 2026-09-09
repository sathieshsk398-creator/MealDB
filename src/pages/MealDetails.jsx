import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Clock, Plus, Minus, ShoppingCart, Check, UtensilsCrossed, Heart, Zap } from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import { useCart } from "../contexts/CartContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { fetchMealsById } from "../api/mealdb";
import LoadingSpinner from "../components/LoadingSpinner";
import FavoriteButton from "../components/FavoriteButton";
import { getMealPrice, getMealRating, getMealDeliveryTime } from "../utils/price";

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mealData, setMealData] = useState({ meal: null, id: null });
  const [loading, setLoading] = useState(true);
  const [addedNotice, setAddedNotice] = useState(false);
  const { toggle, isFavorite } = useFavorites();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    let ignore = false;
    fetchMealsById(id)
      .then((res) => {
        if (!ignore) {
          setMealData({ meal: res.data.meals?.[0] || null, id });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        if (!ignore) {
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const isLoading = loading || mealData.id !== id;
  if (isLoading) return <LoadingSpinner />;
  const meal = mealData.meal;
  if (!meal) return <p className="text-center text-xl mt-20 text-gray-600">Meal not found.</p>;

  const price = getMealPrice(meal);
  const rating = getMealRating(meal);
  const deliveryTime = getMealDeliveryTime(meal);
  const quantity = getItemQuantity(meal.idMeal);

  const handleAddToCart = () => {
    addToCart(meal, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    const buyItem = {
      idMeal: String(meal.idMeal),
      strMeal: meal.strMeal || "Delicious Meal",
      strMealThumb: meal.strMealThumb || "",
      strCategory: meal.strCategory || "Meal",
      strArea: meal.strArea || "Delicious",
      price,
      quantity: quantity > 0 ? quantity : 1,
    };
    navigate("/cart", { state: { buyNowItem: buyItem } });
  };

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing?.trim()) ingredients.push(`${measure ? `${measure} ` : ""}${ing}`);
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <Link to={`/category/${meal.strCategory}`} className="hover:text-emerald-700">{meal.strCategory}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{meal.strMeal}</span>
      </nav>

      <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image with badges & Favorite */}
        <div className="md:col-span-6 relative group">
          <div className="rounded-3xl overflow-hidden shadow-md border border-gray-100 bg-gray-100">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full h-80 sm:h-96 object-cover"
            />
          </div>
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton meal={meal} onToggle={toggle} isFav={isFavorite(meal.idMeal)} />
          </div>
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-xs font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Delivers in {deliveryTime}</span>
          </div>
        </div>

        {/* Right Column: Title, Cuisines, Pricing & Add to Cart Action */}
        <div className="md:col-span-6 flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-sm font-bold px-2.5 py-1 rounded-lg shadow-xs">
                <Star className="w-4 h-4 fill-white" />
                <span>{rating}</span>
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
                {meal.strCategory}
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-semibold">
                {meal.strArea} Cuisine
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {meal.strMeal}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Freshly prepared with authentic ingredients, seasoned to perfection.
            </p>
          </div>

          {/* Pricing & Add to Cart Block */}
          <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">Item Price</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-gray-900 tracking-tight">
                  {formatPrice(price)}
                </span>
                <span className="text-xs text-gray-500">per serving</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {quantity === 0 ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center bg-white border-2 border-emerald-600 text-emerald-800 rounded-xl overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => updateQuantity(meal.idMeal, -1)}
                      className="px-3 py-2 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                      title="Decrease quantity"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <span className="px-3 text-sm font-bold min-w-[28px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(meal.idMeal, 1)}
                      className="px-3 py-2 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                      title="Increase quantity"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                  <Link
                    to="/cart"
                    className="inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-3 rounded-xl transition cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>View Cart</span>
                  </Link>
                </div>
              )}

              {/* Buy Now Button (Instant Single-Dish Checkout) */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer text-sm"
                title="Buy Now (Direct Single-Item Checkout)"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                onClick={() => toggle(meal)}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isFavorite(meal.idMeal)
                    ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-rose-600"
                }`}
                title={isFavorite(meal.idMeal) ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    isFavorite(meal.idMeal) ? "fill-rose-500 text-rose-500 scale-110" : "text-gray-500"
                  }`}
                />
                <span>
                  {isFavorite(meal.idMeal) ? "Favorited" : "Save Favorite"}
                </span>
              </button>
            </div>
          </div>

          {addedNotice && (
            <div className="bg-emerald-100/90 text-emerald-900 border border-emerald-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                Added 1x {meal.strMeal} to your cart!
              </span>
              <Link to="/cart" className="underline font-bold hover:text-emerald-950">
                Go to Checkout →
              </Link>
            </div>
          )}

          {/* Quick Details / Video */}
          <div className="flex items-center gap-3">
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
              >
                Watch Video Recipe
              </a>
            )}
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
              <span>{ingredients.length} Ingredients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients & Instructions Tabs / Grid */}
      <div className="grid md:grid-cols-12 gap-8 mt-12">
        {/* Ingredients */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
            <span>Ingredients Needed</span>
            <span className="text-xs font-normal text-gray-500">{ingredients.length} items</span>
          </h2>
          <ul className="divide-y divide-gray-50 space-y-2">
            {ingredients.map((item, index) => (
              <li key={index} className="pt-2 flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">{item}</span>
                <span className="text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">✓</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Cooking Instructions
          </h2>
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {meal.strInstructions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetails;
