import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCompany from "../../hooks/useCompany";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { isAuthenticated } = useAuth();
  const { name, logoUrl } = useCompany() || {};
  const location = useLocation();
  const navigate = useNavigate();
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      const sections = ["home", "features", "verify-invoice", "how-it-works", "benefits", "cta", "contact"];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleLogin = (role) => {
    navigate("/login");
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "Invoice Verification", href: "#verify-invoice" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Benefits", href: "#benefits" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-border ${
        isScrolled ? "shadow-card" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-text-primary hover:opacity-80 transition-opacity">
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, #2F66B3, #24518F)" }}>
                ⚡
              </div>
            )}
            <div className="hidden sm:block">
              <span className="text-xl font-bold">{name}</span>
              <span className="block text-xs text-text-secondary">Smart Business Management</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href.replace("#", ""))}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-text-secondary hover:text-primary hover:bg-hover-bg"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Side - Login Buttons */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <button
              onClick={() => handleLogin("staff")}
              className="erp-btn erp-btn-secondary text-sm"
            >
              Staff Login
            </button>
            <button
              onClick={() => handleLogin("admin")}
              className="erp-btn erp-btn-primary text-sm"
            >
              Admin Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-hover-bg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href.replace("#", ""))}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary-light"
                        : "text-text-secondary hover:text-primary hover:bg-hover-bg"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <button onClick={() => handleLogin("staff")} className="erp-btn erp-btn-secondary w-full justify-center">
                  Staff Login
                </button>
                <button onClick={() => handleLogin("admin")} className="erp-btn erp-btn-primary w-full justify-center">
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;