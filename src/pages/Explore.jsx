import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Globe, ChefHat, Sparkles, Filter, RefreshCw } from "lucide-react";
import { fetchAreas, fetchMealsByArea, fetchRandomMeal } from "../api/mealdb";
import MealCard from "../components/MealCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeArea = searchParams.get("area") || "Tamil Nadu";

  const [areas, setAreas] = useState([]);
  const [mealsData, setMealsData] = useState({ meals: [], area: null });
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [randomMeal, setRandomMeal] = useState(null);
  const [randomLoading, setRandomLoading] = useState(false);

  // Load available cuisines / areas
  useEffect(() => {
    let ignore = false;
    fetchAreas()
      .then((res) => {
        if (!ignore) {
          const list = res.data?.areas || [];
          setAreas(list);
          setLoadingAreas(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load areas:", err);
        if (!ignore) setLoadingAreas(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Load meals for selected area / cuisine
  useEffect(() => {
    let ignore = false;
    fetchMealsByArea(activeArea)
      .then((res) => {
        if (!ignore) {
          setMealsData({ meals: res.data?.meals || [], area: activeArea });
        }
      })
      .catch((err) => {
        console.error("Failed to load meals by area:", err);
        if (!ignore) {
          setMealsData({ meals: [], area: activeArea });
        }
      });
    return () => {
      ignore = true;
    };
  }, [activeArea]);

  const meals = mealsData.area === activeArea ? mealsData.meals : [];
  const loadingMeals = mealsData.area !== activeArea;

  // Handler for Random Meal Discovery
  const handleGetRandomMeal = async () => {
    setRandomLoading(true);
    try {
      const res = await fetchRandomMeal();
      if (res.data?.meal) {
        setRandomMeal(res.data.meal);
      }
    } catch (err) {
      console.error("Error fetching random meal:", err);
    } finally {
      setRandomLoading(false);
    }
  };

  const handleSelectArea = (areaName) => {
    setSearchParams({ area: areaName });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest mb-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>Indian & Tamil Regional Cuisines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>Explore Regional Flavors</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Discover authentic culinary traditions from Tamil Nadu, Chettinad, Madurai, Kerala, and across India
          </p>
        </div>

        {/* Random Meal Discovery Trigger */}
        <button
          type="button"
          onClick={handleGetRandomMeal}
          disabled={randomLoading}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-black uppercase tracking-wider px-5 py-3 rounded-2xl shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className={`w-4 h-4 ${randomLoading ? "animate-spin" : ""}`} />
          <span>{randomLoading ? "Discovering..." : "Discover a Random Meal"}</span>
        </button>
      </div>

      {/* Random Meal Highlight Card (If Triggered) */}
      {randomMeal && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>Chef's Random Discovery</span>
          </div>
          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 rounded-2xl overflow-hidden shadow-md aspect-video sm:aspect-square md:aspect-video bg-white">
              <img
                src={randomMeal.strMealThumb}
                alt={randomMeal.strMeal}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                  {randomMeal.strCategory || "Recipe"}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-amber-200">
                  {randomMeal.strArea || "Global"}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                {randomMeal.strMeal}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {randomMeal.strInstructions || "Explore this delicious chef's suggestion!"}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  to={`/meal/${randomMeal.idMeal}`}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition"
                >
                  <span>View Full Recipe</span>
                </Link>
                <button
                  type="button"
                  onClick={handleGetRandomMeal}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  Try Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cuisines / Areas Pill Selector */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 mb-4 text-xs font-black text-slate-500 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          <span>Select Cuisine</span>
        </div>

        {loadingAreas ? (
          <div className="py-4">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {areas.map((area) => {
              const isSelected = activeArea.toLowerCase() === area.toLowerCase();
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleSelectArea(area)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Cuisine Meals Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeArea} Recipes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing {meals.length} traditional dishes from {activeArea} cuisine
            </p>
          </div>
        </div>

        {loadingMeals ? (
          <div className="py-20">
            <LoadingSpinner />
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs">
            <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-black text-slate-800">No Recipes Found</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Could not find dishes for {activeArea}. Try selecting another cuisine above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {meals.map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={{ ...meal, strArea: activeArea }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Explore;
