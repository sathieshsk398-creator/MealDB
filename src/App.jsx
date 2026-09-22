import { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";
import CategoryMeals from "./pages/CategoryMeals";
import MealDetails from "./pages/MealDetails";
import Favorite from "./pages/Favorite";
import SearchResults from "./pages/SearchResults";
import CartPage from "./pages/CartPage";
import OrderTracking from "./pages/OrderTracking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { AddressProvider } from "./contexts/AddressContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";

const AppContent = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Public Browsing Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<CategoryMeals />} />
          <Route path="/meal/:id" element={<MealDetails />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirect removed admin routes */}
          <Route path="/admin-login" element={<Navigate to="/login" replace />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/" replace />} />

          {/* Protected Routes (Require Authentication) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-tracking"
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-tracking/:orderId"
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="max-w-md mx-auto my-24 text-center px-4">
                <h1 className="text-6xl font-black text-emerald-800 mb-4">404</h1>
                <p className="text-gray-600 mb-6">Oops! The page you requested could not be found.</p>
                <a
                  href="/"
                  className="inline-block bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition"
                >
                  Back to Home
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
  // Always show the splash screen for 10 seconds on page load/refresh
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} duration={10000} />
      )}
      <BrowserRouter>
        <AuthProvider>
          <CurrencyProvider>
            <AddressProvider>
              <FavoritesProvider>
                <CartProvider>
                  <AppContent />
                </CartProvider>
              </FavoritesProvider>
            </AddressProvider>
          </CurrencyProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App; 