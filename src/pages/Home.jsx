import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flame, ChevronRight, Sparkles, Compass } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import MealCard from "../components/MealCard";
import HeroSection from "../components/HeroSection";
import { fetchCategories, fetchMealsByCategory } from "../api/mealdb";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [popularData, setPopularData] = useState({ meals: [], category: null });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tamil Nadu Tiffin");

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

  const popularMeals = popularData.meals || [];
  const popularLoading = popularData.category !== selectedCategory;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12 sm:space-y-16">
      {/* High-Impact Modern Food Delivery Hero Section */}
      <HeroSection />

      {/* "What's on your mind?" Circular Cuisine Category Carousel */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Cuisines</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>What's on your mind?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select a specialty to browse fresh dishes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.strCategory.toLowerCase();
            return (
              <button
                key={cat.idCategory}
                onClick={() => setSelectedCategory(cat.strCategory)}
                className={`group flex flex-col items-center gap-2.5 shrink-0 cursor-pointer p-2.5 sm:p-3 rounded-2xl transition-all duration-200 ${
                  isSelected
                    ? "bg-emerald-500/10 border-2 border-emerald-500 shadow-md shadow-emerald-500/10 scale-102"
                    : "hover:bg-slate-50 border-2 border-transparent"
                }`}
              >
                <div
                  className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 shadow-sm transition-transform duration-300 border-2 ${
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
                  className={`text-xs font-bold text-center tracking-tight truncate max-w-[95px] ${
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

      {/* Popular Dishes with Mock Prices and 'Add to Cart' */}
      <section>
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-600 uppercase tracking-widest mb-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Trending & Popular</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {selectedCategory} Specialties
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top-rated meals prepared with authentic ingredients
            </p>
          </div>
          <Link
            to={`/category/${selectedCategory}`}
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
            <p className="text-slate-500 font-medium">No dishes found in this category.</p>
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

      {/* Explore All Food Categories Grid */}
      <section className="bg-gradient-to-b from-white to-slate-50/50 rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Explore All Food Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse through regional culinary heritage, traditional gravies, and delicious desserts
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              to={`/category/${cat.strCategory}`}
              key={cat.idCategory}
              className="group bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-2xs hover:shadow-xl hover:border-emerald-300/80 transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1"
            >
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 mb-3 shadow-inner">
                <img
                  src={cat.strCategoryThumb}
                  alt={cat.strCategory}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
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
