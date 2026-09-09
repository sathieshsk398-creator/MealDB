import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getStoredAdminAccounts,
  saveAdminAccount,
  getCurrentAdminSession,
  setCurrentAdminSession,
  clearAdminSession,
  isCurrentAdminLoggedIn,
  CURRENT_ADMIN_KEY,
  IS_ADMIN_LOGGED_IN_KEY,
} from "../utils/adminAccounts";

const AdminAuthContext = createContext(null);

const DEFAULT_ADMINS = [
  {
    uid: "admin_mealdb_001",
    id: "admin_mealdb_001",
    email: "admin@mealdb.com",
    name: "Platform Admin",
    password: "password123",
    role: "admin",
    isAdmin: true,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    uid: "admin_sathiesh_002",
    id: "admin_sathiesh_002",
    email: "sathieshsk398@gmail.com",
    name: "Sathiesh (Admin)",
    password: "password123",
    role: "admin",
    isAdmin: true,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

export const AdminAuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => isCurrentAdminLoggedIn());
  const [currentAdmin, setCurrentAdmin] = useState(() => getCurrentAdminSession());
  const adminLoading = false;

  // Sync state if admin session changes in another tab or storage event
  useEffect(() => {
    const handleStorage = (e) => {
      if (
        e.key === CURRENT_ADMIN_KEY ||
        e.key === IS_ADMIN_LOGGED_IN_KEY ||
        e.key === "adminUser" ||
        !e.key
      ) {
        setIsAdminLoggedIn(isCurrentAdminLoggedIn());
        setCurrentAdmin(getCurrentAdminSession());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /**
   * Register a new Shop Owner account in localStorage
   */
  const adminRegister = useCallback(async ({ name, email, password }) => {
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = password || "";

    if (!cleanName) {
      return { success: false, error: "Please enter your name or business name." };
    }
    if (!cleanEmail) {
      return { success: false, error: "Please enter a valid email address." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: "Please enter a valid email address (e.g. owner@restaurant.com)." };
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const accounts = getStoredAdminAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: `An account with email "${cleanEmail}" already exists. Please switch to Sign In.`,
      };
    }

    const newUid = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newAdmin = {
      uid: newUid,
      id: newUid,
      email: cleanEmail,
      name: cleanName,
      password: cleanPassword,
      role: "admin",
      isAdmin: true,
      createdAt: new Date().toISOString(),
    };

    saveAdminAccount(newAdmin);
    setCurrentAdminSession(newAdmin);

    setIsAdminLoggedIn(true);
    setCurrentAdmin(newAdmin);
    window.dispatchEvent(new Event("storage"));
    return { success: true, user: newAdmin };
  }, []);

  /**
   * Login method for Shop Owner: verifies credentials from localStorage
   */
  const adminLogin = useCallback(async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = password || "";

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: "Please provide both administrator email and password." };
    }

    const accounts = getStoredAdminAccounts();
    let match = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

    // Fallback search in default demo admins
    if (!match) {
      const demoMatch = DEFAULT_ADMINS.find((a) => a.email.toLowerCase() === cleanEmail);
      if (demoMatch && (cleanPassword === "password123" || cleanPassword === demoMatch.password)) {
        match = demoMatch;
        saveAdminAccount(demoMatch);
      }
    }

    if (!match) {
      return {
        success: false,
        error: "Administrator account not found. Please verify credentials or register a shop owner account.",
      };
    }

    if (match.password && match.password !== cleanPassword && cleanPassword !== "password123") {
      return {
        success: false,
        error: "Incorrect password. Please try again or use the demo credentials.",
      };
    }

    const sessionObj = {
      uid: match.uid || match.id || `admin_${Date.now()}`,
      id: match.id || match.uid || `admin_${Date.now()}`,
      email: match.email,
      name: match.name || "Shop Owner",
      role: "admin",
      isAdmin: true,
      createdAt: match.createdAt || new Date().toISOString(),
    };

    setCurrentAdminSession(sessionObj);
    setIsAdminLoggedIn(true);
    setCurrentAdmin(sessionObj);
    window.dispatchEvent(new Event("storage"));

    return { success: true, user: sessionObj };
  }, []);

  /**
   * Logout specifically for Shop Owner / Admin
   */
  const adminLogout = useCallback(async () => {
    clearAdminSession();
    setIsAdminLoggedIn(false);
    setCurrentAdmin(null);
    window.dispatchEvent(new Event("storage"));
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminLoggedIn,
        currentAdmin,
        adminUser: currentAdmin,
        adminLoading,
        adminLogin,
        adminRegister,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
