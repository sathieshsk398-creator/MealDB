import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  User,
  AlertCircle,
  ArrowLeft,
  LayoutDashboard,
  CheckCircle2,
  Store,
  Info,
} from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { getStoredAdminAccounts } from "../utils/adminAccounts";

const AdminLogin = () => {
  const { isAdminLoggedIn, currentAdmin, adminLogin, adminRegister, adminLogout } = useAdminAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredAccountsCount, setRegisteredAccountsCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTarget = location.state?.from?.pathname || "/admin";

  // Check how many admin accounts exist in localStorage
  useEffect(() => {
    const checkAccounts = () => {
      const accounts = getStoredAdminAccounts();
      setRegisteredAccountsCount(accounts.length);
    };

    checkAccounts();
    window.addEventListener("storage", checkAccounts);
    window.addEventListener("admin_auth_changed", checkAccounts);
    return () => {
      window.removeEventListener("storage", checkAccounts);
      window.removeEventListener("admin_auth_changed", checkAccounts);
    };
  }, []);

  // Clear errors when switching modes
  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccessMsg("");
  };

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanEmail = loginEmail.trim();
    if (!cleanEmail || !loginPassword) {
      setError("Please provide both your administrator email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin(cleanEmail, loginPassword);
      setLoading(false);
      if (res.success) {
        navigate(redirectTarget, { replace: true });
      } else {
        setError(res.error || "Invalid administrator credentials.");
      }
    } catch {
      setLoading(false);
      setError("An unexpected error occurred during admin sign in.");
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanName = registerName.trim();
    const cleanEmail = registerEmail.trim();

    if (!cleanName) {
      setError("Please enter your full name or business name.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your work email address.");
      return;
    }

    if (!registerPassword) {
      setError("Please create a master password for your admin account.");
      return;
    }

    if (registerPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await adminRegister({
        name: cleanName,
        email: cleanEmail,
        password: registerPassword,
      });

      setLoading(false);

      if (res.success) {
        setSuccessMsg("Shop Owner account created successfully! Redirecting...");
        setTimeout(() => {
          navigate(redirectTarget, { replace: true });
        }, 600);
      } else {
        setError(res.error || "Failed to create shop owner account.");
      }
    } catch {
      setLoading(false);
      setError("An unexpected error occurred during registration.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 relative selection:bg-emerald-500 selection:text-slate-950">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Brand & Portal Header */}
        <div className="text-center space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Consumer Food Store</span>
          </Link>

          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/60 border border-emerald-400/30">
            <LayoutDashboard className="w-7 h-7" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Shop Owner Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Admin Authentication
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-sm mx-auto">
              {mode === "login"
                ? "Sign in with your shop owner credentials to access store analytics and menu controls."
                : "Register a new shop owner account to manage orders, inventory, and restaurant performance."}
            </p>
          </div>
        </div>

        {/* If already logged in */}
        {isAdminLoggedIn ? (
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-sm space-y-5 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Active Admin Session Detected</h2>
              <p className="text-xs text-slate-300 mt-1">
                You are currently signed in as:
              </p>
              <div className="mt-2 bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 max-w-xs mx-auto">
                <p className="text-sm font-bold text-white">{currentAdmin?.name || "Shop Owner"}</p>
                <p className="text-xs font-mono text-emerald-400">{currentAdmin?.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                to="/admin"
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl transition text-sm shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Admin Analytics</span>
              </Link>
              <button
                type="button"
                onClick={adminLogout}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-2.5 px-4 rounded-xl transition text-xs border border-slate-700 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign Out of Admin Session</span>
              </button>
            </div>
          </div>
        ) : (
          /* Card Container with Mode Switcher */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-5">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
              <button
                type="button"
                id="admin-tab-login"
                onClick={() => handleSwitchMode("login")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  mode === "login"
                    ? "bg-slate-800 text-white shadow-md border border-slate-700/60"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                id="admin-tab-register"
                onClick={() => handleSwitchMode("register")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  mode === "register"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                    : "text-slate-400 hover:text-emerald-400"
                }`}
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Account</span>
              </button>
            </div>

            {/* If no accounts exist yet and user is on Login tab, show a helpful hint */}
            {mode === "login" && registeredAccountsCount === 0 && (
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-3.5 text-xs text-slate-300 space-y-2 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-white">First Time Setup</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      No shop owner account is registered in this browser yet. Click below to create your restaurant administrator account.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("register")}
                  className="w-full py-1.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Switch to Create Shop Owner Account</span>
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-950/70 border border-rose-800/70 rounded-xl text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            {/* ===================== MODE: LOGIN ===================== */}
            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Shop Owner Work Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="admin-login-email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="owner@restaurant.com"
                      autoComplete="email"
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 text-slate-100 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Master Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="admin-login-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 text-slate-100 text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl outline-none transition placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="admin-login-submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3 px-4 rounded-xl transition text-sm shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Admin Portal</span>
                    </>
                  )}
                </button>

                {/* Toggle to Register */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400">
                    Don't have a shop owner account yet?{" "}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode("register")}
                      className="font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                    >
                      Create Shop Owner Account
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* ===================== MODE: REGISTER ===================== */
              <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Full Name / Shop Owner Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="admin-register-name"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="Chef Rajesh Sharma"
                      autoComplete="name"
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 text-slate-100 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Shop Owner Work Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="admin-register-email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="owner@restaurant.com"
                      autoComplete="email"
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 text-slate-100 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Create Master Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="admin-register-password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="At least 4 characters"
                      autoComplete="new-password"
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 text-slate-100 text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl outline-none transition placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Confirm Master Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="admin-register-confirm-password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 text-slate-100 text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl outline-none transition placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Role indication */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    New account will be created with <code className="text-emerald-400 font-mono">role: 'admin'</code> stored in <code className="text-emerald-400 font-mono">admin_accounts</code>.
                  </span>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  id="admin-register-submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 px-4 rounded-xl transition text-sm shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 stroke-[2.5]" />
                      <span>Create Shop Owner Account</span>
                    </>
                  )}
                </button>

                {/* Toggle to Login */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400">
                    Already registered as a shop owner?{" "}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode("login")}
                      className="font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                    >
                      Sign In here
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer info note */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>Strictly isolated from consumer customer accounts.</p>
          <p className="text-slate-600">
            Records persisted in browser localStorage under <code className="text-slate-500 font-mono">admin_accounts</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
