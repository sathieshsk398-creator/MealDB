import { AdminProvider } from "../contexts/AdminContext";
import { Link } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import MetricsCards from "../components/admin/MetricsCards";
import RevenueChart from "../components/admin/RevenueChart";
import TopSellingItemsChart from "../components/admin/TopSellingItemsChart";
import RecentOrdersTable from "../components/admin/RecentOrdersTable";
import AdminMenuList from "../components/admin/AdminMenuList";
import { Activity, ShieldCheck, Plus } from "lucide-react";

const AdminDashboardInner = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Sticky Top Admin Header */}
      <AdminHeader />

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Welcome & Context Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                Live Telemetry
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {currentDate}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
              Admin Analytics & Menu Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Storewide financial performance, top Indian meal distributions, and menu catalog management
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/add-dish"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Dish</span>
            </Link>
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hidden md:flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Admin</span>
            </div>
          </div>
        </div>

        {/* 1. Summary Metrics Cards (Total Revenue, Total Orders, Active Users) */}
        <section aria-label="Key Performance Indicators">
          <MetricsCards />
        </section>

        {/* 2. Menu Management Section: Admin Custom Dishes (Add / Edit / Delete) */}
        <section aria-label="Menu Catalog Management">
          <AdminMenuList />
        </section>

        {/* 3. Charts Section: Daily Revenue Trend & Top Indian Meals */}
        <section aria-label="Visual Data Analytics" className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Revenue Chart (7-day simulated daily revenue) */}
          <div className="lg:col-span-7">
            <RevenueChart />
          </div>

          {/* Top Selling Indian Cuisines / Meals */}
          <div className="lg:col-span-5">
            <TopSellingItemsChart />
          </div>
        </section>

        {/* 4. Recent Transactions Table (10 Most Recent) */}
        <section aria-label="Recent Transactions">
          <RecentOrdersTable />
        </section>
      </main>

      {/* Admin Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 justify-center">
            <span>MealDB Operator System</span>
            <span>•</span>
            <span className="text-slate-400">Pure React Context & LocalStorage Architecture</span>
          </p>
          <p className="text-[11px] text-slate-500">
            Powered by Recharts Data Visualization Engine
          </p>
        </div>
      </footer>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <AdminProvider>
      <AdminDashboardInner />
    </AdminProvider>
  );
};

export default AdminDashboard;
