/**
 * Centralized utility for managing user order history and active orders in localStorage.
 */
import { registerOrderInAdminStore } from "./adminAnalytics";

// Realistic seed past orders for logged-in users with valid TheMealDB dishes in base INR
export const getSeedOrderHistory = (userEmail, userName) => {
  const email = userEmail || "sathieshsk398@gmail.com";
  const name = userName || email.split("@")[0];

  return [
    {
      id: "SW-824192",
      userEmail: email,
      userName: name,
      placedAt: "08:15 PM",
      purchaseDate: "Sep 04, 2026 • 08:15 PM",
      completedAt: Date.now() - 86400000 * 1, // 1 day ago
      status: "Delivered",
      statusIndex: 3,
      totalAmount: 946,
      itemTotal: 897,
      deliveryFee: 49,
      totalCount: 3,
      paymentMethod: "UPI",
      paymentStatus: "Paid Online",
      deliveryAddress: "Flat 402, Sunshine Residency, Green Glen Layout, Bellandur, Bangalore - 560103",
      items: [
        {
          idMeal: "52772",
          strMeal: "Teriyaki Chicken Casserole",
          strMealThumb: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
          strCategory: "Chicken",
          strArea: "Japanese",
          price: 349,
          quantity: 2,
        },
        {
          idMeal: "52928",
          strMeal: "BeaverTails",
          strMealThumb: "https://www.themealdb.com/images/media/meals/ryrsqt1511646059.jpg",
          strCategory: "Dessert",
          strArea: "Canadian",
          price: 199,
          quantity: 1,
        },
      ],
      cookingNote: "Extra spicy sauce on the side please",
      deliveryNote: "Leave with security if not answering door",
    },
    {
      id: "SW-649108",
      userEmail: email,
      userName: name,
      placedAt: "01:30 PM",
      purchaseDate: "Aug 30, 2026 • 01:30 PM",
      completedAt: Date.now() - 86400000 * 6, // 6 days ago
      status: "Delivered",
      statusIndex: 3,
      totalAmount: 647,
      itemTotal: 598,
      deliveryFee: 49,
      totalCount: 2,
      paymentMethod: "Credit/Debit Card",
      paymentStatus: "Paid Online",
      deliveryAddress: "Office Tower 3, 5th Floor, EcoWorld Tech Park, Bangalore - 560103",
      items: [
        {
          idMeal: "52874",
          strMeal: "Beef and Mustard Pie",
          strMealThumb: "https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg",
          strCategory: "Beef",
          strArea: "British",
          price: 399,
          quantity: 1,
        },
        {
          idMeal: "52855",
          strMeal: "Banana Pancakes",
          strMealThumb: "https://www.themealdb.com/images/media/meals/sywswr1511383814.jpg",
          strCategory: "Dessert",
          strArea: "American",
          price: 199,
          quantity: 1,
        },
      ],
      cookingNote: "Warm pancakes well",
      deliveryNote: "Call on arrival at building reception",
    },
    {
      id: "SW-419205",
      userEmail: email,
      userName: name,
      placedAt: "07:45 PM",
      purchaseDate: "Aug 22, 2026 • 07:45 PM",
      completedAt: Date.now() - 86400000 * 14, // 14 days ago
      status: "Delivered",
      statusIndex: 3,
      totalAmount: 348,
      itemTotal: 299,
      deliveryFee: 49,
      totalCount: 1,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Paid on Delivery",
      deliveryAddress: "Flat 402, Sunshine Residency, Green Glen Layout, Bellandur, Bangalore - 560103",
      items: [
        {
          idMeal: "52771",
          strMeal: "Spicy Arrabiata Penne",
          strMealThumb: "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
          strCategory: "Vegetarian",
          strArea: "Italian",
          price: 299,
          quantity: 1,
        },
      ],
      cookingNote: "Please include chili flakes and oregano",
      deliveryNote: "Ring bell twice",
    },
  ];
};

export const getOrderHistoryStorageKey = (userEmail) => {
  const email = userEmail?.toLowerCase()?.trim();
  return email ? `order_history_${email}` : "mealdb_order_history";
};

export const getActiveOrderStorageKey = (userEmail) => {
  const email = userEmail?.toLowerCase()?.trim();
  return email ? `active_order_${email}` : "mealdb_active_order";
};

/**
 * Loads order history from localStorage. If no history exists, initializes default seed orders.
 */
export const getOrderHistory = (userEmail, userName) => {
  const key = getOrderHistoryStorageKey(userEmail);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Normalize legacy order items if they were saved in USD before currency migration
        return parsed.map((o) => {
          if (o.totalAmount && o.totalAmount < 50) {
            return {
              ...o,
              totalAmount: Math.round(o.totalAmount * 94.5),
              itemTotal: o.itemTotal ? Math.round(o.itemTotal * 94.5) : Math.round(o.totalAmount * 94.5) - 49,
              deliveryFee: 49,
              items: (o.items || []).map((item) => ({
                ...item,
                price: item.price < 50 ? Math.round(item.price * 94.5) : item.price,
              })),
            };
          }
          return o;
        });
      }
    }
    // Seed initial orders for logged in user if not yet present
    const initialSeed = getSeedOrderHistory(userEmail, userName);
    localStorage.setItem(key, JSON.stringify(initialSeed));
    return initialSeed;
  } catch (err) {
    console.error("Failed to load order history:", err);
    return getSeedOrderHistory(userEmail, userName);
  }
};

/**
 * Saves or updates a completed order in user's order history.
 */
export const saveOrderToHistory = (order, userEmail) => {
  if (!order || !order.id) return;
  const key = getOrderHistoryStorageKey(userEmail || order.userEmail);
  try {
    const raw = localStorage.getItem(key);
    let history = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(history)) history = [];

    const purchaseDate =
      order.purchaseDate ||
      (order.createdAt
        ? new Date(order.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }));

    const finalized = {
      ...order,
      purchaseDate,
      completedAt: order.completedAt || Date.now(),
      status: "Delivered",
      statusIndex: 3,
    };

    const existingIndex = history.findIndex((o) => o.id === order.id);
    if (existingIndex > -1) {
      history[existingIndex] = finalized;
    } else {
      history.unshift(finalized);
    }

    localStorage.setItem(key, JSON.stringify(history));
    registerOrderInAdminStore(finalized);
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed to save order to history:", err);
  }
};
