import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMealsByCategory } from "../api/mealdb";
import LoadingSpinner from "../components/LoadingSpinner";
import MealCard from "../components/MealCard";
import { ArrowLeft, Utensils, Sparkles } from "lucide-react";

const CategoryMeals = () => {
  const { category } = useParams();
  const [data, setData] = useState({ meals: [], category: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const load = () => {
      fetchMealsByCategory(category)
        .then((res) => {
          if (!ignore) {
            setData({ meals: res.data.meals || [], category });
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(err);
          if (!ignore) {
            setLoading(false);
          }
        });
    };

    load();

    const handleUpdate = () => {
      load();
    };

    window.addEventListener("admin_custom_dishes_updated", handleUpdate);
    return () => {
      ignore = true;
      window.removeEventListener("admin_custom_dishes_updated", handleUpdate);
    };
  }, [category]);

  const isLoading = loading || data.category !== category;

  if (isLoading) return <LoadingSpinner />;
  const meals = data.meals;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Breadcrumb & Heading Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Categories</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Category Selection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black capitalize text-slate-900 tracking-tight">
              {category} Recipes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Authentic and chef-tested {category} recipes with step-by-step methods and exact ingredients
            </p>
          </div>
          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full w-fit">
            {meals.length} {meals.length === 1 ? "recipe" : "recipes"} available
          </span>
        </div>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
          <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No meals found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
          {meals.map((meal) => (
            <MealCard
              key={meal.idMeal}
              meal={{ ...meal, strCategory: category }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryMeals;
