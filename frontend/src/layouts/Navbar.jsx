import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "../components/common/Button";

const Navbar = ({ title, onMenuClick }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    const dark = savedMode === "dark";
    setIsDarkMode(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const handleToggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleLogout = () => {
    if (logout) return logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-14 lg:h-16 border-b border-border bg-surface px-3 sm:px-4 lg:px-6 flex-shrink-0 sticky top-0 z-20 ml-0 lg:ml-[var(--sidebar-width,256px)]">
      <div className="mx-auto flex max-w-[1440px] h-full items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden flex-shrink-0 p-2 -ml-2 rounded-lg text-text-secondary hover:bg-hover-bg hover:text-text-primary transition-colors"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          <div className="hidden sm:block w-px h-6 bg-border" />
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-text-primary truncate">{title}</h1>
            <p className="text-xs text-text-muted hidden md:block">Hardware & Plywood ERP</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden lg:block">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search products, customers..."
              className="h-9 w-64 pl-10 pr-4 text-sm text-text-primary bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors placeholder:text-text-muted"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-text-secondary hover:bg-hover-bg hover:text-text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-text-primary">3</span>
          </button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={handleToggleTheme} className="hidden sm:flex">
            {isDarkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </Button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-hover-bg transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #2F66B3, #24518F)" }}>
                {(user?.fullName || "A")[0]?.toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-text-primary">{user?.fullName || "Admin"}</div>
                <div className="text-xs text-text-muted capitalize">{user?.role || "admin"}</div>
              </div>
              <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="fixed right-4 top-16 z-50 w-48 erp-card shadow-[0_10px_40px_rgba(23,32,51,0.15)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-border">
                  <div className="text-sm font-medium text-text-primary">{user?.fullName || "Admin"}</div>
                  <div className="text-xs text-text-muted capitalize">{user?.role || "admin"}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-hover-bg hover:text-text-primary transition-colors flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;