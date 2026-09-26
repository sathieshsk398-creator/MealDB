import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Compass, Sparkles, Globe, Search, ArrowRight, Layers } from "lucide-react";
import { fetchCategories } from "../api/mealdb";
import { CUISINE_AREAS_META } from "../data/worldCuisineCategories";
import LoadingSpinner from "../components/LoadingSpinner";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let ignore = false;
    fetchCategories()
      .then((res) => {
        if (!ignore) {
          setCategories(res.data?.categories || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Filtered categories based on selected cuisine tab & search query
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Cuisine filter
      if (selectedCuisine !== "All") {
        const catArea = (cat.strArea || "").toLowerCase().trim();
        const targetArea = selectedCuisine.toLowerCase().trim();
        if (catArea !== targetArea) {
          return false;
        }
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (cat.strCategory || "").toLowerCase().includes(q);
        const descMatch = (cat.strCategoryDescription || "").toLowerCase().includes(q);
        const areaMatch = (cat.strArea || "").toLowerCase().includes(q);
        return nameMatch || descMatch || areaMatch;
      }

      return true;
    });
  }, [categories, selectedCuisine, searchQuery]);

  // Group categories by Cuisine Area for structured view
  const categoriesByCuisine = useMemo(() => {
    const groups = {};
    filteredCategories.forEach((cat) => {
      const area = cat.strArea || "Other Cuisines";
      if (!groups[area]) {
        groups[area] = [];
      }
      groups[area].push(cat);
    });
    return groups;
  }, [filteredCategories]);

  // Cuisine meta dictionary for quick lookup of flags & descriptions
  const cuisineMetaMap = useMemo(() => {
    const map = {};
    CUISINE_AREAS_META.forEach((c) => {
      map[c.strArea.toLowerCase()] = c;
    });
    return map;
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
        <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recipe Directory by Cuisine & Heritage</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Compass className="w-8 h-8 text-emerald-600 stroke-[2.2]" />
          <span>Browse Recipe Categories</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-2xl">
          Every cuisine and regional culinary tradition features its own distinct categories—from Tamil Nadu Tiffin to Italian Pastas, Mexican Tacos, and Japanese Ramen.
        </p>
      </div>

      {/* Cuisine / Area Filter Pills & Search Bar */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Filter by Cuisine & Area
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category or cuisine..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Scrollable Cuisine Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCuisine("All")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCuisine === "All"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            <span>🌍 All Cuisines ({categories.length})</span>
          </button>

          {CUISINE_AREAS_META.map((item) => {
            const isSelected = selectedCuisine.toLowerCase() === item.strArea.toLowerCase();
            const count = categories.filter(
              (c) => (c.strArea || "").toLowerCase().trim() === item.strArea.toLowerCase()
            ).length;
            return (
              <button
                key={item.strArea}
                type="button"
                onClick={() => setSelectedCuisine(item.strArea)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.strArea}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isSelected ? "bg-white/25 text-white" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Categorized Display */}
      {selectedCuisine !== "All" ? (
        // Specific Cuisine View
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/70 border border-emerald-200/70 rounded-3xl p-6 sm:p-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Selected Cuisine Categories</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{cuisineMetaMap[selectedCuisine.toLowerCase()]?.flag || "🌍"}</span>
                <span>{selectedCuisine} Categories</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-medium">
                {cuisineMetaMap[selectedCuisine.toLowerCase()]?.description ||
                  `Distinct culinary categories for authentic ${selectedCuisine} dishes.`}
              </p>
            </div>

            <Link
              to={`/cuisine/${encodeURIComponent(selectedCuisine)}`}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition group whitespace-nowrap"
            >
              <span>Explore All {selectedCuisine} Dishes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((cat) => (
              <CategoryCard key={cat.idCategory || cat.strCategory} cat={cat} />
            ))}
          </div>
        </section>
      ) : (
        // Grouped by Cuisine Sections
        <div className="space-y-12">
          {Object.entries(categoriesByCuisine).map(([areaName, catList]) => {
            const meta = cuisineMetaMap[areaName.toLowerCase()];
            return (
              <section key={areaName} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{meta?.flag || "🍲"}</span>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {areaName} Categories
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        {catList.length} distinct {catList.length === 1 ? "category" : "categories"}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/cuisine/${encodeURIComponent(areaName)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 px-3.5 py-1.5 rounded-xl transition"
                  >
                    <span>View {areaName} Dishes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {catList.map((cat) => (
                    <CategoryCard key={cat.idCategory || cat.strCategory} cat={cat} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Sub-component for rendering a clean category card
const CategoryCard = ({ cat }) => {
  return (
    <Link
      to={`/category/${encodeURIComponent(cat.strCategory)}`}
      className="group bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-xl hover:border-emerald-300/80 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
    >
      <div>
        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 mb-4 shadow-inner relative">
          <img
            src={cat.strCategoryThumb}
            alt={cat.strCategory}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
            }}
          />
          {cat.strArea && (
            <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {cat.strArea}
            </span>
          )}
        </div>
        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
          {cat.strCategory}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
          {cat.strCategoryDescription || `Explore authentic ${cat.strCategory} recipes.`}
        </p>
      </div>

      <span className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white px-3.5 py-2 rounded-xl transition-colors w-full">
        <span>View Recipes</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
};

export default Categories;
