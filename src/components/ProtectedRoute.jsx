import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * ProtectedRoute component:
 * Prevents unauthenticated users from accessing protected pages like
 * Cart, Checkout, Order Tracking, or Profile.
 * Displays a clean loading spinner while Firebase verifies the session.
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <LoadingSpinner />
        <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
          Verifying authentication session...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname + location.search,
          message: "Please sign in to access this page.",
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
