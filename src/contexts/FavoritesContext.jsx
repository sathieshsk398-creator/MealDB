import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const FavoriteContext = createContext(null);
const STORAGE_KEY = "mealdb_recipe_favorites";

const loadFavoritesFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to read favorites from localStorage:", e);
  }
  return [];
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(loadFavoritesFromStorage);
  const [favoritesLoading] = useState(false);

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error("Error saving favorites to localStorage:", err);
    }
  }, [favorites]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /**
   * Toggle meal in favorites. Saves essential recipe metadata.
   */
  const toggle = useCallback((meal) => {
    if (!meal || !meal.idMeal) return false;

    const recipeSummary = {
      idMeal: String(meal.idMeal),
      strMeal: meal.strMeal || "Delicious Recipe",
      strMealThumb: meal.strMealThumb || "",
      strCategory: meal.strCategory || "Recipe",
      strArea: meal.strArea || "International",
      strTags: meal.strTags || "",
      strYoutube: meal.strYoutube || "",
    };

    setFavorites((prev) => {
      const mealIdStr = String(recipeSummary.idMeal);
      const exists = prev.some((m) => String(m.idMeal) === mealIdStr);
      return exists
        ? prev.filter((m) => String(m.idMeal) !== mealIdStr)
        : [recipeSummary, ...prev];
    });

    return true;
  }, []);

  const isFavorite = useCallback(
    (id) => {
      if (!id) return false;
      return favorites.some((m) => String(m.idMeal) === String(id));
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Error clearing favorites from localStorage:", err);
    }
  }, []);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        favoritesLoading,
        toggle,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
