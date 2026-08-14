import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const pageTitle = (pathname) => {
  const map = {
    "/dashboard": "Dashboard",
    "/products": "Products",
    "/categories": "Categories",
    "/brands": "Brands",
    "/suppliers": "Suppliers",
    "/customers": "Customers",
    "/purchases": "Purchases",
    "/sales": "Sales",
    "/expenses": "Expenses",
    "/payments": "Payments",
    "/reports/sales": "Sales Report",
    "/reports/gst": "GST Report",
    "/reports/stock": "Stock Report",
    "/reports/profit": "Profit Report",
    "/notifications": "Notifications",
    "/settings/company-profile": "Company Profile",
    "/settings/users": "User Management",
    "/settings/roles-permissions": "Roles & Permissions",
  };
  return map[pathname] || "ERP";
};

const MainLayout = () => {
  const location = useLocation();
  const title = pageTitle(location.pathname);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Initialize sidebar width CSS variable on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    const isCollapsed = saved === "true";
    document.documentElement.style.setProperty("--sidebar-width", isCollapsed ? "64px" : "256px");
  }, []);

  // Close the mobile drawer automatically if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handleChange = (e) => { if (e.matches) setMobileNavOpen(false); };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full min-w-0 ml-0 lg:ml-[var(--sidebar-width,256px)]">
        {/* Topbar */}
        <Navbar title={title} onMenuClick={() => setMobileNavOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;