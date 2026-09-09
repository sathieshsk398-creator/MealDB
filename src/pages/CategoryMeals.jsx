import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMealsByCategory } from "../api/mealdb";
import LoadingSpinner from "../components/LoadingSpinner";
import MealCard from "../components/MealCard";
import { ArrowLeft, Utensils } from "lucide-react";

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
          console.log(err);
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Breadcrumb & Heading */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold capitalize text-gray-900 tracking-tight flex items-center gap-2">
              <span>{category} Dishes</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Popular and chef-crafted {category} selections delivered fresh
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full w-fit">
            {meals.length} {meals.length === 1 ? "dish" : "dishes"} available
          </span>
        </div>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-16">
          <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No meals found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
