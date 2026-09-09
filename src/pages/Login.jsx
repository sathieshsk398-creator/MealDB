import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UtensilsCrossed,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTarget = location.state?.from || "/";
  const redirectMessage = location.state?.message || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        // Route user or shop owner based on role
        if (res.role === "admin" || res.user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate(redirectTarget, { replace: true });
        }
      } else {
        setError(res.error || "Invalid email or password.");
      }
    } catch {
      setLoading(false);
      setError("An unexpected error occurred during login. Please try again.");
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-10 h-10 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-md transition-colors">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-gray-900">
            Meal<span className="text-emerald-600">DB</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to access your isolated cart, orders, and favorites
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-gray-100/70 border border-gray-100 rounded-3xl">
          {redirectMessage && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-800 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="font-medium">{redirectMessage}</div>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-700 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition text-gray-900"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Password
                </label>
                <span className="text-[11px] text-gray-400">Min 6 characters</span>
              </div>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-10 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-70 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <LogIn className="w-4 h-4 stroke-[2.5]" />
              <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
            </button>
          </form>

          {/* Quick Demo Pre-Fill Helper */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Demo Credentials:</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo("alex@example.com", "password123")}
                className="text-left p-2.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-emerald-50 hover:border-emerald-200 transition cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-gray-800 group-hover:text-emerald-800">
                  Alex Morgan
                </div>
                <div className="text-[10px] text-gray-500 truncate">Customer (User)</div>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("sarah@foodie.com", "password123")}
                className="text-left p-2.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-emerald-50 hover:border-emerald-200 transition cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-gray-800 group-hover:text-emerald-800">
                  Sarah Jenkins
                </div>
                <div className="text-[10px] text-gray-500 truncate">Customer (User)</div>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("admin@mealdb.com", "password123")}
                className="text-left p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 hover:border-amber-300 transition cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-amber-900 group-hover:text-amber-950">
                  Platform Admin
                </div>
                <div className="text-[10px] text-amber-700 truncate">Shop Owner (Admin)</div>
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="mt-6 text-center text-xs text-gray-600">
            Don&apos;t have an account yet?{" "}
            <Link
              to="/register"
              state={{ from: redirectTarget }}
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Local Storage Partitioning • Isolated Cart, Favorites & Orders</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
