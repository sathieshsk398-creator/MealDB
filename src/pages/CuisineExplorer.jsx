import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Globe, Sparkles, ArrowLeft, Search, Layers, ChevronRight, Utensils, Filter } from "lucide-react";
import { fetchAreas, fetchMealsByArea } from "../api/mealdb";
import { getCategoriesForArea } from "../data/worldCuisineCategories";
import MealCard from "../components/MealCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CuisineExplorer = () => {
  const { area: paramArea } = useParams();
  const navigate = useNavigate();

  const [areas, setAreas] = useState([]);
  const [internalArea, setInternalArea] = useState("Tamil Nadu");
  const [mealsData, setMealsData] = useState({ meals: [], area: null });
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [dishSearch, setDishSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const selectedArea = paramArea || internalArea;

  // Load all supported areas from API + local
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
        console.error("fetchAreas error:", err);
        if (!ignore) setLoadingAreas(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Load meals for selected area
  useEffect(() => {
    let ignore = false;
    fetchMealsByArea(selectedArea)
      .then((res) => {
        if (!ignore) {
          setSelectedCategory("All");
          setDishSearch("");
          setMealsData({
            meals: res.data?.meals || [],
            area: selectedArea,
          });
        }
      })
      .catch((err) => {
        console.error("fetchMealsByArea error:", err);
        if (!ignore) {
          setMealsData({ meals: [], area: selectedArea });
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedArea]);

  const handleSelectArea = (areaName) => {
    setInternalArea(areaName);
    setSelectedCategory("All");
    setDishSearch("");
    navigate(`/cuisine/${encodeURIComponent(areaName)}`, { replace: true });
  };

  const filteredAreas = areas.filter((a) =>
    a.strArea.toLowerCase().includes(filterQuery.toLowerCase().trim())
  );

  const currentAreaObj = areas.find(
    (a) => a.strArea.toLowerCase() === (selectedArea || "").toLowerCase()
  );

  const meals = useMemo(() => mealsData.meals || [], [mealsData.meals]);
  const loadingMeals = mealsData.area !== selectedArea;

  // Get distinct categories for the selected cuisine / area
  const cuisineCategories = useMemo(() => {
    return getCategoriesForArea(selectedArea);
  }, [selectedArea]);

  // Compute dish counts per category for the selected area
  const categoryCounts = useMemo(() => {
    const counts = {};
    cuisineCategories.forEach((cat) => {
      const catName = cat.strCategory;
      const target = catName.toLowerCase().trim();
      const matching = meals.filter((m) => {
        const mCat = (m.strCategory || "").toLowerCase().trim();
        return mCat === target || mCat.includes(target) || target.includes(mCat);
      });
      counts[catName] = matching.length;
    });
    return counts;
  }, [meals, cuisineCategories]);

  // Filtered meals based on selected category and search input
  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      // Category filter
      if (selectedCategory !== "All") {
        const mealCat = (meal.strCategory || "").toLowerCase().trim();
        const targetCat = selectedCategory.toLowerCase().trim();
        if (mealCat !== targetCat && !mealCat.includes(targetCat) && !targetCat.includes(mealCat)) {
          return false;
        }
      }

      // Search keyword filter
      if (dishSearch.trim()) {
        const q = dishSearch.toLowerCase().trim();
        const nameMatch = (meal.strMeal || "").toLowerCase().includes(q);
        const catMatch = (meal.strCategory || "").toLowerCase().includes(q);
        return nameMatch || catMatch;
      }

      return true;
    });
  }, [meals, selectedCategory, dishSearch]);

  if (loadingAreas) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Breadcrumb & Heading Banner */}
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
              <Globe className="w-3.5 h-3.5" />
              <span>World & Regional Cuisines</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span>{currentAreaObj?.flag || "🌍"}</span>
              <span>{selectedArea} Cuisine</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-xl">
              {currentAreaObj?.description || `Explore authentic ${selectedArea} meals and step-by-step recipes.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full w-fit">
              {meals.length} {meals.length === 1 ? "recipe" : "recipes"} found
            </span>
          </div>
        </div>
      </div>

      {/* Cuisines / Areas Selector Bar */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Select Cuisine / Area
            </h2>
            <span className="text-xs text-slate-400">({areas.length} available)</span>
          </div>

          {/* Area search filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter cuisines..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Scrollable Area Chips */}
        <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
          {filteredAreas.map((area) => {
            const isSelected =
              area.strArea.toLowerCase() === (selectedArea || "").toLowerCase();
            return (
              <button
                key={area.strArea}
                type="button"
                onClick={() => handleSelectArea(area.strArea)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                }`}
              >
                <span>{area.flag || "🍲"}</span>
                <span>{area.strArea}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* DEDICATED CATEGORIES SECTION FOR SELECTED CUISINE */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Distinct Cuisine Categories</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {selectedArea} Recipe Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Browse separate specialized categories crafted specifically for {selectedArea} cuisine
            </p>
          </div>

          {/* Quick dish search within this cuisine */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={dishSearch}
              onChange={(e) => setDishSearch(e.target.value)}
              placeholder={`Search in ${selectedArea}...`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === "All"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            <span>All {selectedArea} Dishes</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                selectedCategory === "All" ? "bg-white/25 text-white" : "bg-slate-200 text-slate-700"
              }`}
            >
              {meals.length}
            </span>
          </button>

          {cuisineCategories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.strCategory.toLowerCase();
            const count = categoryCounts[cat.strCategory] || 0;
            return (
              <button
                key={cat.idCategory || cat.strCategory}
                type="button"
                onClick={() => setSelectedCategory(cat.strCategory)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <span>{cat.strCategory}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isSelected ? "bg-white/25 text-white" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Visual Category Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {cuisineCategories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.strCategory.toLowerCase();
            const count = categoryCounts[cat.strCategory] || 0;
            return (
              <div
                key={cat.idCategory || cat.strCategory}
                onClick={() => setSelectedCategory(cat.strCategory)}
                className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "bg-emerald-50/60 border-emerald-500 shadow-md ring-1 ring-emerald-400/40"
                    : "bg-white border-slate-100 hover:border-emerald-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60 shadow-2xs">
                    <img
                      src={cat.strCategoryThumb}
                      alt={cat.strCategory}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors leading-snug">
                      {cat.strCategory}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-normal">
                      {cat.strCategoryDescription || `Delicious authentic recipes in this category.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold">
                  <span className="text-slate-500">
                    {count} {count === 1 ? "recipe" : "recipes"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 ${
                      isSelected ? "text-emerald-700 font-extrabold" : "text-emerald-600 group-hover:translate-x-0.5 transition-transform"
                    }`}
                  >
                    <span>{isSelected ? "Active" : "View"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Meals Grid for Selected Area & Category */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 uppercase tracking-widest mb-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <Filter className="w-3.5 h-3.5" />
              <span>
                {selectedCategory === "All" ? `All ${selectedArea} Recipes` : selectedCategory}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {selectedCategory === "All"
                ? `${selectedArea} Recipes`
                : `${selectedCategory}`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredMeals.length} chef-tested {filteredMeals.length === 1 ? "dish" : "dishes"}
            </p>
          </div>

          {selectedCategory !== "All" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition"
              >
                Clear Category Filter
              </button>
              <Link
                to={`/category/${encodeURIComponent(selectedCategory)}`}
                className="text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl transition inline-flex items-center gap-1"
              >
                <span>Category Page</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {loadingMeals ? (
          <div className="py-20">
            <LoadingSpinner />
          </div>
        ) : filteredMeals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-md mx-auto p-8">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              No dishes found
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {dishSearch
                ? `No dishes matched "${dishSearch}" in ${selectedCategory === "All" ? selectedArea : selectedCategory}.`
                : `No dishes currently found in this category.`}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setDishSearch("");
              }}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition"
            >
              <span>Show All {selectedArea} Dishes</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredMeals.map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={{
                  ...meal,
                  strArea: meal.strArea || selectedArea,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CuisineExplorer;
