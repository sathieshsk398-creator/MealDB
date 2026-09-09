export const ADMIN_ACCOUNTS_KEY = "admin_accounts";
export const CURRENT_ADMIN_KEY = "currentAdmin";
export const IS_ADMIN_LOGGED_IN_KEY = "isAdminLoggedIn";
export const ADMIN_USER_KEY = "adminUser";

/**
 * Safely retrieve all registered shop owner accounts from localStorage
 * Returns an array of { name, email, password, role: 'admin', ... } objects
 */
export const getStoredAdminAccounts = () => {
  try {
    const raw = localStorage.getItem(ADMIN_ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to read admin_accounts from localStorage:", e);
  }
  return [];
};

/**
 * Persist a new shop owner account to admin_accounts in localStorage
 */
export const saveAdminAccount = (account) => {
  try {
    const accounts = getStoredAdminAccounts();
    accounts.push(account);
    localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
    return true;
  } catch (e) {
    console.error("Failed to save admin account to localStorage:", e);
    return false;
  }
};

/**
 * Retrieve the active admin session object
 */
export const getCurrentAdminSession = () => {
  try {
    const raw = localStorage.getItem(CURRENT_ADMIN_KEY) || localStorage.getItem(ADMIN_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to read currentAdmin session from localStorage:", e);
  }
  return null;
};

/**
 * Set active admin session in localStorage
 */
export const setCurrentAdminSession = (session) => {
  try {
    localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(session));
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(session));
    localStorage.setItem(IS_ADMIN_LOGGED_IN_KEY, "true");
  } catch (e) {
    console.error("Failed to set admin session in localStorage:", e);
  }
};

/**
 * Clear active admin session in localStorage
 */
export const clearAdminSession = () => {
  try {
    localStorage.removeItem(CURRENT_ADMIN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.setItem(IS_ADMIN_LOGGED_IN_KEY, "false");
    localStorage.removeItem(IS_ADMIN_LOGGED_IN_KEY);
  } catch (e) {
    console.error("Failed to clear admin session from localStorage:", e);
  }
};

/**
 * Check if active admin is logged in
 */
export const isCurrentAdminLoggedIn = () => {
  try {
    const isLoggedIn = localStorage.getItem(IS_ADMIN_LOGGED_IN_KEY) === "true";
    const session = getCurrentAdminSession();
    return Boolean(isLoggedIn && session);
  } catch (e) {
    console.error("Failed to read admin auth state from localStorage:", e);
    return false;
  }
};
