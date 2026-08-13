import { Link } from "react-router-dom";
import useCompany from "../../hooks/useCompany";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { name, logoUrl } = useCompany() || {};

  const footerLinks = {
    quickLinks: [
      { label: "Home", href: "#home" },
      { label: "Features", href: "#features" },
      { label: "Invoice Verification", href: "#verify-invoice" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
    management: [
      { label: "Admin Login", href: "/login" },
      { label: "Staff Login", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    support: [
      { label: "Help", href: "#help" },
      { label: "Contact Support", href: "#contact-support" },
      { label: "Invoice Verification", href: "#verify-invoice" },
    ],
  };

  return (
    <footer id="contact" className="bg-text-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt={name} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, #2F66B3, #24518F)" }}>
                  ⚡
                </div>
              )}
              <span className="text-xl font-bold">{name}</span>
            </Link>
            <p className="text-text-muted text-sm mb-6 max-w-xs">
              Smart and reliable business management for hardware stores.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-text-muted hover:text-accent transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Management */}
          <div>
            <h4 className="font-semibold mb-4">Management</h4>
            <ul className="space-y-3">
              {footerLinks.management.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-text-muted hover:text-accent transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-text-muted hover:text-accent transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm">
              © {currentYear} {name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;