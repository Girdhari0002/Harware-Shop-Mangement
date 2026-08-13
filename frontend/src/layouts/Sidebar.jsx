import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCompany from "../hooks/useCompany";
import { hasRole, filterNavSections, ROLES } from "../utils/roles";
import { useState, useEffect } from "react";

const navSections = [
  {
    title: "Overview",
    links: [
      { to: "/dashboard", label: "Dashboard", icon: "🏠" },
      { to: "/notifications", label: "Notifications", icon: "🔔" }
    ]
  },
  {
    title: "Inventory",
    links: [
      { to: "/products", label: "Products", icon: "📦" },
      { to: "/categories", label: "Categories", icon: "🗂️" },
      { to: "/brands", label: "Brands", icon: "🏷️" }
    ]
  },
  {
    title: "Parties",
    links: [
      { to: "/suppliers", label: "Suppliers", icon: "🚚" },
      { to: "/customers", label: "Customers", icon: "👤" }
    ]
  },
  {
    title: "Staff",
    links: [
      { to: "/attendance", label: "Attendance", icon: "🕘", roles: [ROLES.ADMIN] }
    ]
  },
  {
    title: "Transactions",
    links: [
      { to: "/purchases", label: "Purchases", icon: "🛒" },
      { to: "/sales", label: "Sales", icon: "💰" },
      { to: "/expenses", label: "Expenses", icon: "📤" },
      { to: "/payments", label: "Payments", icon: "💳" }
    ]
  },
  {
    title: "Reports",
    links: [
      { to: "/reports/sales", label: "Sales Report", icon: "📈" },
      { to: "/reports/gst", label: "GST Report", icon: "🧾" },
      { to: "/reports/stock", label: "Stock Report", icon: "📊" },
      { to: "/reports/profit", label: "Profit Report", icon: "💹" }
    ]
  },
  {
    title: "Settings",
    links: [
      { to: "/settings/company-profile", label: "Company Profile", icon: "🏢", roles: [ROLES.ADMIN] },
      { to: "/settings/users", label: "User Management", icon: "👥", roles: [ROLES.ADMIN] },
      { to: "/settings/roles-permissions", label: "Roles & Permissions", icon: "🔐", roles: [ROLES.ADMIN] }
    ]
  }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth() || {};
  const { name, logoUrl } = useCompany() || {};
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed");
      if (saved !== null) setIsCollapsed(saved === "true");
    }
  }, []);

  // Update CSS variable for main content margin
  useEffect(() => {
    const width = isCollapsed ? 64 : 256;
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
  }, [isCollapsed]);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("sidebarCollapsed", next.toString());
  };

  // Filter nav sections based on current user role using centralized helper
  const visibleSections = filterNavSections(navSections, user?.role);

  const handleLogout = () => {
    if (logout) return logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className={`fixed left-0 top-0 z-30 h-screen transition-all duration-300 border-r border-border bg-surface flex flex-col ${isCollapsed ? "w-16" : "w-64"}`}
      style={{ minWidth: isCollapsed ? "64px" : "256px", width: isCollapsed ? "64px" : "256px" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border flex-shrink-0">
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: "linear-gradient(135deg, #2F66B3, #24518F)" }}>
            ⚡
          </div>
        )}
        {!isCollapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-text-primary leading-tight truncate">{name}</div>
            <div className="text-xs font-medium text-text-muted">Admin Panel</div>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className={`ml-auto flex-shrink-0 p-1.5 rounded-lg text-text-muted hover:bg-hover-bg hover:text-text-primary transition-colors ${isCollapsed ? "rotate-180" : ""}`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4" style={{ minHeight: 0 }}>
        {visibleSections.map((section) => (
          <div key={section.title} className="mb-6">
            {!isCollapsed && (
              <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                {section.title}
              </div>
            )}
            {section.links.filter(item => !item.roles || (user?.role && item.roles.includes(user.role))).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive
                    ? "bg-primary-light text-primary border-l-2 border-primary"
                    : "text-text-secondary hover:bg-hover-bg hover:text-primary"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? item.label : undefined}
                aria-label={isCollapsed ? item.label : undefined}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* User Card */}
      <div className={`p-3 border-t border-border flex-shrink-0 ${isCollapsed ? "px-2" : "px-3"}`}>
        {!isCollapsed && (
          <div className="mb-3 p-2.5 rounded-lg bg-hover-bg flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg, #2F66B3, #24518F)" }}>
              {(user?.fullName || "A")[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="text-sm font-semibold text-text-primary truncate">{user?.fullName || "Admin"}</div>
              <div className="text-xs font-medium text-primary capitalize">{user?.role || "admin"}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-danger/20 bg-danger/5 text-danger hover:bg-danger/10 hover:border-danger/30 ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <span className="flex-shrink-0">🚪</span>
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;