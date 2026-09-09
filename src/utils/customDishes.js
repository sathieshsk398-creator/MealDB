// Utility for managing Admin Custom Dishes with localStorage persistence
export const CUSTOM_DISHES_KEY = "admin_custom_dishes";

/**
 * Initial sample seed dishes to provide an immediate out-of-the-box experience
 * if the admin hasn't added any yet or resets.
 */
export const DEFAULT_CUSTOM_DISHES = [
  {
    idMeal: "custom_1700000001",
    strMeal: "Shahi Paneer Masala",
    price: 349,
    strCategory: "Vegetarian",
    dietType: "veg",
    isVeg: true,
    strMealThumb: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    strInstructions:
      "1. Heat ghee in a pan, sauté whole spices with finely chopped onions and ginger-garlic paste until golden.\n2. Add cashew-tomato puree and simmer with turmeric, red chili, and garam masala.\n3. Gently fold in fresh soft cottage cheese (paneer) cubes and fresh cream.\n4. Simmer for 5 minutes and garnish with crushed kasuri methi and coriander.",
    strArea: "Indian",
    strIngredient1: "Cottage Cheese (Paneer)",
    strMeasure1: "300g cubes",
    strIngredient2: "Cashew Nut Paste",
    strMeasure2: "3 tbsp",
    strIngredient3: "Fresh Tomato Puree",
    strMeasure3: "1 cup",
    strIngredient4: "Fresh Cream",
    strMeasure4: "2 tbsp",
    strIngredient5: "Garam Masala & Ghee",
    strMeasure5: "1 tbsp",
    ingredients: [
      { ingredient: "Cottage Cheese (Paneer)", measure: "300g cubes" },
      { ingredient: "Cashew Nut Paste", measure: "3 tbsp" },
      { ingredient: "Fresh Tomato Puree", measure: "1 cup" },
      { ingredient: "Fresh Cream", measure: "2 tbsp" },
      { ingredient: "Garam Masala & Ghee", measure: "1 tbsp" },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isCustom: true,
  },
  {
    idMeal: "custom_1700000002",
    strMeal: "Old Delhi Butter Chicken",
    price: 429,
    strCategory: "Chicken",
    dietType: "non-veg",
    isVeg: false,
    strMealThumb: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
    strInstructions:
      "1. Marinate chicken pieces in thick yogurt, Kashmiri red chili, and lemon juice for 2 hours.\n2. Char-grill or pan roast until 80% done.\n3. In a heavy pan, prepare makhani gravy with ripe tomatoes, butter, cashew paste, and aromatic spices.\n4. Simmer the grilled chicken in the silky makhani gravy with fenugreek leaves.",
    strArea: "Indian",
    strIngredient1: "Boneless Chicken",
    strMeasure1: "500g",
    strIngredient2: "Butter & Cream",
    strMeasure2: "4 tbsp",
    strIngredient3: "Tomato Puree",
    strMeasure3: "1.5 cups",
    strIngredient4: "Kashmiri Red Chili",
    strMeasure4: "1.5 tsp",
    strIngredient5: "Kasuri Methi",
    strMeasure5: "1 tsp crushed",
    ingredients: [
      { ingredient: "Boneless Chicken", measure: "500g" },
      { ingredient: "Butter & Cream", measure: "4 tbsp" },
      { ingredient: "Tomato Puree", measure: "1.5 cups" },
      { ingredient: "Kashmiri Red Chili", measure: "1.5 tsp" },
      { ingredient: "Kasuri Methi", measure: "1 tsp crushed" },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isCustom: true,
  },
  {
    idMeal: "custom_1700000003",
    strMeal: "Royal Kesari Phirni",
    price: 189,
    strCategory: "Dessert",
    dietType: "veg",
    isVeg: true,
    strMealThumb: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    strInstructions:
      "1. Soak basmati rice, drain and grind coarsely into a fine semolina-like paste.\n2. Bring full-fat milk to a rolling boil and add the ground rice while stirring continuously.\n3. Infuse saffron strands in warm milk and stir in along with cardamom powder and sugar.\n4. Pour into traditional earthen clay bowls (matkas) and chill thoroughly before serving.",
    strArea: "Indian",
    strIngredient1: "Basmati Rice (Ground)",
    strMeasure1: "1/4 cup",
    strIngredient2: "Full Cream Milk",
    strMeasure2: "1 litre",
    strIngredient3: "Kashmiri Saffron",
    strMeasure3: "10-12 strands",
    strIngredient4: "Cardamom & Sugar",
    strMeasure4: "1/2 cup",
    strIngredient5: "Pistachios & Almond slivers",
    strMeasure5: "2 tbsp",
    ingredients: [
      { ingredient: "Basmati Rice (Ground)", measure: "1/4 cup" },
      { ingredient: "Full Cream Milk", measure: "1 litre" },
      { ingredient: "Kashmiri Saffron", measure: "10-12 strands" },
      { ingredient: "Cardamom & Sugar", measure: "1/2 cup" },
      { ingredient: "Pistachios & Almond slivers", measure: "2 tbsp" },
    ],
    createdAt: new Date().toISOString(),
    isCustom: true,
  }
];

// In-memory synced dishes for instant synchronous reads across synchronous utilities
let inMemoryDishes = (() => {
  try {
    const raw = localStorage.getItem(CUSTOM_DISHES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to read initial custom dishes cache:", e);
  }
  try {
    localStorage.setItem(CUSTOM_DISHES_KEY, JSON.stringify(DEFAULT_CUSTOM_DISHES));
  } catch (e) {
    console.error("Failed to save default custom dishes:", e);
  }
  return DEFAULT_CUSTOM_DISHES;
})();

// Listen for tab sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === CUSTOM_DISHES_KEY || !e.key) {
      try {
        const raw = localStorage.getItem(CUSTOM_DISHES_KEY);
        if (raw) inMemoryDishes = JSON.parse(raw);
      } catch (err) {
        console.error("Error reading updated custom dishes:", err);
      }
    }
  });
}

