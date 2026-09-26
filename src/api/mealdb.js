import axios from "axios";
import {
  getCustomDishes,
  getCustomDishesByCategory,
  getCustomDishById,
  searchCustomDishes,
} from "../utils/customDishes";
import {
  INDIAN_MEALS,
  getFullMealData,
} from "../data/indianDishesData";
import {
  WORLD_CUISINE_CATEGORIES,
  CUISINE_AREAS_META,
  getCategoriesForArea,
  classifyMealCategory,
} from "../data/worldCuisineCategories";
import { WORLD_DISHES } from "../data/worldDishesData";

const THEMEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";

// Helper to normalize any meal (from TheMealDB API or local) into a consistent schema
export const normalizeMeal = (meal) => {
  if (!meal) return null;

  // Extract ingredients list with measurements
  const ingredients = [];
  if (Array.isArray(meal.ingredients) && meal.ingredients.length > 0) {
    meal.ingredients.forEach((item) => {
      if (typeof item === "string") {
        ingredients.push({ ingredient: item, measure: "" });
      } else if (item?.ingredient) {
        ingredients.push({
          ingredient: item.ingredient,
          measure: item.measure || "",
        });
      }
    });
  } else {
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        ingredients.push({
          ingredient: ing.trim(),
          measure: measure ? measure.trim() : "",
        });
      }
    }
  }

  // Ensure YouTube link is present or generate an authentic YouTube recipe tutorial link
  let youtubeUrl = meal.strYoutube || "";
  if (!youtubeUrl && meal.strMeal) {
    youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      meal.strMeal + " authentic recipe cooking tutorial"
    )}`;
  }

  return {
    ...meal,
    idMeal: String(meal.idMeal),
    strMeal: meal.strMeal || "Delicious Dish",
    strMealThumb:
      meal.strMealThumb ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    strCategory: meal.strCategory || "Main Course",
    strArea: meal.strArea || "Culinary Special",
    strInstructions:
      meal.strInstructions ||
      "Prepare ingredients according to traditional recipe instructions. Cook slowly to infuse aromatic spices and serve hot.",
    strYoutube: youtubeUrl,
    ingredients,
    isVeg: meal.dietType === "veg" || meal.isVeg === true,
  };
};

export const fetchCategories = async () => {
  try {
    const customDishes = getCustomDishes();
    const existingCatNames = new Set(
      WORLD_CUISINE_CATEGORIES.map((c) => c.strCategory.toLowerCase())
    );

    const extraCategories = [];
    customDishes.forEach((dish) => {
      const catName = dish.strCategory?.trim();
      if (catName && !existingCatNames.has(catName.toLowerCase())) {
        existingCatNames.add(catName.toLowerCase());
        extraCategories.push({
          idCategory: `custom_cat_${catName.toLowerCase().replace(/\s+/g, "_")}`,
          strCategory: catName,
          strArea: dish.strArea || "Custom Cuisine",
          strCategoryThumb:
            dish.strMealThumb ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
          strCategoryDescription: `Freshly prepared chef-crafted ${catName} dishes.`,
        });
      }
    });

    return {
      data: {
        categories: [...WORLD_CUISINE_CATEGORIES, ...extraCategories],
      },
    };
  } catch (error) {
    console.error("fetchCategories error:", error);
    return { data: { categories: WORLD_CUISINE_CATEGORIES } };
  }
};

export const fetchCategoriesByArea = async (area) => {
  if (!area) return { data: { categories: [] } };
  try {
    const list = getCategoriesForArea(area);
    return { data: { categories: list } };
  } catch (err) {
    console.error("fetchCategoriesByArea error:", err);
    return { data: { categories: [] } };
  }
};

export const fetchMealsByCategory = async (cat) => {
  if (!cat) {
    return {
      data: {
        meals: INDIAN_MEALS.slice(0, 13).map((m) => normalizeMeal(getFullMealData(m))),
      },
    };
  }

  const normalized = cat.toLowerCase().trim();

  // 1. Find admin custom dishes matching this category
  const customMatching = getCustomDishesByCategory(cat).map(normalizeMeal);
  const customIds = new Set(customMatching.map((m) => String(m.idMeal)));

  // 2. Filter world cuisine dishes matching this category
  const worldMatches = WORLD_DISHES.filter((m) => {
    const mCat = (m.strCategory || "").toLowerCase().trim();
    if (mCat === normalized) return true;
    return mCat.includes(normalized) || normalized.includes(mCat);
  }).map(normalizeMeal);

  // 3. Filter curated Indian dishes
  let filteredIndian = INDIAN_MEALS.filter((m) => {
    const mealCat = (m.strCategory || "").toLowerCase().trim();
    const mealName = (m.strMeal || "").toLowerCase().trim();
    if (mealCat === normalized) return true;

    // Granular North Indian Category Mappings
    if (normalized.includes("north indian curries") || normalized === "north indian curries & gravies") {
      return mealCat === "north indian delights" && !mealName.includes("samosa") && !mealName.includes("tikka");
    }
    if (normalized.includes("tandoori") || normalized.includes("starters")) {
      return mealCat === "starters & snacks" || mealName.includes("tikka") || mealName.includes("tandoori") || mealName.includes("samosa") || mealName.includes("chaap");
    }
    if (normalized.includes("naan") || normalized.includes("breads") || normalized.includes("roti") || normalized.includes("paratha")) {
      return mealCat === "parottas & breads" || mealName.includes("naan") || mealName.includes("paratha") || mealName.includes("roti");
    }
    if (normalized.includes("mithai") || normalized.includes("sweets") || normalized.includes("desserts")) {
      return mealCat === "desserts & sweets";
    }

    // Tamil Nadu Category Mappings
    if (normalized === "tiffin" || normalized === "breakfast" || normalized === "tamil nadu tiffin") {
      return mealCat === "tamil nadu tiffin";
    }
    if (normalized === "biryani" || normalized === "rice" || normalized === "biryani & rice") {
      return mealCat === "biryani & rice";
    }
    if (normalized === "curry" || normalized === "curries" || normalized === "kulambu" || normalized === "tamil curries & gravies") {
      return mealCat === "tamil curries & gravies";
    }
    if (normalized === "north indian delights" || normalized === "north indian" || normalized === "mughlai") {
      return mealCat === "north indian delights";
    }
    if (normalized === "beverages & soups" || normalized === "beverage" || normalized === "drinks" || normalized === "soups") {
      return mealCat === "beverages & soups";
    }
    if (normalized === "vegetarian" || normalized === "veg") {
      return m.dietType === "veg" || m.isVeg === true;
    }
    if (normalized === "chicken" || normalized === "non-veg") {
      return (
        (m.dietType === "non-veg" || !m.isVeg) &&
        m.strMeal.toLowerCase().includes("chicken")
      );
    }
    return false;
  });

  if (filteredIndian.length === 0 && worldMatches.length === 0) {
    filteredIndian = INDIAN_MEALS.filter((m) =>
      (m.strCategory || "").toLowerCase().includes(normalized)
    );
  }

  const localFull = filteredIndian
    .filter((m) => !customIds.has(String(m.idMeal)))
    .map((m) => normalizeMeal(getFullMealData(m)));

  let merged = [...customMatching, ...worldMatches, ...localFull];

  // 4. If this category belongs to a world cuisine area, search that area's meals
  const catObj = WORLD_CUISINE_CATEGORIES.find(
    (c) => c.strCategory.toLowerCase() === normalized
  );
  if (catObj && catObj.strArea && catObj.strArea !== "Tamil Nadu") {
    try {
      const areaMealsRes = await fetchMealsByArea(catObj.strArea);
      const areaDishes = areaMealsRes.data?.meals || [];
      const areaMatches = areaDishes.filter((dish) => {
        const dCat = (dish.strCategory || "").toLowerCase().trim();
        return dCat === normalized || dCat.includes(normalized) || normalized.includes(dCat);
      });
      const existingIds = new Set(merged.map((m) => String(m.idMeal)));
      areaMatches.forEach((m) => {
        if (!existingIds.has(String(m.idMeal))) {
          existingIds.add(String(m.idMeal));
          merged.push(m);
        }
      });
    } catch (e) {
      console.warn("fetchMealsByCategory area fallback error:", e);
    }
  }

  // 5. If no local or world dishes match, try querying TheMealDB category filter endpoint
  if (merged.length === 0) {
    try {
      const resp = await axios.get(`${THEMEALDB_BASE}/filter.php?c=${encodeURIComponent(cat)}`);
      if (resp.data?.meals && Array.isArray(resp.data.meals)) {
        const apiMeals = resp.data.meals.map((m) =>
          normalizeMeal({
            ...m,
            strCategory: cat,
          })
        );
        merged = apiMeals;
      }
    } catch (err) {
      console.warn("TheMealDB category fetch error:", err);
    }
  }

  return {
    data: {
      meals: merged.length > 0 ? merged : null,
    },
  };
};

// Fetch supported Areas / Cuisines with rich, complete recipes
export const fetchAreas = async () => {
  return {
    data: {
      areas: CUISINE_AREAS_META,
    },
  };
};

// Fetch meals filtered by Cuisine / Area
export const fetchMealsByArea = async (area) => {
  if (!area) return { data: { meals: [] } };

  const normArea = area.toLowerCase().trim();

  // 1. If Tamil Nadu
  if (normArea === "tamil nadu") {
    const tnMeals = INDIAN_MEALS.filter(
      (m) => (m.strArea || "").toLowerCase().includes("tamil") || m.strCategory?.includes("Tamil")
    ).map((m) => normalizeMeal(getFullMealData(m)));
    return { data: { meals: tnMeals } };
  }

  // 2. If North Indian
  if (normArea === "north indian") {
    const northMeals = WORLD_DISHES.filter(
      (m) => (m.strArea || "").toLowerCase().trim() === "north indian"
    ).map(normalizeMeal);
    return { data: { meals: northMeals } };
  }

  // 3. If Pakistani
  if (normArea === "pakistani" || normArea === "pakistan") {
    const pakMeals = WORLD_DISHES.filter(
      (m) => (m.strArea || "").toLowerCase().trim() === "pakistani"
    ).map(normalizeMeal);
    return { data: { meals: pakMeals } };
  }

  // 4. If Indian: merge local curated Indian dishes + TheMealDB Indian dishes
  if (normArea === "indian") {
    const localIndian = INDIAN_MEALS.map((m) => normalizeMeal(getFullMealData(m)));
    try {
      const res = await axios.get(`${THEMEALDB_BASE}/filter.php?a=Indian`, { timeout: 3000 });
      const apiIndian = (res.data?.meals || []).map((m) =>
        normalizeMeal({
          ...m,
          strArea: "Indian",
        })
      );
      const seenNames = new Set(localIndian.map((m) => m.strMeal.toLowerCase()));
      const filteredApi = apiIndian.filter((m) => !seenNames.has(m.strMeal.toLowerCase()));
      return { data: { meals: [...localIndian, ...filteredApi] } };
    } catch {
      return { data: { meals: localIndian } };
    }
  }

  // 5. Check curated World Dishes for this specific area
  const localWorldAreaMeals = WORLD_DISHES.filter(
    (m) => (m.strArea || "").toLowerCase().trim() === normArea
  ).map(normalizeMeal);

  // 6. Query TheMealDB API for additional dishes in this area
  try {
    const res = await axios.get(`${THEMEALDB_BASE}/filter.php?a=${encodeURIComponent(area)}`, {
      timeout: 3000,
    });
    const apiAreaMeals = (res.data?.meals || []).map((m) =>
      normalizeMeal({
        ...m,
        strArea: area,
      })
    );

    const localNames = new Set(localWorldAreaMeals.map((m) => m.strMeal.toLowerCase()));
    const filteredApiMeals = apiAreaMeals.filter((m) => !localNames.has(m.strMeal.toLowerCase()));

    const validAreaCategories = new Set(
      getCategoriesForArea(area).map((c) => c.strCategory.toLowerCase().trim())
    );

    const combinedArea = [...localWorldAreaMeals, ...filteredApiMeals];
    const categorized = combinedArea.map((m) => {
      const currentCat = (m.strCategory || "").toLowerCase().trim();
      const hasValidCat = validAreaCategories.has(currentCat);
      const finalCat = hasValidCat ? m.strCategory : classifyMealCategory(m, area);
      return {
        ...m,
        strCategory: finalCat,
      };
    });
    return { data: { meals: categorized.length > 0 ? categorized : localWorldAreaMeals } };
  } catch (err) {
    console.error(`fetchMealsByArea error for ${area}:`, err);
    const fallbackCategorized = localWorldAreaMeals.map((m) => ({
      ...m,
      strCategory: m.strCategory || classifyMealCategory(m, area),
    }));
    return { data: { meals: fallbackCategorized } };
  }
};

export const fetchMealsById = async (id) => {
  if (!id) return { data: { meals: null } };

  // 1. Check custom dishes in localStorage
  const customDish = getCustomDishById(id);
  if (customDish) {
    return {
      data: {
        meals: [normalizeMeal(customDish)],
      },
    };
  }

  // 2. Check curated World Cuisine dishes
  const foundWorld = WORLD_DISHES.find((m) => String(m.idMeal) === String(id));
  if (foundWorld) {
    return {
      data: {
        meals: [normalizeMeal(foundWorld)],
      },
    };
  }

  // 3. Check curated Indian & Tamil Nadu dishes
  const foundMeal = INDIAN_MEALS.find((m) => String(m.idMeal) === String(id));
  if (foundMeal) {
    return {
      data: {
        meals: [normalizeMeal(getFullMealData(foundMeal))],
      },
    };
  }

  // 4. Check partial local id match
  const fallbackLocal = INDIAN_MEALS.find(
    (m) => String(m.idMeal).includes(String(id)) || String(id).includes(String(m.idMeal))
  );
  if (fallbackLocal) {
    return {
      data: {
        meals: [normalizeMeal(getFullMealData(fallbackLocal))],
      },
    };
  }

  // 5. Query TheMealDB lookup endpoint by ID
  try {
    const res = await axios.get(`${THEMEALDB_BASE}/lookup.php?i=${encodeURIComponent(id)}`);
    if (res.data?.meals && res.data.meals.length > 0) {
      return {
        data: {
          meals: [normalizeMeal(res.data.meals[0])],
        },
      };
    }
  } catch (err) {
    console.error(`fetchMealsById API error for id ${id}:`, err);
  }

  return {
    data: {
      meals: null,
    },
  };
};

export const searchMeals = async (query) => {
  if (!query || !query.trim()) {
    return { data: { meals: [] } };
  }

  const q = query.toLowerCase().trim();
  const customMatching = searchCustomDishes(q).map(normalizeMeal);
  const customIds = new Set(customMatching.map((m) => String(m.idMeal)));

  // 1. Search local dishes
  const matchedLocal = INDIAN_MEALS.filter((m) => {
    if (customIds.has(String(m.idMeal))) return false;
    const nameMatch = (m.strMeal || "").toLowerCase().includes(q);
    const catMatch = (m.strCategory || "").toLowerCase().includes(q);
    const areaMatch = (m.strArea || "").toLowerCase().includes(q);
    const instrMatch = (m.strInstructions || "").toLowerCase().includes(q);
    const ingMatch = Array.isArray(m.ingredients)
      ? m.ingredients.some((ing) => (ing.ingredient || "").toLowerCase().includes(q))
      : false;
    return nameMatch || catMatch || areaMatch || instrMatch || ingMatch;
  }).map((m) => normalizeMeal(getFullMealData(m)));

  const merged = [...customMatching, ...matchedLocal];
  const seenNames = new Set(merged.map((m) => m.strMeal.toLowerCase()));

  // 2. Query TheMealDB search endpoint
  try {
    const res = await axios.get(`${THEMEALDB_BASE}/search.php?s=${encodeURIComponent(q)}`);
    if (res.data?.meals && Array.isArray(res.data.meals)) {
      res.data.meals.forEach((meal) => {
        if (!seenNames.has(meal.strMeal.toLowerCase())) {
          seenNames.add(meal.strMeal.toLowerCase());
          merged.push(normalizeMeal(meal));
        }
      });
    }
  } catch (err) {
    console.warn("TheMealDB search error:", err);
  }

  return {
    data: {
      meals: merged.length > 0 ? merged : null,
    },
  };
};

// Helper for country flags
export function getAreaFlag(area) {
  const flags = {
    American: "🇺🇸",
    British: "🇬🇧",
    Canadian: "🇨🇦",
    Chinese: "🇨🇳",
    Croatian: "🇭🇷",
    Dutch: "🇳🇱",
    Egyptian: "🇪🇬",
    Filipino: "🇵🇭",
    French: "🇫🇷",
    Greek: "🇬🇷",
    Indian: "🇮🇳",
    Irish: "🇮🇪",
    Italian: "🇮🇹",
    Jamaican: "🇯🇲",
    Japanese: "🇯🇵",
    Kenyan: "🇰🇪",
    Malaysian: "🇲🇾",
    Mexican: "🇲🇽",
    Moroccan: "🇲🇦",
    Polish: "🇵🇱",
    Portuguese: "🇵🇹",
    Russian: "🇷🇺",
    Spanish: "🇪🇸",
    Thai: "🇹🇭",
    Tunisian: "🇹🇳",
    Turkish: "🇹🇷",
    Ukrainian: "🇺🇦",
    Uruguayan: "🇺🇾",
    Vietnamese: "🇻🇳",
    "Tamil Nadu": "🇮🇳",
    "North Indian": "🇮🇳",
  };
  return flags[area] || "🍲";
}
