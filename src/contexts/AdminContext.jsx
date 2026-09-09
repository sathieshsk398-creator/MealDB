import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  getAllAdminOrders,
  computeAdminMetrics,
  computeDailyRevenueLast7Days,
  computeTopIndianDishes,
  getRecentOrdersTable,
  generateSeedOrders,
  ADMIN_ORDERS_KEY,
} from "../utils/adminAnalytics";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => getAllAdminOrders());
  const [lastRefreshed, setLastRefreshed] = useState(() => Date.now());
  const [activeChartMetric, setActiveChartMetric] = useState("revenue"); // 'revenue' | 'orders'
  const [chartType, setChartType] = useState("area"); // 'area' | 'line'
  const [topItemsChartType, setTopItemsChartType] = useState("bar"); // 'bar' | 'pie'

  // Refresh all orders from localStorage
  const refreshData = useCallback(() => {
    const updated = getAllAdminOrders();
    setOrders(updated);
    setLastRefreshed(Date.now());
  }, []);

  // Listen to window storage events to auto-refresh whenever an order is placed or updated
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === ADMIN_ORDERS_KEY || !e.key) {
        refreshData();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshData]);

  // Compute Metrics
  const metrics = useMemo(() => computeAdminMetrics(orders), [orders]);

  // Compute 7-day daily trend
  const dailyRevenueData = useMemo(() => computeDailyRevenueLast7Days(orders), [orders]);

  // Compute Top 5 Indian Dishes
  const topIndianDishes = useMemo(() => computeTopIndianDishes(orders), [orders]);

  // 10 Most Recent Transactions
  const recentOrders = useMemo(() => getRecentOrdersTable(orders, 10), [orders]);

  // Update order status from Admin panel
  const updateOrderStatus = useCallback(
    (orderId, newStatus) => {
      const statusIndex = newStatus === "Delivered" ? 3 : newStatus === "In Transit" ? 2 : 1;
      const updatedTimestamp = Date.now();

      const updatedList = orders.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: newStatus,
            statusIndex,
            lastUpdatedAt: updatedTimestamp,
          };
        }
        return ord;
      });

      setOrders(updatedList);
      try {
        localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(updatedList));
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Failed to update order status in localStorage", e);
      }
    },
    [orders]
  );

  // Reset to initial mock dataset
  const resetToMockSeed = useCallback(() => {
    const seeds = generateSeedOrders();
    setOrders(seeds);
    try {
      localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(seeds));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to reset seed orders", e);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        orders,
        metrics,
        dailyRevenueData,
        topIndianDishes,
        recentOrders,
        lastRefreshed,
        activeChartMetric,
        setActiveChartMetric,
        chartType,
        setChartType,
        topItemsChartType,
        setTopItemsChartType,
        refreshData,
        updateOrderStatus,
        resetToMockSeed,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
