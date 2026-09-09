import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * AdminRoute Guard
 * Protects the /admin dashboard by ensuring the Shop Owner is authenticated
 * and has role === 'admin'.
 * Displays a clean loading state while Firebase verifies credentials.
 */
const AdminRoute = ({ children }) => {
  const { isAdminLoggedIn, adminLoading } = useAdminAuth();
  const location = useLocation();

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
        <LoadingSpinner />
        <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">
          Verifying shop owner credentials...
        </p>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
