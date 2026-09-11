import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getMealPrice } from "../utils/price";
import { API_BASE_URL } from "../config.js";

const CartContext = createContext(null);

const getCartStorageKey = (user) => {
  if (!user || !user.email) return null;
  return `cart_${user.email.toLowerCase().trim()}`;
};

const loadCartFromStorage = (user) => {
  const key = getCartStorageKey(user);
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to read cart from localStorage:", e);
  }
  return [];
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage(currentUser));
  const cartLoading = false;

  // Adjust state when active user changes
  const [prevEmail, setPrevEmail] = useState(currentUser?.email);
  if (currentUser?.email !== prevEmail) {
    setPrevEmail(currentUser?.email);
    setCartItems(loadCartFromStorage(currentUser));
  }

  // Persist cart to localStorage whenever cartItems or currentUser changes
  useEffect(() => {
    const key = getCartStorageKey(currentUser);
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(cartItems));
    } catch (err) {
      console.error("Error saving cart to localStorage:", err);
    }
  }, [cartItems, currentUser]);

  // Sync across tabs via window storage events (only for changes from other tabs)
  useEffect(() => {
    const handleStorage = (e) => {
      const currentKey = getCartStorageKey(currentUser);
      if (e.key === currentKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        } catch {
          // ignore parsing error
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [currentUser]);

  // Initial fetch from backend if user has a valid JWT token
  useEffect(() => {
    const token = localStorage.getItem("mealdb_token");
    if (!token || !currentUser) return;

    let isMounted = true;
    fetch(`${API_BASE_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && data.cart && Array.isArray(data.cart.items)) {
          // Only update if backend has items and local cart was empty
          setCartItems((local) => {
            if (local.length === 0 && data.cart.items.length > 0) {
              return data.cart.items;
            }
            return local;
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  /**
   * Add item to cart.
   * If user is not logged in, redirects to /login page preserving the current URL.
   */
  const addToCart = useCallback(
    (meal, quantity = 1) => {
      if (!currentUser) {
        navigate("/login", {
          state: {
            from: window.location.pathname + window.location.search,
            message: "Please sign in to add meals to your cart.",
          },
        });
        return false;
      }

      if (!meal) return false;
      const price = getMealPrice(meal);
      const addQty = Math.max(1, Number(quantity) || 1);

      setCartItems((prev) => {
        const mealIdStr = String(meal.idMeal);
        const existing = prev.find((item) => String(item.idMeal) === mealIdStr);
        if (existing) {
          return prev.map((item) =>
            String(item.idMeal) === mealIdStr
              ? { ...item, quantity: item.quantity + addQty }
              : item
          );
        }
        return [
          ...prev,
          {
            idMeal: mealIdStr,
            strMeal: meal.strMeal || "Delicious Meal",
            strMealThumb: meal.strMealThumb || "",
            strCategory: meal.strCategory || "Meal",
            strArea: meal.strArea || "Delicious",
            price,
            quantity: addQty,
          },
        ];
      });

      // Synchronize with Express backend
      const token = localStorage.getItem("mealdb_token");
      if (token) {
        fetch(`${API_BASE_URL}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idMeal: String(meal.idMeal),
            strMeal: meal.strMeal || "Delicious Meal",
            strMealThumb: meal.strMealThumb || "",
            price,
            quantity: addQty,
          }),
        }).catch(() => {});
      }

      return true;
    },
    [currentUser, navigate]
  );

  /**
   * Adds multiple meals to cart in a single batch
   */
  const addItemsToCart = useCallback(
    (items = []) => {
      if (!currentUser) {
        navigate("/login", {
          state: {
            from: window.location.pathname + window.location.search,
            message: "Please sign in to add meals to your cart.",
          },
        });
        return false;
      }

      if (!items || items.length === 0) return false;

      setCartItems((prev) => {
        const updated = [...prev];
        items.forEach((item) => {
          if (!item || !item.idMeal) return;
          const price = typeof item.price === "number" ? item.price : getMealPrice(item);
          const quantity = typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1;
          const existingIndex = updated.findIndex((i) => String(i.idMeal) === String(item.idMeal));

          if (existingIndex > -1) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
          } else {
            updated.push({
              idMeal: String(item.idMeal),
              strMeal: item.strMeal || "Delicious Meal",
              strMealThumb: item.strMealThumb || "",
              strCategory: item.strCategory || "Meal",
              strArea: item.strArea || "Delicious",
              price,
              quantity,
            });
          }
        });
        return updated;
      });

      return true;
    },
    [currentUser, navigate]
  );

  const updateQuantity = useCallback(
    (idMeal, delta) => {
      if (!currentUser) {
        navigate("/login", {
          state: {
            from: window.location.pathname + window.location.search,
            message: "Please sign in to manage your cart.",
          },
        });
        return;
      }

      const mealIdStr = String(idMeal);
      setCartItems((prev) =>
        prev
          .map((item) => {
            if (String(item.idMeal) === mealIdStr) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean)
      );
    },
    [currentUser, navigate]
  );

  const removeFromCart = useCallback(
    (idMeal) => {
      const mealIdStr = String(idMeal);
      setCartItems((prev) => prev.filter((item) => String(item.idMeal) !== mealIdStr));

      const token = localStorage.getItem("mealdb_token");
      if (token) {
        fetch(`${API_BASE_URL}/api/cart/${mealIdStr}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    },
    []
  );

  const clearCart = useCallback(() => {
    setCartItems([]);

    const token = localStorage.getItem("mealdb_token");
    if (token) {
      fetch(`${API_BASE_URL}/api/cart`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  }, []);

  const getItemQuantity = useCallback(
    (idMeal) => {
      const item = cartItems.find((i) => i.idMeal === idMeal);
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
