import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Flame, ChevronRight, Sparkles, Compass, Globe, Layers, ArrowRight } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import MealCard from "../components/MealCard";
import HeroSection from "../components/HeroSection";
import { fetchCategories, fetchMealsByCategory, fetchMealsByArea } from "../api/mealdb";
import { getCategoriesForArea } from "../data/worldCuisineCategories";

const FEATURED_CUISINES = [
  { strArea: "Tamil Nadu", flag: "🇮🇳" },
  { strArea: "North Indian", flag: "🇮🇳" },
  { strArea: "Italian", flag: "🇮🇹" },
  { strArea: "Mexican", flag: "🇲🇽" },
  { strArea: "Chinese", flag: "🇨🇳" },
  { strArea: "Japanese", flag: "🇯🇵" },
  { strArea: "American", flag: "🇺🇸" },
  { strArea: "French", flag: "🇫🇷" },
  { strArea: "Thai", flag: "🇹🇭" },
  { strArea: "British", flag: "🇬🇧" },
  { strArea: "Greek", flag: "🇬🇷" },
  { strArea: "Spanish", flag: "🇪🇸" },
  { strArea: "Turkish", flag: "🇹🇷" },
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [popularData, setPopularData] = useState({ meals: [], category: null });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tamil Nadu Tiffin");
  const [categoryCuisineFilter, setCategoryCuisineFilter] = useState("All");

  // Cuisine spotlight state
  const [selectedCuisine, setSelectedCuisine] = useState("Tamil Nadu");
  const [cuisineSpotlightCategory, setCuisineSpotlightCategory] = useState("All");
  const [cuisineData, setCuisineData] = useState({ meals: [], cuisine: null });

  useEffect(() => {
    let ignore = false;
    const loadCategories = () => {
      fetchCategories()
        .then((res) => {
          if (!ignore) {
            const fetched = res.data.categories || [];
            setCategories(fetched);
            setSelectedCategory((prev) => (!prev && fetched.length > 0 ? fetched[0].strCategory : prev));
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
            const dishes = res.data.meals || [];
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

  // Load cuisine meals for the spotlight section
  useEffect(() => {
    let ignore = false;
    fetchMealsByArea(selectedCuisine)
      .then((res) => {
        if (!ignore) {
          setCuisineSpotlightCategory("All");
          setCuisineData({
            meals: res.data?.meals || [],
            cuisine: selectedCuisine,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) {
          setCuisineData({ meals: [], cuisine: selectedCuisine });
        }
      });
    return () => {
      ignore = true;
    };
  }, [selectedCuisine]);

  // Filtered categories for the category carousel based on cuisine tab
  const displayedCategories = useMemo(() => {
    if (categoryCuisineFilter === "All") {
      return categories;
    }
    return categories.filter(
      (c) => (c.strArea || "").toLowerCase().trim() === categoryCuisineFilter.toLowerCase().trim()
    );
  }, [categories, categoryCuisineFilter]);

  // Distinct categories for the selected spotlight cuisine
  const spotlightCuisineCategories = useMemo(() => {
    return getCategoriesForArea(selectedCuisine);
  }, [selectedCuisine]);

  const rawCuisineMeals = useMemo(() => cuisineData.meals || [], [cuisineData.meals]);
  const loadingCuisine = cuisineData.cuisine !== selectedCuisine;

  // Filter spotlight cuisine meals by the selected category tab
  const filteredCuisineMeals = useMemo(() => {
    if (cuisineSpotlightCategory === "All") {
      return rawCuisineMeals.slice(0, 8);
    }
    const target = cuisineSpotlightCategory.toLowerCase().trim();
    return rawCuisineMeals.filter((m) => {
      const c = (m.strCategory || "").toLowerCase().trim();
      return c === target || c.includes(target) || target.includes(c);
    });
  }, [rawCuisineMeals, cuisineSpotlightCategory]);

  const popularMeals = popularData.meals || [];
  const popularLoading = popularData.category !== selectedCategory;

  const handleCuisineFilterChange = (cuisineName) => {
    setCategoryCuisineFilter(cuisineName);
    const subset =
      cuisineName === "All"
        ? categories
        : categories.filter(
            (c) => (c.strArea || "").toLowerCase().trim() === cuisineName.toLowerCase().trim()
          );
    if (subset.length > 0) {
      setSelectedCategory(subset[0].strCategory);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12 sm:space-y-16">
      {/* High-Impact Modern Recipe Explorer Hero Section */}
      <HeroSection />

      {/* "What's on your mind?" Category Carousel */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Categories</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>What would you like to cook?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select any cuisine to view its separate distinct categories
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 px-3.5 py-1.5 rounded-xl transition w-fit"
          >
            <span>All Categories by Cuisine</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Cuisine Filter Pills for Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCuisineFilterChange("All")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              categoryCuisineFilter === "All"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <span>🌍 All Cuisines</span>
          </button>
          {FEATURED_CUISINES.slice(0, 8).map((c) => {
            const isSelected = categoryCuisineFilter.toLowerCase() === c.strArea.toLowerCase();
            return (
              <button
                key={c.strArea}
                type="button"
                onClick={() => handleCuisineFilterChange(c.strArea)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.strArea}</span>
              </button>
            );
          })}
        </div>

        {/* Categories Carousel */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          {displayedCategories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.strCategory.toLowerCase();
            return (
              <button
                key={cat.idCategory || cat.strCategory}
                onClick={() => setSelectedCategory(cat.strCategory)}
                className={`group flex flex-col items-center gap-2.5 shrink-0 cursor-pointer p-2.5 sm:p-3 rounded-2xl transition-all duration-200 ${
                  isSelected
                    ? "bg-emerald-500/10 border-2 border-emerald-500 shadow-md shadow-emerald-500/10 scale-102"
                    : "hover:bg-slate-50 border-2 border-transparent"
                }`}
              >
                <div
                  className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 shadow-sm transition-transform duration-300 border-2 relative ${
                    isSelected ? "border-emerald-500 ring-2 ring-emerald-200" : "border-white group-hover:scale-105"
                  }`}
                >
                  <img
                    src={cat.strCategoryThumb}
                    alt={cat.strCategory}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span
                  className={`text-xs font-bold text-center tracking-tight truncate max-w-[105px] ${
                    isSelected ? "text-emerald-700 font-extrabold" : "text-slate-700"
                  }`}
                >
                  {cat.strCategory}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Category Specialties Grid */}
      <section>
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 uppercase tracking-widest mb-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <Flame className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>Curated Category Recipes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {selectedCategory} Recipes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Hand-crafted dishes with full ingredient lists and step-by-step methods
            </p>
          </div>
          <Link
            to={`/category/${encodeURIComponent(selectedCategory)}`}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-emerald-600 hover:text-emerald-700 transition group bg-emerald-50 hover:bg-emerald-100/70 px-3.5 py-2 rounded-xl"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {popularLoading ? (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        ) : popularMeals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-500 font-medium">No recipes found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {popularMeals.map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={{ ...meal, strCategory: selectedCategory }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Explore by Cuisine & Area Showcase */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest mb-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Cuisines of the World</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore by Cuisine & Area
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Every cuisine has its own distinct categories—select a cuisine to browse its specialties
            </p>
          </div>

          <Link
            to={`/cuisine/${encodeURIComponent(selectedCuisine)}`}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 px-4 py-2 rounded-xl transition"
          >
            <span>Open {selectedCuisine} Explorer</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Cuisine Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FEATURED_CUISINES.map((item) => {
            const isSelected = selectedCuisine.toLowerCase() === item.strArea.toLowerCase();
            return (
              <button
                key={item.strArea}
                type="button"
                onClick={() => setSelectedCuisine(item.strArea)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.strArea}</span>
              </button>
            );
          })}
        </div>

        {/* Cuisine Specific Category Sub-Tabs */}
        <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>{selectedCuisine} Categories:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setCuisineSpotlightCategory("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                cuisineSpotlightCategory === "All"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All {selectedCuisine} Dishes ({rawCuisineMeals.length})
            </button>
            {spotlightCuisineCategories.map((cat) => {
              const isSelected =
                cuisineSpotlightCategory.toLowerCase() === cat.strCategory.toLowerCase();
              return (
                <button
                  key={cat.idCategory || cat.strCategory}
                  type="button"
                  onClick={() => setCuisineSpotlightCategory(cat.strCategory)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat.strCategory}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cuisine Meals Grid */}
        {loadingCuisine ? (
          <div className="py-12">
            <LoadingSpinner />
          </div>
        ) : filteredCuisineMeals.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm bg-slate-50 rounded-2xl">
            No recipes found in this category for {selectedCuisine}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredCuisineMeals.map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={{
                  ...meal,
                  strArea: meal.strArea || selectedCuisine,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Explore All Food Categories Grid */}
      <section className="bg-gradient-to-b from-white to-slate-50/50 rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore All Food Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Browse separate distinct categories across all world & regional cuisines
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-4 py-2 rounded-xl transition w-fit"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.slice(0, 15).map((cat) => (
            <Link
              to={`/category/${encodeURIComponent(cat.strCategory)}`}
              key={cat.idCategory || cat.strCategory}
              className="group bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-2xs hover:shadow-xl hover:border-emerald-300/80 transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1"
            >
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 mb-3 shadow-inner relative">
                <img
                  src={cat.strCategoryThumb}
                  alt={cat.strCategory}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                {cat.strArea && (
                  <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                    {cat.strArea}
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                {cat.strCategory}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {cat.strCategoryDescription?.slice(0, 45)}...
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
