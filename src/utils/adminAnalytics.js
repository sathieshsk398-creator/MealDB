/**
 * Admin Analytics Data Engine
 * Computes KPIs, 7-day revenue distributions, top Indian cuisines/meals,
 * and parses all mock checkout orders from localStorage.
 */

export const ADMIN_ORDERS_KEY = "mealdb_admin_mock_orders";

// Pre-seeded Indian dishes with authentic TheMealDB image URLs and details (base prices in INR)
export const INDIAN_MEAL_CATALOG = [
  {
    idMeal: "52806",
    strMeal: "Tandoori Chicken",
    strCategory: "Chicken",
    strArea: "Indian",
    price: 349,
    strMealThumb: "https://www.themealdb.com/images/media/meals/qptpvt1487339892.jpg",
  },
  {
    idMeal: "52795",
    strMeal: "Chicken Handi",
    strCategory: "Chicken",
    strArea: "Indian",
    price: 379,
    strMealThumb: "https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg",
  },
  {
    idMeal: "52807",
    strMeal: "Baingan Bharta",
    strCategory: "Vegetarian",
    strArea: "Indian",
    price: 249,
    strMealThumb: "https://www.themealdb.com/images/media/meals/urtpqw1487341253.jpg",
  },
  {
    idMeal: "52813",
    strMeal: "Kentucky Fried Chicken", // Used as a side or variant
    strCategory: "Chicken",
    strArea: "American",
    price: 299,
    strMealThumb: "https://www.themealdb.com/images/media/meals/xqusqy1487348868.jpg",
  },
  {
    idMeal: "52824",
    strMeal: "Beef Dumpling Stew",
    strCategory: "Beef",
    strArea: "Asian",
    price: 389,
    strMealThumb: "https://www.themealdb.com/images/media/meals/uyqrrv1511553350.jpg",
  },
  {
    idMeal: "52955",
    strMeal: "Butter Chicken Curry",
    strCategory: "Chicken",
    strArea: "Indian",
    price: 399,
    strMealThumb: "https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg",
  },
  {
    idMeal: "52956",
    strMeal: "Dal Makhani Deluxe",
    strCategory: "Vegetarian",
    strArea: "Indian",
    price: 269,
    strMealThumb: "https://www.themealdb.com/images/media/meals/urtpqw1487341253.jpg",
  },
  {
    idMeal: "52957",
    strMeal: "Paneer Tikka Biryani",
    strCategory: "Vegetarian",
    strArea: "Indian",
    price: 329,
    strMealThumb: "https://www.themealdb.com/images/media/meals/qptpvt1487339892.jpg",
  },
  {
    idMeal: "52958",
    strMeal: "Rogan Josh Kashmiri",
    strCategory: "Lamb",
    strArea: "Indian",
    price: 449,
    strMealThumb: "https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg",
  },
];

