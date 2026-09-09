import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, UtensilsCrossed, Flame, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import MealCard from "../components/MealCard";
import { fetchCategories, fetchMealsByCategory } from "../api/mealdb";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [popularData, setPopularData] = useState({ meals: [], category: null });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Chicken");

  useEffect(() => {
    let ignore = false;
    const loadCategories = () => {
      fetchCategories()
        .then((res) => {
          if (!ignore) {
            setCategories(res.data.categories || []);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(err);
          if (!ignore) setLoading(false);
        });
    };

    loadCategories();

    const handleUpdate = () => {
      loadCategories();
    };

    window.addEventListener("admin_custom_dishes_updated", handleUpdate);
    return () => {
      ignore = true;
      window.removeEventListener("admin_custom_dishes_updated", handleUpdate);
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadMeals = () => {
      fetchMealsByCategory(selectedCategory)
        .then((res) => {
          if (!ignore) {
            // Take top 8 popular dishes
            const dishes = (res.data.meals || []).slice(0, 8);
            setPopularData({ meals: dishes, category: selectedCategory });
          }
        })
        .catch((err) => {
          console.error(err);
          if (!ignore) {
            setPopularData({ meals: [], category: selectedCategory });
          }
        });
    };

    loadMeals();

    const handleUpdate = () => {
      loadMeals();
    };

    window.addEventListener("admin_custom_dishes_updated", handleUpdate);
    return () => {
      ignore = true;
      window.removeEventListener("admin_custom_dishes_updated", handleUpdate);
    };
  }, [selectedCategory]);

  const popularLoading = popularData.category !== selectedCategory;
  const popularMeals = popularLoading ? [] : popularData.meals;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-10 sm:space-y-12">
      {/* Swiggy/Zomato style Hero Promo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-800 text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200 border border-emerald-400/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Fast & Fresh Food Delivery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Order from top gourmet cuisines delivered hot to your doorstep.
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-xl">
            Explore hundreds of handcrafted dishes with pure ingredients. Add to cart, customize your servings, and enjoy instant checkout.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-200">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Avg 25-35 mins delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Contactless & sanitized</span>
            </div>
          </div>
        </div>

        {/* Decorative Background Blob */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* "What's on your mind?" Circular Cuisine Category Carousel */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
              <span>What's on your mind?</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Choose your favorite food category
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.strCategory.toLowerCase();
            return (
              <button
                key={cat.idCategory}
                onClick={() => setSelectedCategory(cat.strCategory)}
                className={`group flex flex-col items-center gap-2 shrink-0 cursor-pointer p-2 rounded-2xl transition-all ${
                  isSelected
                    ? "bg-emerald-50 ring-2 ring-emerald-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-200 border-2 border-white">
                  <img
                    src={cat.strCategoryThumb}
                    alt={cat.strCategory}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span
                  className={`text-xs font-bold text-center tracking-tight truncate max-w-[85px] ${
                    isSelected ? "text-emerald-800" : "text-gray-700"
                  }`}
                >
                  {cat.strCategory}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Dishes with Mock Prices and 'Add to Cart' */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Popular {selectedCategory} Dishes
            </h2>
          </div>
          <Link
            to={`/category/${selectedCategory}`}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {popularLoading ? (
          <div className="py-12">
            <LoadingSpinner />
          </div>
        ) : popularMeals.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No dishes found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularMeals.map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={{ ...meal, strCategory: selectedCategory }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Explore All Food Categories Grid */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Explore All Food Categories
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Browse by culinary tradition, recipes, and taste preferences
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              to={`/category/${cat.strCategory}`}
              key={cat.idCategory}
              className="group bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col items-center text-center"
            >
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-3">
                <img
                  src={cat.strCategoryThumb}
                  alt={cat.strCategory}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors">
                {cat.strCategory}
              </h3>
              <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                {cat.strCategoryDescription?.slice(0, 40)}...
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