/**
 * Retrieves all custom dishes from memory cache
 */
export const getCustomDishes = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_DISHES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryDishes = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to read custom dishes:", e);
  }
  return inMemoryDishes && inMemoryDishes.length > 0 ? inMemoryDishes : DEFAULT_CUSTOM_DISHES;
};

/**
 * Saves a new custom dish or updates an existing one in localStorage
 */
export const saveCustomDish = async (dish) => {
  const idMeal = String(dish.idMeal || dish.id || `custom_${Date.now()}`);

  const mappedIngredients = {};
  const ingredientList = Array.isArray(dish.ingredients) ? dish.ingredients : [];

  for (let i = 0; i < 20; i++) {
    if (ingredientList[i]) {
      mappedIngredients[`strIngredient${i + 1}`] = ingredientList[i].ingredient || "";
      mappedIngredients[`strMeasure${i + 1}`] = ingredientList[i].measure || "";
    } else {
      mappedIngredients[`strIngredient${i + 1}`] = "";
      mappedIngredients[`strMeasure${i + 1}`] = "";
    }
  }

  const isVeg = dish.dietType === "veg" || dish.isVeg === true;

  const normalizedDish = {
    ...dish,
    ...mappedIngredients,
    idMeal,
    id: idMeal,
    strMeal: dish.strMeal?.trim() || "Untitled Dish",
    price: Number(dish.price) || 299,
    strCategory: dish.strCategory?.trim() || "Main Course",
    dietType: isVeg ? "veg" : "non-veg",
    isVeg,
    strMealThumb:
      dish.strMealThumb?.trim() ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    strInstructions: dish.strInstructions?.trim() || "Chef's special recipe prepared fresh upon ordering.",
    strArea: dish.strArea || "Chef Specialty",
    ingredients: ingredientList,
    updatedAt: new Date().toISOString(),
    createdAt: dish.createdAt || new Date().toISOString(),
    isCustom: true,
  };

  const current = getCustomDishes();
  const existingIndex = current.findIndex((d) => String(d.idMeal) === idMeal);
  let updated;
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = normalizedDish;
  } else {
    updated = [normalizedDish, ...current];
  }

  inMemoryDishes = updated;

  try {
    localStorage.setItem(CUSTOM_DISHES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to update custom dishes cache:", e);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("admin_custom_dishes_updated", { detail: updated })
    );
    window.dispatchEvent(new Event("storage"));
  }

  return normalizedDish;
};

/**
 * Deletes a custom dish by idMeal from localStorage
 */
export const deleteCustomDish = async (idMeal) => {
  const current = getCustomDishes();
  inMemoryDishes = current.filter((d) => String(d.idMeal) !== String(idMeal));

  try {
    localStorage.setItem(CUSTOM_DISHES_KEY, JSON.stringify(inMemoryDishes));
  } catch (e) {
    console.warn("Failed to update custom dishes cache:", e);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("admin_custom_dishes_updated", { detail: inMemoryDishes })
    );
    window.dispatchEvent(new Event("storage"));
  }

  return inMemoryDishes;
};

/**
 * Finds a single custom dish by idMeal.
 */
export const getCustomDishById = (idMeal) => {
  const dishes = getCustomDishes();
  return dishes.find((d) => String(d.idMeal) === String(idMeal)) || null;
};

/**
 * Filters custom dishes by category.
 */
export const getCustomDishesByCategory = (category) => {
  if (!category) return [];
  const dishes = getCustomDishes();
  const normalizedCategory = category.toLowerCase().trim();

  return dishes.filter((dish) => {
    const cat = (dish.strCategory || "").toLowerCase().trim();
    return cat === normalizedCategory;
  });
};

/**
 * Searches custom dishes by query string across name, category, and ingredients.
 */
export const searchCustomDishes = (query) => {
  if (!query) return [];
  const dishes = getCustomDishes();
  const q = query.toLowerCase().trim();

  return dishes.filter((dish) => {
    const nameMatch = (dish.strMeal || "").toLowerCase().includes(q);
    const catMatch = (dish.strCategory || "").toLowerCase().includes(q);
    const instrMatch = (dish.strInstructions || "").toLowerCase().includes(q);
    return nameMatch || catMatch || instrMatch;
  });
};
