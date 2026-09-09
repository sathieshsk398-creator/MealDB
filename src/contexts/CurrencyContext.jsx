import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { formatPrice as formatPriceUtil, INR_PER_USD, STATIC_EXCHANGE_RATE } from "../utils/price";

const CurrencyContext = createContext(null);

const STORAGE_KEY = "selected_currency";
const ALT_STORAGE_KEY = "currency_preference";

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(ALT_STORAGE_KEY);
      if (saved === "USD" || saved === "INR") {
        return saved;
      }
    } catch (e) {
      console.error("Failed to read currency preference from localStorage:", e);
    }
    return "INR";
  });

  const setCurrency = useCallback((newCurrency) => {
    if (newCurrency === "USD" || newCurrency === "INR") {
      setCurrencyState(newCurrency);
      try {
        localStorage.setItem(STORAGE_KEY, newCurrency);
        localStorage.setItem(ALT_STORAGE_KEY, newCurrency);
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Failed to save currency preference:", e);
      }
    }
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrencyState((prev) => {
      const next = prev === "INR" ? "USD" : "INR";
      try {
        localStorage.setItem(STORAGE_KEY, next);
        localStorage.setItem(ALT_STORAGE_KEY, next);
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Failed to save currency preference:", e);
      }
      return next;
    });
  }, []);

  // Synchronize across tabs or components when storage updates
  useEffect(() => {
    const handleStorage = (e) => {
      if (!e || e.key === STORAGE_KEY || e.key === ALT_STORAGE_KEY) {
        try {
          const current = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(ALT_STORAGE_KEY);
          if ((current === "USD" || current === "INR") && current !== currency) {
            setCurrencyState(current);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [currency]);

  // Context-bound formatPrice helper that defaults to active context currency
  const formatPrice = useCallback(
    (priceInINR, overrideCurrency) => {
      return formatPriceUtil(priceInINR, overrideCurrency || currency);
    },
    [currency]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      toggleCurrency,
      exchangeRate: STATIC_EXCHANGE_RATE,
      inrPerUsd: INR_PER_USD,
      formatPrice,
      isINR: currency === "INR",
      isUSD: currency === "USD",
      currencySymbol: currency === "USD" ? "$" : "₹",
    }),
    [currency, setCurrency, toggleCurrency, formatPrice]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
