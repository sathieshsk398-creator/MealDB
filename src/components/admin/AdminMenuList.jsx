import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  getCustomDishes,
  deleteCustomDish,
  DEFAULT_CUSTOM_DISHES,
  CUSTOM_DISHES_KEY,
} from "../../utils/customDishes";
import { useCurrency } from "../../contexts/CurrencyContext";

const AdminMenuList = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [dishes, setDishes] = useState(() => getCustomDishes());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiet, setFilterDiet] = useState("all"); // "all" | "veg" | "non-veg"
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadDishes = useCallback(() => {
    const list = getCustomDishes();
    setDishes(list);
  }, []);

  useEffect(() => {
    const handleUpdated = (e) => {
      if (e.detail) {
        setDishes(e.detail);
      } else {
        loadDishes();
      }
    };

    window.addEventListener("admin_custom_dishes_updated", handleUpdated);
    return () => window.removeEventListener("admin_custom_dishes_updated", handleUpdated);
  }, [loadDishes]);

  const handleDelete = (idMeal) => {
    const dishToDelete = dishes.find((d) => String(d.idMeal) === String(idMeal));
    deleteCustomDish(idMeal);
    setDeleteConfirmId(null);
    loadDishes();
    setNotification(`Deleted "${dishToDelete?.strMeal || "Dish"}" from custom menu.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRestoreDefaults = () => {
    localStorage.setItem(CUSTOM_DISHES_KEY, JSON.stringify(DEFAULT_CUSTOM_DISHES));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("admin_custom_dishes_updated", { detail: DEFAULT_CUSTOM_DISHES })
      );
    }
    loadDishes();
    setNotification("Restored default custom dishes catalog!");
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch =
      (dish.strMeal || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dish.strCategory || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDiet =
      filterDiet === "all" ||
      (filterDiet === "veg" && (dish.dietType === "veg" || dish.isVeg)) ||
      (filterDiet === "non-veg" && (dish.dietType === "non-veg" || !dish.isVeg));

    return matchesSearch && matchesDiet;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header with Title and 'Add New Dish' Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                Menu Management (Custom Dishes)
              </h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                {dishes.length} {dishes.length === 1 ? "Item" : "Items"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Dishes added by shop owner, merged seamlessly with MealDB storefront catalog
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            title="Reset sample dishes in localStorage"
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Seed Dishes</span>
          </button>

          <Link
            to="/admin/add-dish"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Dish</span>
          </Link>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {notification}
          </span>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search custom dishes by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        {/* Diet Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setFilterDiet("all")}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              filterDiet === "all"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({dishes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterDiet("veg")}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterDiet === "veg"
                ? "bg-emerald-950 text-emerald-300 border border-emerald-600/40 shadow-xs"
                : "text-slate-400 hover:text-emerald-300"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Pure Veg</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterDiet("non-veg")}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterDiet === "non-veg"
                ? "bg-rose-950 text-rose-300 border border-rose-600/40 shadow-xs"
                : "text-slate-400 hover:text-rose-300"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Non-Veg</span>
          </button>
        </div>
      </div>

      {/* Dishes Table */}
      {filteredDishes.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/50 space-y-3">
          <Utensils className="w-10 h-10 text-slate-600 mx-auto stroke-[1.5]" />
          <h3 className="text-base font-bold text-white">
            {searchTerm || filterDiet !== "all"
              ? "No dishes match your filter"
              : "No custom dishes added yet"}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm || filterDiet !== "all"
              ? "Try adjusting your search keywords or dietary filters."
              : "Create signature dishes with custom prices and ingredients to appear on the storefront."}
          </p>
          <div className="pt-2">
            <Link
              to="/admin/add-dish"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Dish</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Diet Type</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">Ingredients</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredDishes.map((dish) => {
                const isVeg = dish.dietType === "veg" || dish.isVeg;
                const ingredientCount = Array.isArray(dish.ingredients)
                  ? dish.ingredients.length
                  : (() => {
                      let c = 0;
                      for (let i = 1; i <= 20; i++) {
                        if (dish[`strIngredient${i}`]) c++;
                      }
                      return c;
                    })();

                return (
                  <tr
                    key={dish.idMeal}
                    className="hover:bg-slate-800/40 transition duration-150"
                  >
                    {/* Dish with Image and Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                          <img
                            src={dish.strMealThumb}
                            alt={dish.strMeal}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-white text-sm truncate">
                            {dish.strMeal}
                          </p>
                          <p className="text-[10px] font-mono text-slate-500 truncate">
                            ID: {dish.idMeal}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-block bg-slate-800 text-slate-300 font-semibold px-2.5 py-1 rounded-lg text-xs">
                        {dish.strCategory}
                      </span>
                    </td>

                    {/* Diet Type */}
                    <td className="py-3 px-4">
                      {isVeg ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>Pure Veg</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/80 border border-rose-800/50 px-2.5 py-1 rounded-lg">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          <span>Non-Veg</span>
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <span className="text-sm font-black text-white tracking-tight">
                        {formatPrice(dish.price || 299)}
                      </span>
                    </td>

                    {/* Ingredients Count */}
                    <td className="py-3 px-4">
                      <span className="text-slate-400 font-medium">
                        {ingredientCount} items
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* View in Storefront */}
                        <Link
                          to={`/meal/${dish.idMeal}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview on Storefront"
                          className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/add-dish?id=${dish.idMeal}`)}
                          title="Edit Dish"
                          className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 hover:bg-emerald-950/60 hover:border-emerald-600 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete with Confirmation */}
                        {deleteConfirmId === dish.idMeal ? (
                          <div className="inline-flex items-center gap-1 bg-rose-950 border border-rose-600/60 p-1 rounded-lg animate-in fade-in">
                            <span className="text-[10px] text-rose-300 font-bold px-1">
                              Delete?
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDelete(dish.idMeal)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-500 cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-0.5 text-slate-400 hover:text-white text-[10px] cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(dish.idMeal)}
                            title="Delete Dish"
                            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-rose-400 hover:bg-rose-950/60 hover:border-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Architecture note */}
      <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>
            Menu items are saved to <code className="text-emerald-400 font-mono">admin_custom_dishes</code> and merged dynamically on all storefront pages.
          </span>
        </div>
        <Link
          to="/admin/add-dish"
          className="text-emerald-400 hover:text-emerald-300 font-bold hidden sm:inline"
        >
          + Add another item →
        </Link>
      </div>
    </div>
  );
};

export default AdminMenuList;
