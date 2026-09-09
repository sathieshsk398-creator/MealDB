import axios from "axios";
import {
  getCustomDishes,
  getCustomDishesByCategory,
  getCustomDishById,
  searchCustomDishes,
} from "../utils/customDishes";

const BASE = "https://www.themealdb.com/api/json/v1/1";

export const fetchCategories = async () => {
  try {
    const res = await axios.get(`${BASE}/categories.php`);
    const apiCategories = res.data?.categories || [];

    // Check if any custom dishes belong to categories not present in MealDB (e.g. Starter, Main Course)
    const customDishes = getCustomDishes();
    const existingCatNames = new Set(apiCategories.map((c) => c.strCategory.toLowerCase()));

    const extraCategories = [];
    customDishes.forEach((dish) => {
      const catName = dish.strCategory?.trim();
      if (catName && !existingCatNames.has(catName.toLowerCase())) {
        existingCatNames.add(catName.toLowerCase());
        extraCategories.push({
          idCategory: `custom_cat_${catName.toLowerCase().replace(/\s+/g, "_")}`,
          strCategory: catName,
          strCategoryThumb:
            dish.strMealThumb ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
          strCategoryDescription: `Freshly prepared chef-crafted ${catName} dishes.`,
        });
      }
    });

    return {
      ...res,
      data: {
        ...res.data,
        categories: [...apiCategories, ...extraCategories],
      },
    };
  } catch (error) {
    console.error("fetchCategories error:", error);
    return { data: { categories: [] } };
  }
};

export const fetchMealsByCategory = async (cat) => {
  const customMatching = getCustomDishesByCategory(cat);

  try {
    const res = await axios.get(`${BASE}/filter.php?c=${encodeURIComponent(cat)}`);
    const apiMeals = Array.isArray(res.data?.meals) ? res.data.meals : [];

    // Avoid duplicate IDs if a custom dish shares an ID with an API dish
    const customIds = new Set(customMatching.map((m) => String(m.idMeal)));
    const filteredApiMeals = apiMeals.filter((m) => !customIds.has(String(m.idMeal)));

    // Merged with custom dishes prioritized at the top
    const merged = [...customMatching, ...filteredApiMeals];

    return {
      data: {
        meals: merged.length > 0 ? merged : null,
      },
    };
  } catch {
    // If MealDB doesn't recognize custom category, return custom matching dishes
    return {
      data: {
        meals: customMatching.length > 0 ? customMatching : null,
      },
    };
  }
};

export const fetchMealsById = async (id) => {
  // First check if this is an admin custom dish stored in localStorage
  const customDish = getCustomDishById(id);
  if (customDish) {
    return {
      data: {
        meals: [customDish],
      },
    };
  }

  // Otherwise query MealDB
  return axios.get(`${BASE}/lookup.php?i=${id}`);
};

export const searchMeals = async (query) => {
  const customMatching = searchCustomDishes(query);

  try {
    const res = await axios.get(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
    const apiMeals = Array.isArray(res.data?.meals) ? res.data.meals : [];

    const customIds = new Set(customMatching.map((m) => String(m.idMeal)));
    const filteredApiMeals = apiMeals.filter((m) => !customIds.has(String(m.idMeal)));

    const merged = [...customMatching, ...filteredApiMeals];

    return {
      data: {
        meals: merged.length > 0 ? merged : null,
      },
    };
  } catch {
    return {
      data: {
        meals: customMatching.length > 0 ? customMatching : null,
      },
    };
  }
};
