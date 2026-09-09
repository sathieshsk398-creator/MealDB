import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Utensils,
  IndianRupee,
  Tag,
  Leaf,
  Drumstick,
  Image as ImageIcon,
  FileText,
  ListPlus,
  Trash2,
  Plus,
  CheckCircle2,
  Sparkles,
  Eye,
  Store,
} from "lucide-react";
import AdminHeader from "../components/admin/AdminHeader";
import { AdminProvider } from "../contexts/AdminContext";
import {
  saveCustomDish,
  getCustomDishById,
} from "../utils/customDishes";
import { formatPrice } from "../utils/price";

// Curated high quality food photo presets for quick 1-click selection
const IMAGE_PRESETS = [
  {
    name: "Paneer Tikka",
    category: "Starter",
    dietType: "veg",
    url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Butter Chicken",
    category: "Chicken",
    dietType: "non-veg",
    url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dal Makhani",
    category: "Vegetarian",
    dietType: "veg",
    url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Biryani Special",
    category: "Main Course",
    dietType: "non-veg",
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Gulab Jamun",
    category: "Dessert",
    dietType: "veg",
    url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Crispy Samosa",
    category: "Starter",
    dietType: "veg",
    url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  },
];

const POPULAR_CATEGORIES = [
  "Starter",
  "Main Course",
  "Vegetarian",
  "Chicken",
  "Seafood",
  "Dessert",
  "Breakfast",
  "Beverages",
  "Side",
  "Pasta",
  "Lamb",
];

