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

const GUEST_FAVORITES_KEY = "mealdb_favorites";

const getFavoritesStorageKey = (user) => {
  if (user && user.email) {
    return `favorites_${user.email.toLowerCase().trim()}`;
  }
  return GUEST_FAVORITES_KEY;
};

const loadFavoritesFromStorage = (user) => {
  const userKey = user && user.email ? `favorites_${user.email.toLowerCase().trim()}` : null;
  try {
    // If logged in, check user specific key first
    if (userKey) {
      const rawUser = localStorage.getItem(userKey);
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (Array.isArray(parsed)) return parsed;
      }
      // If user specific list is empty, check if guest favorites exist and migrate them
      const rawGuest = localStorage.getItem(GUEST_FAVORITES_KEY);
      if (rawGuest) {
        const parsedGuest = JSON.parse(rawGuest);
        if (Array.isArray(parsedGuest) && parsedGuest.length > 0) {
          localStorage.setItem(userKey, JSON.stringify(parsedGuest));
          return parsedGuest;
        }
      }
      return [];
    }

    // Guest user - load from guest storage
    const raw = localStorage.getItem(GUEST_FAVORITES_KEY);
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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => loadFavoritesFromStorage(currentUser));
  const favoritesLoading = false;

  // Adjust state when active user changes
  const [prevEmail, setPrevEmail] = useState(currentUser?.email);
  if (currentUser?.email !== prevEmail) {
    setPrevEmail(currentUser?.email);
    setFavorites(loadFavoritesFromStorage(currentUser));
  }

  // Sync across tabs via window storage events
  useEffect(() => {
    const handleStorage = (e) => {
      const currentKey = getFavoritesStorageKey(currentUser);
      if (e.key === currentKey || e.key === GUEST_FAVORITES_KEY || !e.key) {
        setFavorites(loadFavoritesFromStorage(currentUser));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [currentUser]);

  /**
   * Toggle meal in favorites (supports both guests and logged-in users)
   */
  const toggle = useCallback(
    (meal) => {
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
        const exists = prev.some((m) => String(m.idMeal) === String(cleanMeal.idMeal));
        const updated = exists
          ? prev.filter((m) => String(m.idMeal) !== String(cleanMeal.idMeal))
          : [cleanMeal, ...prev];

        const key = getFavoritesStorageKey(currentUser);
        try {
          localStorage.setItem(key, JSON.stringify(updated));
          // Always keep guest key updated as fallback
          localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(updated));
        } catch (err) {
          console.error("Error saving favorites to localStorage:", err);
        }
        return updated;
      });

      return true;
    },
    [currentUser]
  );

  const isFavorite = useCallback(
    (id) => {
      if (!id) return false;
      return favorites.some((m) => String(m.idMeal) === String(id));
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    const key = getFavoritesStorageKey(currentUser);
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(GUEST_FAVORITES_KEY);
    } catch (err) {
      console.error("Error clearing favorites from localStorage:", err);
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
