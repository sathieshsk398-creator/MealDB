import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UtensilsCrossed,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTarget = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password);
      setLoading(false);
      if (res.success) {
        setSuccessNotice(true);
        setTimeout(() => {
          if (res.role === "admin" || res.user?.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate(redirectTarget, { replace: true });
          }
        }, 500);
      } else {
        setError(res.error || "Failed to register account.");
      }
    } catch {
      setLoading(false);
      setError("An unexpected error occurred during registration. Please try again.");
    }
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
          Create an account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Your orders, favorites, and cart are synced securely in Cloud Firestore
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-gray-100/70 border border-gray-100 rounded-3xl">
          {successNotice && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-emerald-800 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>Account created successfully! Taking you in...</div>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-700 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition text-gray-900"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition text-gray-900"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Data isolation key: cart_{email ? email.toLowerCase() : "your_email@..."}
              </p>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="reg-password"
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
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="reg-confirm-password"
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition text-gray-900"
                />
              </div>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-70 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>{loading ? "Creating Account..." : "Create Free Account"}</span>
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              state={{ from: redirectTarget }}
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Sign In</span>
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

export default Register;
