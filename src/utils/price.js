// Deterministic mock pricing, food delivery metadata generator, and multi-currency formatting

export const STATIC_EXCHANGE_RATE = 94.5;
export const INR_PER_USD = 94.5;

export const getMealPrice = (meal) => {
  if (!meal) return 299;
  if (typeof meal === "number") {
    return meal < 50 ? Math.round(meal * INR_PER_USD) : meal;
  }
  if (meal.price && typeof meal.price === "number") {
    return meal.price < 50 ? Math.round(meal.price * INR_PER_USD) : meal.price;
  }

  const idStr = String(meal.idMeal || meal.id || meal.strMeal || "default");
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash * 31 + idStr.charCodeAt(i)) & 0xffffffff;
  }
  const absHash = Math.abs(hash);
  // Base price in INR between ₹199 and ₹699 in increments of ₹50
  const basePrice = 199 + (absHash % 11) * 50;
  return basePrice;
};

export const getMealRating = (meal) => {
  const idStr = String(meal?.idMeal || meal?.id || meal?.strMeal || "meal");
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash * 17 + idStr.charCodeAt(i)) & 0xffffffff;
  }
  const rating = 4.1 + (Math.abs(hash) % 9) * 0.1; // 4.1 to 4.9
  return Number(rating.toFixed(1));
};

export const getMealDeliveryTime = (meal) => {
  const idStr = String(meal?.idMeal || meal?.id || meal?.strMeal || "meal");
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash * 19 + idStr.charCodeAt(i)) & 0xffffffff;
  }
  const times = ["20-25 mins", "25-30 mins", "30-35 mins", "35-40 mins", "15-25 mins"];
  return times[Math.abs(hash) % times.length];
};

/**
 * Formats a base price in INR based on active currency ('INR' or 'USD').
 * If currency is USD: divides by 94.5 and formats to 2 decimal places with '$' symbol.
 * If INR: formats with '₹' symbol.
 *
 * @param {number|string} priceInINR - Base price in INR
 * @param {string} [currentCurrency] - 'INR' or 'USD' (falls back to localStorage or 'INR')
 * @returns {string} Formatted price string
 */
export const formatPrice = (priceInINR, currentCurrency) => {
  let currency = currentCurrency;
  if (!currency) {
    try {
      currency = localStorage.getItem("selected_currency") || localStorage.getItem("currency_preference") || "INR";
    } catch {
      currency = "INR";
    }
  }

  const num = Number(priceInINR || 0);

  if (currency === "USD") {
    const inUSD = num / INR_PER_USD;
    return `$${inUSD.toFixed(2)}`;
  }

  // Format with '₹' symbol for INR
  if (num % 1 === 0) {
    return `₹${num.toLocaleString("en-IN")}`;
  }
  return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
