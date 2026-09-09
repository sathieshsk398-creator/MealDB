import { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { getMealPrice } from "../utils/price";

const CartContext = createContext(null);

const GUEST_CART_KEY = "mealdb_cart";

const getCartStorageKey = (user) => {
  if (user && user.email) {
    return `cart_${user.email.toLowerCase().trim()}`;
  }
  return GUEST_CART_KEY;
};

/**
 * Deduplicates cart items by idMeal, ensuring single unique entries with clean string IDs
 */
const deduplicateCartItems = (items) => {
  if (!Array.isArray(items)) return [];
  const map = new Map();

  for (const item of items) {
    if (!item || !item.idMeal) continue;
    const id = String(item.idMeal);
    const qty = Math.max(1, Math.round(Number(item.quantity) || 1));
    const price = typeof item.price === "number" ? item.price : getMealPrice(item);

    if (map.has(id)) {
      const existing = map.get(id);
      existing.quantity = Math.max(1, (existing.quantity || 1) + qty);
    } else {
      map.set(id, {
        idMeal: id,
        strMeal: item.strMeal || "Delicious Meal",
        strMealThumb: item.strMealThumb || "",
        strCategory: item.strCategory || "Meal",
        strArea: item.strArea || "Delicious",
        price,
        quantity: qty,
      });
    }
  }

  return Array.from(map.values());
};

const loadCartFromStorage = (user) => {
  try {
    const userKey = user && user.email ? `cart_${user.email.toLowerCase().trim()}` : null;
    const guestRaw = localStorage.getItem(GUEST_CART_KEY);
    let guestItems = [];
    if (guestRaw) {
      try {
        const parsed = JSON.parse(guestRaw);
        if (Array.isArray(parsed)) guestItems = parsed;
      } catch (e) {
        console.error("Failed to parse guest cart:", e);
      }
    }

    if (userKey) {
      const userRaw = localStorage.getItem(userKey);
      let userItems = [];
      if (userRaw) {
        try {
          const parsed = JSON.parse(userRaw);
          if (Array.isArray(parsed)) userItems = parsed;
        } catch (e) {
          console.error("Failed to parse user cart:", e);
        }
      }

      if (guestItems.length > 0) {
        const combined = deduplicateCartItems([...userItems, ...guestItems]);
        localStorage.setItem(userKey, JSON.stringify(combined));
        localStorage.removeItem(GUEST_CART_KEY);
        return combined;
      }

      return deduplicateCartItems(userItems);
    }

    return deduplicateCartItems(guestItems);
  } catch (err) {
    console.error("Failed to read cart from localStorage:", err);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage(currentUser));
  const cartLoading = false;
  const isInitialMount = useRef(true);

  // Sync state when active user changes (login / logout)
  const [prevEmail, setPrevEmail] = useState(currentUser?.email);
  if (currentUser?.email !== prevEmail) {
    setPrevEmail(currentUser?.email);
    setCartItems(loadCartFromStorage(currentUser));
  }

  // Persist cartItems changes to localStorage cleanly without side effects inside updaters
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const key = getCartStorageKey(currentUser);
    try {
      localStorage.setItem(key, JSON.stringify(cartItems));
      // Keep guest key updated as fallback if guest
      if (!currentUser) {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
      }
    } catch (err) {
      console.error("Error writing cart to storage:", err);
    }
  }, [cartItems, currentUser]);

  // Sync across tabs via window storage events (only reacts to external storage changes)
  useEffect(() => {
    const handleStorage = (e) => {
      const currentKey = getCartStorageKey(currentUser);
      if (e.key === currentKey || e.key === GUEST_CART_KEY) {
        setCartItems(loadCartFromStorage(currentUser));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [currentUser]);

  /**
   * Add item to cart.
   * Guaranteed single-count addition with exact string ID matching.
   */
  const addToCart = useCallback(
    (meal, quantity = 1) => {
      if (!meal || !meal.idMeal) return false;
      const cleanId = String(meal.idMeal);
      const addQty = Math.max(1, Math.round(Number(quantity) || 1));
      const price = typeof meal.price === "number" ? meal.price : getMealPrice(meal);

      setCartItems((prev) => {
        const existingIndex = prev.findIndex((item) => String(item.idMeal) === cleanId);
        if (existingIndex > -1) {
          return prev.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: (item.quantity || 1) + addQty }
              : item
          );
        }
        return [
          ...prev,
          {
            idMeal: cleanId,
            strMeal: meal.strMeal || "Delicious Meal",
            strMealThumb: meal.strMealThumb || "",
            strCategory: meal.strCategory || "Meal",
            strArea: meal.strArea || "Delicious",
            price,
            quantity: addQty,
          },
        ];
      });

      return true;
    },
    []
  );

  /**
   * Adds multiple meals to cart in a single batch
   */
  const addItemsToCart = useCallback(
    (items = []) => {
      if (!items || items.length === 0) return false;

      setCartItems((prev) => {
        const copy = [...prev];
        items.forEach((item) => {
          if (!item || !item.idMeal) return;
          const cleanId = String(item.idMeal);
          const price = typeof item.price === "number" ? item.price : getMealPrice(item);
          const qty = Math.max(1, Math.round(Number(item.quantity) || 1));
          const existingIndex = copy.findIndex((i) => String(i.idMeal) === cleanId);

          if (existingIndex > -1) {
            copy[existingIndex] = {
              ...copy[existingIndex],
              quantity: (copy[existingIndex].quantity || 1) + qty,
            };
          } else {
            copy.push({
              idMeal: cleanId,
              strMeal: item.strMeal || "Delicious Meal",
              strMealThumb: item.strMealThumb || "",
              strCategory: item.strCategory || "Meal",
              strArea: item.strArea || "Delicious",
              price,
              quantity: qty,
            });
          }
        });
        return deduplicateCartItems(copy);
      });

      return true;
    },
    []
  );

  const updateQuantity = useCallback((idMeal, delta) => {
    if (!idMeal) return;
    const cleanId = String(idMeal);
    const change = Number(delta) || 0;
    if (change === 0) return;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.idMeal) === cleanId);
      if (existingIndex === -1) return prev;

      const targetItem = prev[existingIndex];
      const newQty = (targetItem.quantity || 1) + change;

      if (newQty <= 0) {
        return prev.filter((_, idx) => idx !== existingIndex);
      }

      return prev.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: newQty } : item
      );
    });
  }, []);

  const removeFromCart = useCallback((idMeal) => {
    if (!idMeal) return;
    const cleanId = String(idMeal);
    setCartItems((prev) => prev.filter((item) => String(item.idMeal) !== cleanId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    const key = getCartStorageKey(currentUser);
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (err) {
      console.error("Failed to clear cart from localStorage:", err);
    }
  }, [currentUser]);

  const getItemQuantity = useCallback(
    (idMeal) => {
      if (!idMeal) return 0;
      const cleanId = String(idMeal);
      const item = cartItems.find((i) => String(i.idMeal) === cleanId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  const totalCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cartItems]);

  const itemTotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
  }, [cartItems]);

  const deliveryFee = totalCount > 0 ? 49 : 0;
  const totalAmount = itemTotal > 0 ? itemTotal + deliveryFee : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        addToCart,
        addItemsToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        totalCount,
        itemTotal,
        deliveryFee,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
