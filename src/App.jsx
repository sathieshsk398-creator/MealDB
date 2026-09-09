import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
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
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminAddDish from "./pages/AdminAddDish";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { AddressProvider } from "./contexts/AddressContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className={isAdminPath ? "min-h-screen bg-slate-950 flex flex-col" : "min-h-screen bg-gray-50/50 flex flex-col"}>
      {!isAdminPath && <Header />}
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

          {/* Admin Login Route (Shop Owner dedicated authentication) */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Analytics Dashboard Route (Strictly Protected by AdminRoute) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Admin Menu Management: Add & Edit Dish (Strictly Protected by AdminRoute) */}
          <Route
            path="/admin/add-dish"
            element={
              <AdminRoute>
                <AdminAddDish />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/edit-dish/:id"
            element={
              <AdminRoute>
                <AdminAddDish />
              </AdminRoute>
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
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <CurrencyProvider>
            <AddressProvider>
              <FavoritesProvider>
                <CartProvider>
                  <AppContent />
                </CartProvider>
              </FavoritesProvider>
            </AddressProvider>
          </CurrencyProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App; 