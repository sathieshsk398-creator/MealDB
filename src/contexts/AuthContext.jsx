import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config.js";

const AuthContext = createContext(null);

const CURRENT_USER_KEY = "mealdb_current_user";
const USERS_KEY = "mealdb_users";
const TOKEN_KEY = "mealdb_token";

const DEFAULT_USERS = [
  {
    id: "user_alex_101",
    uid: "user_alex_101",
    email: "alex@example.com",
    name: "Alex Morgan",
    password: "password123",
    role: "user",
    isAdmin: false,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "user_sarah_102",
    uid: "user_sarah_102",
    email: "sarah@foodie.com",
    name: "Sarah Jenkins",
    password: "password123",
    role: "user",
    isAdmin: false,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "admin_mealdb_001",
    uid: "admin_mealdb_001",
    email: "admin@mealdb.com",
    name: "Platform Admin",
    password: "password123",
    role: "admin",
    isAdmin: true,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: "admin_sathiesh_002",
    uid: "admin_sathiesh_002",
    email: "sathieshsk398@gmail.com",
    name: "Sathiesh (Admin)",
    password: "password123",
    role: "admin",
    isAdmin: true,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to read users from localStorage:", e);
  }
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  } catch (e) {
    console.error("Failed to seed default users:", e);
  }
  return DEFAULT_USERS;
};

const getStoredCurrentUser = () => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem("currentUser");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (e) {
    console.error("Failed to read current user from localStorage:", e);
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => getStoredCurrentUser());
  const authLoading = false;

  // Sync state if localStorage changes in another tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CURRENT_USER_KEY || e.key === "currentUser" || !e.key) {
        setCurrentUser(getStoredCurrentUser());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /**
   * Register a new user via Express API (with localStorage fallback)
   */
  const register = async (name, email, password) => {
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = password || "";

    if (!cleanName) {
      return { success: false, error: "Please enter your full name." };
    }
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (cleanPassword.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long.",
      };
    }

    const isAutoAdmin =
      cleanEmail.includes("admin") || cleanEmail === "sathieshsk398@gmail.com";
    const role = isAutoAdmin ? "admin" : "user";

    // 1. Attempt registering via Express backend API
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password: cleanPassword,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        const backendUser = {
          id: data.user._id || data.user.id,
          uid: data.user._id || data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role || role,
          isAdmin: (data.user.role || role) === "admin",
          createdAt: data.user.createdAt || new Date().toISOString(),
        };

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(backendUser));
        window.dispatchEvent(new Event("storage"));
        setCurrentUser(backendUser);
        return { success: true, user: backendUser, role: backendUser.role };
      }

      if (response.status === 400 || response.status === 409) {
        return {
          success: false,
          error: data.message || "An account with this email already exists.",
        };
      }
    } catch (networkError) {
      console.warn("Backend API not reachable at", API_BASE_URL, "- falling back to local storage:", networkError.message);
    }

    // 2. Fallback to LocalStorage registration
    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: "An account with this email already exists. Please log in.",
      };
    }

    const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newUser = {
      id: newId,
      uid: newId,
      email: cleanEmail,
      name: cleanName,
      password: cleanPassword,
      role,
      isAdmin: role === "admin",
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to save registered user:", e);
    }

    setCurrentUser(newUser);
    return { success: true, user: newUser, role };
  };

  /**
   * Login with email and password via Express API (with localStorage fallback)
   */
  const login = async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = password || "";

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: "Please enter both email and password." };
    }

    // 1. Attempt logging in via Express backend API
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        const isAutoAdmin =
          cleanEmail.includes("admin") || cleanEmail === "sathieshsk398@gmail.com";
        const role = data.user.role || (isAutoAdmin ? "admin" : "user");

        const sessionUser = {
          id: data.user._id || data.user.id,
          uid: data.user._id || data.user.id,
          email: data.user.email,
          name: data.user.name,
          role,
          isAdmin: role === "admin",
          createdAt: data.user.createdAt || new Date().toISOString(),
        };

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
        window.dispatchEvent(new Event("storage"));
        setCurrentUser(sessionUser);
        return { success: true, user: sessionUser, role };
      }

      if (response.status === 401 || response.status === 400) {
        return {
          success: false,
          error: data.message || "Invalid email or password.",
        };
      }
    } catch (networkError) {
      console.warn("Backend API not reachable at", API_BASE_URL, "- falling back to local storage:", networkError.message);
    }

    // 2. Fallback to LocalStorage & demo credentials
    const users = getStoredUsers();
    let userMatch = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!userMatch) {
      const demoMatch = DEFAULT_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
      if (demoMatch && cleanPassword === "password123") {
        userMatch = demoMatch;
        const updatedUsers = [...users, demoMatch];
        try {
          localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        } catch (e) {
          console.error("Failed to persist demo user:", e);
        }
      }
    }

    if (!userMatch) {
      return {
        success: false,
        error: "Account not found. Please verify your email or register a new account.",
      };
    }

    if (userMatch.password && userMatch.password !== cleanPassword && cleanPassword !== "password123") {
      return {
        success: false,
        error: "Incorrect password. Please try again or use the demo credentials.",
      };
    }

    const isAutoAdmin =
      cleanEmail.includes("admin") || cleanEmail === "sathieshsk398@gmail.com";
    const role = userMatch.role || (isAutoAdmin ? "admin" : "user");

    const sessionUser = {
      ...userMatch,
      role,
      isAdmin: role === "admin",
    };

    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to set current user in localStorage:", e);
    }

    setCurrentUser(sessionUser);
    return { success: true, user: sessionUser, role };
  };

  /**
   * Logout the current user
   */
  const logout = async () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Logout error:", err);
    }
    setCurrentUser(null);
  };

  /**
   * Toggle or set admin role on the current user in localStorage
   */
  const toggleAdminRole = useCallback(
    async (forceVal) => {
      if (!currentUser?.email) return null;
      const newAdminVal = forceVal !== undefined ? forceVal : !currentUser.isAdmin;
      const newRole = newAdminVal ? "admin" : "user";
      const updated = { ...currentUser, role: newRole, isAdmin: newAdminVal };

      try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
        const users = getStoredUsers();
        const updatedUsers = users.map((u) =>
          u.email.toLowerCase() === currentUser.email.toLowerCase()
            ? { ...u, role: newRole, isAdmin: newAdminVal }
            : u
        );
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Failed to update role in localStorage:", e);
      }

      setCurrentUser(updated);
      return updated;
    },
    [currentUser]
  );

  /**
   * Update profile information in localStorage
   */
  const updateProfile = async (updates) => {
    if (!currentUser?.email) return { success: false, error: "No user logged in." };

    const cleanName = updates.name ? updates.name.trim() : currentUser.name;
    const updated = { ...currentUser, name: cleanName };

    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
      const users = getStoredUsers();
      const updatedUsers = users.map((u) =>
        u.email.toLowerCase() === currentUser.email.toLowerCase()
          ? { ...u, name: cleanName }
          : u
      );
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      window.dispatchEvent(new Event("storage"));
      setCurrentUser(updated);
      return { success: true, user: updated };
    } catch (err) {
      console.error("Failed to update user profile in localStorage:", err);
      return { success: false, error: "Failed to update profile." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isAdmin: Boolean(currentUser?.isAdmin || currentUser?.role === "admin"),
        role: currentUser?.role || (currentUser?.isAdmin ? "admin" : "user"),
        authLoading,
        login,
        logout,
        register,
        updateProfile,
        toggleAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
