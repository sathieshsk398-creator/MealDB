import { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import CategoryMeals from "./pages/CategoryMeals";
import CuisineExplorer from "./pages/CuisineExplorer";
import MealDetails from "./pages/MealDetails";
import Favorite from "./pages/Favorite";
import SearchResults from "./pages/SearchResults";
import { FavoritesProvider } from "./contexts/FavoritesContext";

const AppContent = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-900">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Public Browsing Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category" element={<Navigate to="/categories" replace />} />
          <Route path="/category/:category" element={<CategoryMeals />} />
          <Route path="/cuisines" element={<CuisineExplorer />} />
          <Route path="/cuisine/:area" element={<CuisineExplorer />} />
          <Route path="/area/:area" element={<CuisineExplorer />} />
          <Route path="/meal/:id" element={<MealDetails />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Clean Redirects for removed login, auth, profile & legacy routes */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/profile" element={<Navigate to="/favorites" replace />} />
          <Route path="/cart" element={<Navigate to="/favorites" replace />} />
          <Route path="/order-tracking" element={<Navigate to="/" replace />} />
          <Route path="/order-tracking/*" element={<Navigate to="/" replace />} />
          <Route path="/order-history" element={<Navigate to="/favorites" replace />} />
          <Route path="/orders" element={<Navigate to="/favorites" replace />} />
          <Route path="/admin-login" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/" replace />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="max-w-md mx-auto my-24 text-center px-4">
                <h1 className="text-6xl font-black text-emerald-800 mb-4">404</h1>
                <p className="text-slate-600 mb-6">Oops! The recipe or page you requested could not be found.</p>
                <a
                  href="/"
                  className="inline-block bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition"
                >
                  Back to All Recipes
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} duration={2500} />
      )}
      <BrowserRouter>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
