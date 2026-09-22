import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getMealPrice } from "../utils/price";

const FavoriteContext = createContext(null);

const getFavoritesStorageKey = (user) => {
  if (user && user.email) {
    return `favorites_${user.email.toLowerCase().trim()}`;
  }
  return null;
};

const loadFavoritesFromStorage = (user) => {
  const userKey = getFavoritesStorageKey(user);
  if (!userKey) {
    return [];
  }

  try {
    const rawUser = localStorage.getItem(userKey);
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      if (Array.isArray(parsed)) return parsed;
    }

    // One-time migration: If user's list is empty, check legacy key then clean it up immediately
    const legacy = localStorage.getItem("mealdb_favorites");
    if (legacy) {
      localStorage.removeItem("mealdb_favorites");
      const parsedLegacy = JSON.parse(legacy);
      if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
        localStorage.setItem(userKey, JSON.stringify(parsedLegacy));
        return parsedLegacy;
      }
    }
  } catch (e) {
    console.error("Failed to read favorites from localStorage:", e);
  }
  return [];
};

export const FavoritesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => loadFavoritesFromStorage(currentUser));
  const favoritesLoading = false;

  // Adjust state when active user changes (login or logout)
  const [prevEmail, setPrevEmail] = useState(currentUser?.email);
  if (currentUser?.email !== prevEmail) {
    setPrevEmail(currentUser?.email);
    setFavorites(loadFavoritesFromStorage(currentUser));
  }

  // Persist favorites strictly to user's storage key whenever favorites or currentUser changes
  useEffect(() => {
    const key = getFavoritesStorageKey(currentUser);
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(favorites));
    } catch (err) {
      console.error("Error saving favorites to localStorage:", err);
    }
  }, [favorites, currentUser]);

  // Sync across tabs via window storage events
  useEffect(() => {
    const handleStorage = (e) => {
      const currentKey = getFavoritesStorageKey(currentUser);
      if (currentKey && e.key === currentKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        } catch {
          // ignore parsing errors
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [currentUser]);

  /**
   * Toggle meal in favorites.
   * If user is not logged in, prompts and redirects to /login.
   */
  const toggle = useCallback(
    (meal) => {
      if (!currentUser) {
        navigate("/login", {
          state: {
            from: window.location.pathname + window.location.search,
            message: "Please sign in to save dishes to your favorites.",
          },
        });
        return false;
      }

      if (!meal || !meal.idMeal) return false;

      const cleanMeal = {
        idMeal: String(meal.idMeal),
        strMeal: meal.strMeal || "Favorite Dish",
        strMealThumb: meal.strMealThumb || "",
        strCategory: meal.strCategory || "Meal",
        strArea: meal.strArea || "Delicious",
        price: typeof meal.price === "number" ? meal.price : getMealPrice(meal),
        rating: meal.rating || 4.5,
        deliveryTime: meal.deliveryTime || "25-35 mins",
        dietType: meal.dietType || null,
        isCustom: Boolean(meal.isCustom),
      };

      setFavorites((prev) => {
        const mealIdStr = String(cleanMeal.idMeal);
        const exists = prev.some((m) => String(m.idMeal) === mealIdStr);
        return exists
          ? prev.filter((m) => String(m.idMeal) !== mealIdStr)
          : [cleanMeal, ...prev];
      });

      return true;
    },
    [currentUser, navigate]
  );

  const isFavorite = useCallback(
    (id) => {
      if (!currentUser || !id) return false;
      return favorites.some((m) => String(m.idMeal) === String(id));
    },
    [currentUser, favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    const key = getFavoritesStorageKey(currentUser);
    if (key) {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.error("Error clearing favorites from localStorage:", err);
      }
    }
  }, [currentUser]);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        favoritesLoading,
        toggle,
        isFavorite,
        clearFavorites,
        navigate,
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

