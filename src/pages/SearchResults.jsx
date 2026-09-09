import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, UtensilsCrossed, ArrowLeft } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { searchMeals } from "../api/mealdb";
import MealCard from "../components/MealCard";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchData, setSearchData] = useState({ meals: [], query: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    let ignore = false;
    const runSearch = () => {
      searchMeals(query)
        .then((res) => {
          if (!ignore) {
            setSearchData({ meals: res.data.meals || [], query });
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

    runSearch();

    const handleUpdate = () => {
      runSearch();
    };

    window.addEventListener("admin_custom_dishes_updated", handleUpdate);
    return () => {
      ignore = true;
      window.removeEventListener("admin_custom_dishes_updated", handleUpdate);
    };
  }, [query]);

  const isLoading = Boolean(query && (loading || searchData.query !== query));
  if (isLoading) return <LoadingSpinner />;

  const meals = query ? (searchData.query === query ? searchData.meals : []) : [];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Search className="w-6 h-6 text-emerald-600" />
              <span>Results for "{query}"</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Dishes matching your search query
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full w-fit">
            {meals.length} {meals.length === 1 ? "dish found" : "dishes found"}
          </span>
        </div>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-16">
          <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">No meals found matching "{query}"</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Try searching for ingredients like chicken, pasta, beef, or popular dishes.
          </p>
          <Link
            to="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-sm"
          >
            Browse Categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {meals.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