// Seed rich historical transactions for the last 7-10 days
export const generateSeedOrders = () => {
  const now = Date.now();
  const DAY_MS = 86400000;

  const usersList = [
    { email: "sathieshsk398@gmail.com", name: "Sathiesh", city: "Bangalore" },
    { email: "alex@example.com", name: "Alex Morgan", city: "Mumbai" },
    { email: "sarah@foodie.com", name: "Sarah Jenkins", city: "Delhi" },
    { email: "rohit.sharma@example.com", name: "Rohit Sharma", city: "Hyderabad" },
    { email: "priya.patel@example.com", name: "Priya Patel", city: "Ahmedabad" },
    { email: "arjun.kumar@example.com", name: "Arjun Kumar", city: "Chennai" },
    { email: "neha.gupta@example.com", name: "Neha Gupta", city: "Pune" },
    { email: "vikram.singh@example.com", name: "Vikram Singh", city: "Jaipur" },
    { email: "ananya.roy@example.com", name: "Ananya Roy", city: "Kolkata" },
  ];

  const paymentMethods = ["UPI", "Credit/Debit Card", "Cash on Delivery"];
  const statuses = ["Delivered", "Delivered", "Delivered", "Delivered", "In Transit", "Preparing"];

  // Defined distribution per day for smooth past 7 days chart (values in INR)
  // Days ago: 6, 5, 4, 3, 2, 1, 0 (today)
  const dayPlan = [
    { daysAgo: 6, orderCount: 5, baseRevenue: 13500 },
    { daysAgo: 5, orderCount: 6, baseRevenue: 17800 },
    { daysAgo: 4, orderCount: 8, baseRevenue: 23400 },
    { daysAgo: 3, orderCount: 7, baseRevenue: 20800 },
    { daysAgo: 2, orderCount: 10, baseRevenue: 29600 },
    { daysAgo: 1, orderCount: 11, baseRevenue: 34500 },
    { daysAgo: 0, orderCount: 9, baseRevenue: 28200 },
  ];

  const orders = [];
  let counter = 8921;

  dayPlan.forEach((plan) => {
    const dayTimestamp = now - plan.daysAgo * DAY_MS;

    for (let i = 0; i < plan.orderCount; i++) {
      counter += 3;
      const user = usersList[(counter + i) % usersList.length];
      const hourOffset = (i * 2 + 10) % 24;
      const orderDate = new Date(dayTimestamp);
      orderDate.setHours(hourOffset, (i * 17) % 60, 0);

      // Select 1 to 3 items, weighted towards Indian specialties
      const itemCount = 1 + (i % 3);
      const items = [];
      let itemTotal = 0;

      for (let j = 0; j < itemCount; j++) {
        // Favor Indian specialties
        const dishIndex = (i * 2 + j * 3) % INDIAN_MEAL_CATALOG.length;
        const dish = INDIAN_MEAL_CATALOG[dishIndex];
        const qty = 1 + ((i + j) % 2);
        items.push({
          idMeal: dish.idMeal,
          strMeal: dish.strMeal,
          strMealThumb: dish.strMealThumb,
          strCategory: dish.strCategory,
          strArea: dish.strArea,
          price: dish.price,
          quantity: qty,
        });
        itemTotal += dish.price * qty;
      }

      const deliveryFee = 49;
      const totalAmount = parseFloat((itemTotal + deliveryFee).toFixed(2));
      const payMethod = paymentMethods[(counter + i) % paymentMethods.length];
      const status = plan.daysAgo === 0 && i < 2 ? statuses[4 + (i % 2)] : "Delivered";

      orders.push({
        id: `SW-${counter}`,
        userEmail: user.email,
        userName: user.name,
        placedAt: orderDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        purchaseDate: orderDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: orderDate.getTime(),
        completedAt: orderDate.getTime() + 35 * 60000,
        status,
        statusIndex: status === "Delivered" ? 3 : status === "In Transit" ? 2 : 1,
        totalAmount,
        itemTotal: parseFloat(itemTotal.toFixed(2)),
        deliveryFee,
        totalCount: items.reduce((acc, curr) => acc + curr.quantity, 0),
        paymentMethod: payMethod,
        paymentStatus: payMethod === "Cash on Delivery" ? (status === "Delivered" ? "Paid on Delivery" : "Pending on Delivery") : "Paid Online",
        deliveryAddress: `Flat ${101 + i}, Prestige Heights, ${user.city}`,
        items,
      });
    }
  });

  // Sort descending by creation date
  orders.sort((a, b) => b.createdAt - a.createdAt);
  return orders;
};

/**
 * Loads all orders from localStorage.
 * Combines mock checkout data + user specific order histories.
 */
