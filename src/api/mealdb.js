import {
  getCustomDishes,
  getCustomDishesByCategory,
  getCustomDishById,
  searchCustomDishes,
} from "../utils/customDishes";
import {
  INDIAN_CATEGORIES,
  INDIAN_MEALS,
  getFullMealData,
} from "../data/indianDishesData";

export const fetchCategories = async () => {
  try {
    // Custom dishes can introduce extra custom categories if created by admin
    const customDishes = getCustomDishes();
    const existingCatNames = new Set(
      INDIAN_CATEGORIES.map((c) => c.strCategory.toLowerCase())
    );

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
      data: {
        categories: [...INDIAN_CATEGORIES, ...extraCategories],
      },
    };
  } catch (error) {
    console.error("fetchCategories error:", error);
    return { data: { categories: INDIAN_CATEGORIES } };
  }
};

export const fetchMealsByCategory = async (cat) => {
  if (!cat) {
    return { data: { meals: INDIAN_MEALS.slice(0, 13).map(getFullMealData) } };
  }

  const normalized = cat.toLowerCase().trim();

  // Find admin custom dishes matching this category
  const customMatching = getCustomDishesByCategory(cat);
  const customIds = new Set(customMatching.map((m) => String(m.idMeal)));

  // Filter curated Indian dishes
  let filtered = INDIAN_MEALS.filter((m) => {
    const mealCat = (m.strCategory || "").toLowerCase().trim();
    if (mealCat === normalized) return true;

    // Handle friendly aliases
    if (normalized === "tiffin" || normalized === "breakfast") {
      return mealCat === "tamil nadu tiffin";
    }
    if (normalized === "biryani" || normalized === "rice") {
      return mealCat === "biryani & rice";
    }
    if (normalized === "curry" || normalized === "curries" || normalized === "kulambu") {
      return mealCat === "tamil curries & gravies";
    }
    if (normalized === "north indian" || normalized === "mughlai") {
      return mealCat === "north indian delights";
    }
    if (normalized === "snacks" || normalized === "starters" || normalized === "starter") {
      return mealCat === "starters & snacks";
    }
    if (normalized === "parotta" || normalized === "breads" || normalized === "roti") {
      return mealCat === "parottas & breads";
    }
    if (normalized === "dessert" || normalized === "desserts" || normalized === "sweets") {
      return mealCat === "desserts & sweets";
    }
    if (normalized === "beverage" || normalized === "beverages" || normalized === "drinks" || normalized === "soups") {
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

  // If alias didn't yield meals, fallback to search in category name
  if (filtered.length === 0) {
    filtered = INDIAN_MEALS.filter((m) =>
      (m.strCategory || "").toLowerCase().includes(normalized)
    );
  }

  // Format all with full meal attributes
  const fullDishes = filtered
    .filter((m) => !customIds.has(String(m.idMeal)))
    .map(getFullMealData);

  const merged = [...customMatching, ...fullDishes];

  return {
    data: {
      meals: merged.length > 0 ? merged : null,
    },
  };
};

export const fetchMealsById = async (id) => {
  // 1. Check if this is an admin custom dish stored in localStorage
  const customDish = getCustomDishById(id);
  if (customDish) {
    return {
      data: {
        meals: [customDish],
      },
    };
  }

  // 2. Check curated Indian & Tamil Nadu dishes
  const foundMeal = INDIAN_MEALS.find((m) => String(m.idMeal) === String(id));
  if (foundMeal) {
    return {
      data: {
        meals: [getFullMealData(foundMeal)],
      },
    };
  }

  // 3. Fallback check by partial id or name
  const fallback = INDIAN_MEALS.find(
    (m) => String(m.idMeal).includes(String(id)) || String(id).includes(String(m.idMeal))
  );
  if (fallback) {
    return {
      data: {
        meals: [getFullMealData(fallback)],
      },
    };
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
  const customMatching = searchCustomDishes(q);
  const customIds = new Set(customMatching.map((m) => String(m.idMeal)));

  const matched = INDIAN_MEALS.filter((m) => {
    if (customIds.has(String(m.idMeal))) return false;
    const nameMatch = (m.strMeal || "").toLowerCase().includes(q);
    const catMatch = (m.strCategory || "").toLowerCase().includes(q);
    const areaMatch = (m.strArea || "").toLowerCase().includes(q);
    const instrMatch = (m.strInstructions || "").toLowerCase().includes(q);
    const ingMatch = Array.isArray(m.ingredients)
      ? m.ingredients.some((ing) => (ing.ingredient || "").toLowerCase().includes(q))
      : false;
    return nameMatch || catMatch || areaMatch || instrMatch || ingMatch;
  }).map(getFullMealData);

  const merged = [...customMatching, ...matched];

  return {
    data: {
      meals: merged.length > 0 ? merged : null,
    },
  };
};
