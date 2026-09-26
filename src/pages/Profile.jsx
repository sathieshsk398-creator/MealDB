import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Calendar,
  LogOut,
  Heart,
  Globe,
  Check,
  Edit2,
  ArrowRight,
  ChefHat,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";

const Profile = () => {
  const { currentUser, logout, updateProfile } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || "");
  const [successMsg, setSuccessMsg] = useState("");

  if (!currentUser) return null;

  const handleUpdateName = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateProfile({ name: nameInput });
    setIsEditingName(false);
    setSuccessMsg("Profile name updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const joinDate = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shadow-emerald-700/20">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <form onSubmit={handleUpdateName} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="text-lg sm:text-xl font-extrabold text-slate-900 border border-emerald-500 rounded-lg px-2.5 py-1 outline-none bg-emerald-50/30"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition cursor-pointer"
                      title="Save name"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                      {currentUser.name}
                    </h1>
                    <button
                      onClick={() => {
                        setNameInput(currentUser.name);
                        setIsEditingName(true);
                      }}
                      className="p-1 text-slate-400 hover:text-emerald-700 transition cursor-pointer"
                      title="Edit name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentUser.email}</span>
              </p>

              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {joinDate}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100/80 border border-red-200 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {successMsg && (
          <div className="mt-4 p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
            {successMsg}
          </div>
        )}
      </div>

      {/* Culinary Profile Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Saved Recipes count */}
        <Link
          to="/favorites"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-rose-200 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Saved Cookbook
            </span>
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{favorites.length}</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">recipes saved</span>
          </div>
          <p className="text-xs text-rose-600 font-semibold mt-2.5 flex items-center gap-1">
            <span>View Favorites</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        {/* Cuisines Explorer Shortcut */}
        <Link
          to="/cuisines"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Cuisines
            </span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">25+</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">world & regional areas</span>
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-2.5 flex items-center gap-1">
            <span>Explore Areas</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        {/* Recipe Categories */}
        <Link
          to="/"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-amber-200 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Recipe Collections
            </span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">8</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">curated categories</span>
          </div>
          <p className="text-xs text-amber-700 font-semibold mt-2.5 flex items-center gap-1">
            <span>Browse Categories</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>
      </div>

      {/* Cooking Tips / Cookbook Notes Banner */}
      <div className="bg-emerald-50/70 rounded-3xl p-6 sm:p-7 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Personal Recipe Collection
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-lg leading-relaxed">
              Every dish you favorite while exploring is saved to your account. Access full ingredient measurements, step-by-step cooking instructions, and YouTube videos anytime.
            </p>
          </div>
        </div>

        <Link
          to="/favorites"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-md shadow-emerald-600/20 whitespace-nowrap"
        >
          <span>Open Cookbook</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default Profile;
