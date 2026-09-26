import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, UtensilsCrossed, ArrowLeft, Sparkles } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Search Breadcrumb & Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Search Results</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Search className="w-8 h-8 text-emerald-600 stroke-[2.5]" />
              <span>Results for "{query}"</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Recipes matching your culinary search
            </p>
          </div>
          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full w-fit">
            {meals.length} {meals.length === 1 ? "recipe found" : "recipes found"}
          </span>
        </div>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <UtensilsCrossed className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No recipes found matching "{query}"</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            Try searching for delicious classics like Biryani, Dosa, Parotta, Butter Chicken, or Pasta.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/30"
          >
            <span>Explore All Recipes</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
          {meals.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