const AdminAddDishInner = () => {
  const [searchParams] = useSearchParams();
  const editDishId = searchParams.get("id");

  const [formData, setFormData] = useState(() => {
    if (editDishId) {
      const existing = getCustomDishById(editDishId);
      if (existing) {
        const existingIngredients =
          Array.isArray(existing.ingredients) && existing.ingredients.length > 0
            ? existing.ingredients
            : (() => {
                const list = [];
                for (let i = 1; i <= 20; i++) {
                  if (existing[`strIngredient${i}`]) {
                    list.push({
                      ingredient: existing[`strIngredient${i}`],
                      measure: existing[`strMeasure${i}`] || "",
                    });
                  }
                }
                return list.length > 0
                  ? list
                  : [{ ingredient: "", measure: "" }];
              })();

        const isStandardCat = POPULAR_CATEGORIES.includes(existing.strCategory);

        return {
          strMeal: existing.strMeal || "",
          price: existing.price || "",
          strCategory: isStandardCat ? existing.strCategory : "Custom",
          customCategory: isStandardCat ? "" : existing.strCategory,
          dietType: existing.dietType || (existing.isVeg ? "veg" : "non-veg"),
          strMealThumb: existing.strMealThumb || "",
          strInstructions: existing.strInstructions || "",
          ingredients: existingIngredients,
        };
      }
    }

    return {
      strMeal: "",
      price: "",
      strCategory: "Main Course",
      customCategory: "",
      dietType: "veg", // "veg" | "non-veg"
      strMealThumb: "",
      strInstructions: "",
      ingredients: [
        { ingredient: "", measure: "" },
        { ingredient: "", measure: "" },
      ],
    };
  });

  const [isEditing] = useState(() => {
    if (editDishId) {
      return Boolean(getCustomDishById(editDishId));
    }
    return false;
  });
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [savedDishId, setSavedDishId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.ingredients];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, ingredients: updated };
    });
  };

  const addIngredientRow = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredient: "", measure: "" }],
    }));
  };

  const removeIngredientRow = (index) => {
    setFormData((prev) => {
      const updated = prev.ingredients.filter((_, i) => i !== index);
      return {
        ...prev,
        ingredients:
          updated.length > 0 ? updated : [{ ingredient: "", measure: "" }],
      };
    });
  };

  const selectImagePreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      strMealThumb: preset.url,
      dietType: preset.dietType,
      strCategory: POPULAR_CATEGORIES.includes(preset.category)
        ? preset.category
        : prev.strCategory,
    }));
    if (errors.strMealThumb) {
      setErrors((prev) => ({ ...prev, strMealThumb: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.strMeal.trim()) {
      newErrors.strMeal = "Dish name is required";
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Enter a valid price in INR (e.g. 299)";
    }
    const finalCategory =
      formData.strCategory === "Custom"
        ? formData.customCategory.trim()
        : formData.strCategory;
    if (!finalCategory) {
      newErrors.strCategory = "Please select or specify a category";
    }
    if (!formData.strMealThumb.trim()) {
      newErrors.strMealThumb = "Image URL is required (or select a preset below)";
    }
    if (!formData.strInstructions.trim()) {
      newErrors.strInstructions = "Description / Cooking instructions are required";
    }

    const validIngredients = formData.ingredients.filter(
      (item) => item.ingredient.trim() !== ""
    );
    if (validIngredients.length === 0) {
      newErrors.ingredients = "Please add at least one ingredient";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const finalCategory =
      formData.strCategory === "Custom"
        ? formData.customCategory.trim()
        : formData.strCategory;

    const cleanedIngredients = formData.ingredients
      .filter((item) => item.ingredient.trim() !== "")
      .map((item) => ({
        ingredient: item.ingredient.trim(),
        measure: item.measure.trim(),
      }));

    const newDishId = editDishId || `custom_${Date.now()}`;

    const dishPayload = {
      idMeal: newDishId,
      strMeal: formData.strMeal.trim(),
      price: Math.round(Number(formData.price)),
      strCategory: finalCategory,
      dietType: formData.dietType,
      isVeg: formData.dietType === "veg",
      strMealThumb: formData.strMealThumb.trim(),
      strInstructions: formData.strInstructions.trim(),
      ingredients: cleanedIngredients,
      strArea: "Chef Specialty",
    };

    try {
      const saved = saveCustomDish(dishPayload);
      setSavedDishId(saved.idMeal);
      setToastMessage(
        isEditing
          ? `Successfully updated "${saved.strMeal}" in menu catalog!`
          : `Added "${saved.strMeal}" to storefront menu catalog!`
      );

      if (!isEditing) {
        // Reset form for adding another dish
        setFormData({
          strMeal: "",
          price: "",
          strCategory: "Main Course",
          customCategory: "",
          dietType: "veg",
          strMealThumb: "",
          strInstructions: "",
          ingredients: [
            { ingredient: "", measure: "" },
            { ingredient: "", measure: "" },
          ],
        });
      }
    } catch (err) {
      console.error("Failed to save dish:", err);
      setErrors({ form: "Failed to save dish to LocalStorage. Please retry." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const effectiveCategory =
    formData.strCategory === "Custom"
      ? formData.customCategory || "Custom Category"
      : formData.strCategory;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Admin Header */}
      <AdminHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Navigation & Title Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Menu Management
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preview Storefront</span>
            </Link>
          </div>
        </div>

        {/* Success Toast Notification Banner */}
        {toastMessage && (
          <div className="bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/50 rounded-2xl p-4.5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-emerald-950/40 animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-200">{toastMessage}</p>
                <p className="text-xs text-emerald-400/80 mt-0.5">
                  Stored in localStorage key <span className="font-mono bg-emerald-900/50 px-1 py-0.5 rounded text-emerald-300">admin_custom_dishes</span>. Instantly visible in customer searches and categories.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              {savedDishId && (
                <Link
                  to={`/meal/${savedDishId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Customer Page</span>
                </Link>
              )}
              <Link
                to="/admin"
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
              >
                Go to Menu List
              </Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Dish Creation Form (7 Columns) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {isEditing ? "Edit Menu Dish" : "Add New Dish to Menu"}
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enter details below. Dishes are instantly synchronized with MealDB API queries.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Dish Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Dish Name (strMeal) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  name="strMeal"
                  value={formData.strMeal}
                  onChange={handleInputChange}
                  placeholder="e.g. Paneer Lababdar, Mughlai Biryani"
                  className={`w-full bg-slate-950 border ${
                    errors.strMeal ? "border-rose-500" : "border-slate-800"
                  } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 transition outline-none`}
                />
                {errors.strMeal && (
                  <p className="text-xs text-rose-400 font-medium">{errors.strMeal}</p>
                )}
              </div>

              {/* Price & Category in 2-Column Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price in INR */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Price in INR (₹) <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <IndianRupee className="w-4 h-4 text-emerald-400" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      min="1"
                      step="1"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g. 299"
                      className={`w-full bg-slate-950 border ${
                        errors.price ? "border-rose-500" : "border-slate-800"
                      } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 transition outline-none`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-rose-400 font-medium">{errors.price}</p>
                  )}
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Category (strCategory) <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Tag className="w-4 h-4 text-emerald-400" />
                    </div>
                    <select
                      name="strCategory"
                      value={formData.strCategory}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white transition outline-none appearance-none cursor-pointer"
                    >
                      {POPULAR_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="Custom">+ Custom Category...</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Custom Category Input if "Custom" is picked */}
              {formData.strCategory === "Custom" && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
                    Custom Category Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="customCategory"
                    value={formData.customCategory}
                    onChange={handleInputChange}
                    placeholder="e.g. Chef Tasting, Street Food, Thali"
                    className="w-full bg-slate-950 border border-amber-500/40 focus:border-emerald-500 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-600 outline-none"
                  />
                  {errors.strCategory && (
                    <p className="text-xs text-rose-400 font-medium">{errors.strCategory}</p>
                  )}
                </div>
              )}

              {/* Diet Type (Veg / Non-Veg Toggle) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Diet Type (Veg / Non-Veg) <span className="text-emerald-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, dietType: "veg" }))}
                    className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formData.dietType === "veg"
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm ring-1 ring-emerald-500"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="w-4 h-4 rounded border border-emerald-500 bg-emerald-950 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span>Pure Vegetarian (Veg)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, dietType: "non-veg" }))}
                    className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formData.dietType === "non-veg"
                        ? "bg-rose-950/80 border-rose-500 text-rose-300 shadow-sm ring-1 ring-rose-500"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="w-4 h-4 rounded border border-rose-500 bg-rose-950 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                    </div>
                    <Drumstick className="w-4 h-4 text-rose-400" />
                    <span>Non-Vegetarian (Non-Veg)</span>
                  </button>
                </div>
              </div>

              {/* Image URL (strMealThumb) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Image URL (strMealThumb) <span className="text-emerald-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">HTTPS image link</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type="url"
                    name="strMealThumb"
                    value={formData.strMealThumb}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                    className={`w-full bg-slate-950 border ${
                      errors.strMealThumb ? "border-rose-500" : "border-slate-800"
                    } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 transition outline-none`}
                  />
                </div>
                {errors.strMealThumb && (
                  <p className="text-xs text-rose-400 font-medium">{errors.strMealThumb}</p>
                )}

                {/* Quick Presets Picker */}
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-2">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Or pick from 1-click sample dish photos:</span>
                  </p>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {IMAGE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectImagePreset(p)}
                        className="shrink-0 group relative rounded-lg overflow-hidden border border-slate-700 hover:border-emerald-400 transition cursor-pointer w-20 h-14 bg-slate-950"
                        title={`${p.name} (${p.category})`}
                      >
                        <img
                          src={p.url}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-black/75 backdrop-blur-xs text-[9px] font-bold text-white text-center py-0.5 truncate px-1">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description / Instructions (strInstructions) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Description / Cooking Instructions (strInstructions) <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    name="strInstructions"
                    value={formData.strInstructions}
                    onChange={handleInputChange}
                    placeholder="Step-by-step preparation notes, flavor notes, or cooking instructions..."
                    className={`w-full bg-slate-950 border ${
                      errors.strInstructions ? "border-rose-500" : "border-slate-800"
                    } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3.5 text-sm text-white placeholder-slate-600 transition outline-none leading-relaxed`}
                  />
                </div>
                {errors.strInstructions && (
                  <p className="text-xs text-rose-400 font-medium">{errors.strInstructions}</p>
                )}
              </div>

              {/* Dynamic Ingredients Section */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Ingredients & Measures
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Maps dynamically to strIngredient1..20 and strMeasure1..20
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addIngredientRow}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/60 px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Ingredient</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {formData.ingredients.map((row, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 bg-slate-950 p-2 rounded-xl border border-slate-800/80"
                    >
                      <span className="w-5 text-[10px] font-mono text-slate-500 text-center font-bold">
                        #{index + 1}
                      </span>
                      <input
                        type="text"
                        placeholder="Ingredient (e.g. Paneer, Basmati Rice)"
                        value={row.ingredient}
                        onChange={(e) =>
                          handleIngredientChange(index, "ingredient", e.target.value)
                        }
                        className="flex-1 bg-transparent border-b border-slate-800 focus:border-emerald-500 text-xs text-white placeholder-slate-600 py-1.5 px-2 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Measure (e.g. 250g, 2 tbsp)"
                        value={row.measure}
                        onChange={(e) =>
                          handleIngredientChange(index, "measure", e.target.value)
                        }
                        className="w-32 bg-transparent border-b border-slate-800 focus:border-emerald-500 text-xs text-white placeholder-slate-600 py-1.5 px-2 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredientRow(index)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                        title="Remove ingredient"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.ingredients && (
                  <p className="text-xs text-rose-400 font-medium">{errors.ingredients}</p>
                )}
              </div>

              {/* Form Global Error */}
              {errors.form && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold">
                  {errors.form}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <Link
                  to="/admin"
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black transition shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <ListPlus className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? "Saving..."
                      : isEditing
                      ? "Update Menu Dish"
                      : "Save & Publish to Storefront"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: Live Customer Preview & Quick Stats (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Storefront Card Preview */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Live Storefront Card Preview</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800/40">
                  Real-time
                </span>
              </div>

              {/* Customer-facing card mockup */}
              <div className="bg-white text-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {formData.strMealThumb ? (
                    <img
                      src={formData.strMealThumb}
                      alt={formData.strMeal || "Dish preview"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                      <ImageIcon className="w-10 h-10 stroke-[1.5] mb-1" />
                      <span className="text-xs">Image Preview</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <span>20-25 mins</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                          <span>★ 4.8</span>
                        </span>
                        <span
                          className={`inline-flex items-center justify-center w-4 h-4 rounded border ${
                            formData.dietType === "veg"
                              ? "border-emerald-600 bg-emerald-50"
                              : "border-rose-600 bg-rose-50"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              formData.dietType === "veg" ? "bg-emerald-600" : "bg-rose-600"
                            }`}
                          />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          Chef Special
                        </span>
                      </div>

                      <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                        {effectiveCategory}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base leading-snug truncate">
                      {formData.strMeal || "Your Dish Name"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {formData.strInstructions ||
                        "Freshly handcrafted with authentic spices and chef special recipe."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                        Price
                      </span>
                      <span className="text-lg font-extrabold text-gray-900 tracking-tight">
                        {formData.price ? formatPrice(Number(formData.price)) : "₹299"}
                      </span>
                    </div>

                    <span className="bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-sm">
                      Add +
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Details Box */}
            <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-5 space-y-3 text-xs text-slate-400">
              <h3 className="font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Integration Specifications</span>
              </h3>
              <ul className="space-y-2 list-disc list-inside text-slate-400 leading-relaxed">
                <li>
                  <strong className="text-slate-200">Storage Key:</strong> Stored under{" "}
                  <code className="bg-slate-950 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-[11px]">
                    admin_custom_dishes
                  </code>{" "}
                  in the browser's localStorage.
                </li>
                <li>
                  <strong className="text-slate-200">Data Normalization:</strong> Custom ingredients are mapped to{" "}
                  <code className="bg-slate-950 text-emerald-400 px-1 py-0.5 rounded font-mono text-[11px]">
                    strIngredient1..20
                  </code>{" "}
                  and{" "}
                  <code className="bg-slate-950 text-emerald-400 px-1 py-0.5 rounded font-mono text-[11px]">
                    strMeasure1..20
                  </code>{" "}
                  to preserve exact MealDB schema compatibility.
                </li>
                <li>
                  <strong className="text-slate-200">Storefront Merging:</strong> Custom dishes are prepended to{" "}
                  <code className="bg-slate-950 text-emerald-400 px-1 py-0.5 rounded font-mono text-[11px]">
                    Home.jsx
                  </code>
                  ,{" "}
                  <code className="bg-slate-950 text-emerald-400 px-1 py-0.5 rounded font-mono text-[11px]">
                    CategoryMeals.jsx
                  </code>
                  , and search results.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const AdminAddDish = () => {
  return (
    <AdminProvider>
      <AdminAddDishInner />
    </AdminProvider>
  );
};

export default AdminAddDish;