export const getAllAdminOrders = () => {
  let ordersMap = new Map();

  // 1. Load mock checkout orders
  try {
    const raw = localStorage.getItem(ADMIN_ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach((o) => {
          if (o && o.id) ordersMap.set(o.id, o);
        });
      }
    }
  } catch (e) {
    console.error("Error reading ADMIN_ORDERS_KEY:", e);
  }

  // If no mock orders exist yet, initialize with the seed orders
  if (ordersMap.size === 0) {
    const seeds = generateSeedOrders();
    seeds.forEach((o) => ordersMap.set(o.id, o));
    try {
      localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(seeds));
    } catch (e) {
      console.error("Failed to seed initial admin orders:", e);
    }
  }

  // 2. Scan localStorage for any consumer order_history_* keys and merge them
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("order_history_")) {
        const rawHistory = localStorage.getItem(key);
        if (rawHistory) {
          const userOrders = JSON.parse(rawHistory);
          if (Array.isArray(userOrders)) {
            userOrders.forEach((o) => {
              if (o && o.id) ordersMap.set(o.id, o);
            });
          }
        }
      } else if (key && key.startsWith("active_order_")) {
        const rawActive = localStorage.getItem(key);
        if (rawActive) {
          const activeOrder = JSON.parse(rawActive);
          if (activeOrder && activeOrder.id) {
            ordersMap.set(activeOrder.id, activeOrder);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error merging consumer order history into admin:", err);
  }

  const allOrders = Array.from(ordersMap.values()).map((o) => {
    if (o && o.totalAmount && o.totalAmount < 50) {
      const total = Math.round(o.totalAmount * 94.5);
      return {
        ...o,
        totalAmount: total,
        itemTotal: o.itemTotal ? Math.round(o.itemTotal * 94.5) : total - 49,
        deliveryFee: 49,
        items: (o.items || []).map((it) => ({
          ...it,
          price: it.price < 50 ? Math.round(it.price * 94.5) : it.price,
        })),
      };
    }
    return o;
  });
  allOrders.sort((a, b) => (b.createdAt || b.completedAt || 0) - (a.createdAt || a.completedAt || 0));
  return allOrders;
};

/**
 * Saves a new order into the global admin store
 */
export const registerOrderInAdminStore = (order) => {
  if (!order || !order.id) return;
  try {
    const current = getAllAdminOrders();
    const existingIdx = current.findIndex((o) => o.id === order.id);
    if (existingIdx > -1) {
      current[existingIdx] = { ...current[existingIdx], ...order };
    } else {
      current.unshift(order);
    }
    localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Error registering order in admin store:", err);
  }
};

/**
 * Computes high-level KPI metrics
 */
export const computeAdminMetrics = (orders) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Compute unique active users from orders and localStorage 'users'
  const uniqueEmails = new Set();
  orders.forEach((o) => {
    if (o.userEmail) uniqueEmails.add(o.userEmail.toLowerCase().trim());
  });

  try {
    const rawUsers = localStorage.getItem("users");
    if (rawUsers) {
      const parsedUsers = JSON.parse(rawUsers);
      if (Array.isArray(parsedUsers)) {
        parsedUsers.forEach((u) => {
          if (u.email) uniqueEmails.add(u.email.toLowerCase().trim());
        });
      }
    }
  } catch (e) {
    console.error("Error parsing users in metrics:", e);
  }

  const activeUsers = Math.max(uniqueEmails.size, 12); // Realistic customer baseline

  return {
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalOrders,
    activeUsers,
    avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
  };
};

/**
 * Computes 7-day daily revenue and order volume for Recharts Area/Line Chart
 */
export const computeDailyRevenueLast7Days = (orders) => {
  const DAY_MS = 86400000;
  const now = Date.now();
  const daysMap = [];

  // Generate date slots for past 7 days (index 0 = 6 days ago, index 6 = today)
  for (let i = 6; i >= 0; i--) {
    const dateObj = new Date(now - i * DAY_MS);
    const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
    const yearMonthDay = dateObj.toISOString().slice(0, 10);

    daysMap.push({
      key: yearMonthDay,
      date: dateStr,
      day: dayName,
      fullDate: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      revenue: 0,
      orders: 0,
      avgTicket: 0,
    });
  }

  // Aggregate orders by day
  orders.forEach((order) => {
    const timestamp = order.createdAt || order.completedAt;
    if (!timestamp) return;

    const orderDateStr = new Date(timestamp).toISOString().slice(0, 10);
    const targetSlot = daysMap.find((slot) => slot.key === orderDateStr);

    if (targetSlot) {
      const amt = Number(order.totalAmount) || 0;
      targetSlot.revenue = parseFloat((targetSlot.revenue + amt).toFixed(2));
      targetSlot.orders += 1;
    }
  });

  // Calculate average ticket per day
  daysMap.forEach((slot) => {
    slot.avgTicket = slot.orders > 0 ? parseFloat((slot.revenue / slot.orders).toFixed(2)) : 0;
  });

  return daysMap;
};

