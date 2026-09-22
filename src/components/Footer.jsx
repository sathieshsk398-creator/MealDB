import { Link } from "react-router-dom";
import { UtensilsCrossed, Heart, ShieldCheck, Clock, Award, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-20 border-t border-slate-900">
      {/* Top Value Propositions */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Lightning Fast Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Average delivery in 25–35 mins, piping hot.</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Authentic Recipes</h4>
              <p className="text-xs text-slate-400 mt-0.5">Traditional South Indian & regional chefs.</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Hygienic Packaging</h4>
              <p className="text-xs text-slate-400 mt-0.5">Contactless delivery & food-grade containers.</p>
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
                  Food Delivery
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bringing authentic Chettinad biryanis, crispy dosas, and flavorful regional feasts straight to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick Links</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Explore Menu
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-emerald-400 transition-colors">
                  Your Favorites
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-emerald-400 transition-colors">
                  Cart & Checkout
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="hover:text-emerald-400 transition-colors">
                  Live Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cuisines */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400">Popular Cuisines</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/Tamil Nadu Tiffin" className="hover:text-emerald-400 transition-colors">
                  Tamil Nadu Tiffin
                </Link>
              </li>
              <li>
                <Link to="/category/Biryani Specials" className="hover:text-emerald-400 transition-colors">
                  Biryani Specials
                </Link>
              </li>
              <li>
                <Link to="/category/South Indian Veg" className="hover:text-emerald-400 transition-colors">
                  South Indian Veg
                </Link>
              </li>
              <li>
                <Link to="/category/Seafood & Non-Veg" className="hover:text-emerald-400 transition-colors">
                  Seafood & Non-Veg
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Service */}
          <div className="space-y-3 text-xs">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400">Customer Support</h5>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Chennai, Madurai, Coimbatore & Tiruchirappalli</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+91 98765 43210 (24/7 Helpline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>support@dishly.delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Dishly Food Delivery. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for authentic South Indian food lovers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
