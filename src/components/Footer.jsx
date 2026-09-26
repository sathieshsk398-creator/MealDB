import { Link } from "react-router-dom";
import { UtensilsCrossed, Heart, BookOpen, Globe, ChefHat } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-20 border-t border-slate-900">
      {/* Top Value Propositions */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Chef-Tested Recipes</h4>
              <p className="text-xs text-slate-400 mt-0.5">Exact ingredient measures and cooking steps.</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Regional & Global Cuisines</h4>
              <p className="text-xs text-slate-400 mt-0.5">Explore by country or traditional heritage.</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Video Cooking Guides</h4>
              <p className="text-xs text-slate-400 mt-0.5">Step-by-step video tutorials for each dish.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30">
                <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white block leading-none">
                  Dish<span className="text-emerald-400">ly</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mt-0.5">
                  Meal Explorer
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discover authentic recipes, exact ingredient measurements, and cooking tutorials from Tamil Nadu, India, and around the globe.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400">Explore</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/categories" className="hover:text-emerald-400 transition-colors">
                  All Recipe Categories
                </Link>
              </li>
              <li>
                <Link to="/cuisines" className="hover:text-emerald-400 transition-colors">
                  Cuisines & World Areas
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-emerald-400 transition-colors">
                  My Saved Recipes
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-emerald-400 transition-colors">
                  Search Recipes
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cuisines & Areas */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400">Popular Cuisines</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/cuisine/Tamil Nadu" className="hover:text-emerald-400 transition-colors">
                  Tamil Nadu Cuisine
                </Link>
              </li>
              <li>
                <Link to="/cuisine/North Indian" className="hover:text-emerald-400 transition-colors">
                  North Indian Specialties
                </Link>
              </li>
              <li>
                <Link to="/cuisine/Italian" className="hover:text-emerald-400 transition-colors">
                  Italian Recipes
                </Link>
              </li>
              <li>
                <Link to="/cuisine/Mexican" className="hover:text-emerald-400 transition-colors">
                  Mexican Cuisines
                </Link>
              </li>
            </ul>
          </div>

          {/* Recipe Categories */}
          <div className="space-y-3 text-xs">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400">Categories</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/Tamil Nadu Tiffin" className="hover:text-emerald-400 transition-colors">
                  Tamil Nadu Tiffin
                </Link>
              </li>
              <li>
                <Link to="/category/Biryani & Rice" className="hover:text-emerald-400 transition-colors">
                  Biryani & Rice Specials
                </Link>
              </li>
              <li>
                <Link to="/category/Tamil Curries & Gravies" className="hover:text-emerald-400 transition-colors">
                  Curries & Gravies
                </Link>
              </li>
              <li>
                <Link to="/category/Desserts & Sweets" className="hover:text-emerald-400 transition-colors">
                  Desserts & Traditional Sweets
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Dishly Meal Explorer & Recipe Guide. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for culinary creators & food lovers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