/**
 * Computes top 5 most ordered Indian cuisines / meals for Recharts Bar or Pie Chart
 */
export const computeTopIndianDishes = (orders) => {
  const dishCounts = new Map();

  // Known Indian dishes catalog for identification and enrichment
  const indianNames = [
    "Butter Chicken Curry",
    "Chicken Handi",
    "Tandoori Chicken",
    "Paneer Tikka Biryani",
    "Dal Makhani Deluxe",
    "Baingan Bharta",
    "Rogan Josh Kashmiri",
    "Chicken Tikka Masala",
    "Biryani",
  ];

  // Initialize all known Indian meals to ensure they appear meaningfully
  indianNames.forEach((name) => {
    dishCounts.set(name, {
      name,
      orders: 0,
      revenue: 0,
      cuisine: "Indian",
      category: name.toLowerCase().includes("paneer") || name.toLowerCase().includes("dal") || name.toLowerCase().includes("baingan") ? "Vegetarian" : "Non-Veg",
    });
  });

  orders.forEach((order) => {
    if (!Array.isArray(order.items)) return;
    order.items.forEach((item) => {
      const name = item.strMeal || "Special Dish";
      const isIndian =
        item.strArea === "Indian" ||
        indianNames.some((inName) => name.toLowerCase().includes(inName.toLowerCase())) ||
        name.toLowerCase().includes("curry") ||
        name.toLowerCase().includes("tikka") ||
        name.toLowerCase().includes("biryani") ||
        name.toLowerCase().includes("dal") ||
        name.toLowerCase().includes("tandoori") ||
        name.toLowerCase().includes("paneer") ||
        name.toLowerCase().includes("masala");

      if (isIndian) {
        // Normalize name
        let matchedName = name;
        for (const inName of indianNames) {
          if (name.toLowerCase().includes(inName.toLowerCase())) {
            matchedName = inName;
            break;
          }
        }

        const current = dishCounts.get(matchedName) || {
          name: matchedName,
          orders: 0,
          revenue: 0,
          cuisine: "Indian",
          category: item.strCategory || "Main Course",
        };

        const qty = item.quantity || 1;
        const rev = (item.price || 15) * qty;

        current.orders += qty;
        current.revenue = parseFloat((current.revenue + rev).toFixed(2));
        dishCounts.set(matchedName, current);
      }
    });
  });

  // Convert to array and sort descending by total units ordered
  const sorted = Array.from(dishCounts.values()).sort((a, b) => b.orders - a.orders);

  // Palette of refined executive colors for Recharts
  const palette = ["#10b981", "#0ea5e9", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

  const top5 = sorted.slice(0, 5).map((dish, idx) => ({
    ...dish,
    fill: palette[idx % palette.length],
    color: palette[idx % palette.length],
  }));

  // If counts are sparse, add realistic baseline volume
  if (top5[0] && top5[0].orders === 0) {
    top5[0].orders = 48; top5[0].revenue = 876.00;
    top5[1].orders = 41; top5[1].revenue = 676.50;
    top5[2].orders = 35; top5[2].revenue = 559.65;
    top5[3].orders = 29; top5[3].revenue = 492.71;
    top5[4].orders = 24; top5[4].revenue = 324.00;
  }

  return top5;
};

/**
 * Returns the top 10 most recent transactions
 */
export const getRecentOrdersTable = (orders, limit = 10) => {
  return orders.slice(0, limit);
};
