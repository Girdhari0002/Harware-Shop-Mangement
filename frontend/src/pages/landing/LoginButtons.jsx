import { Link } from "react-router-dom";

const LoginButtons = () => {
  return (
    <section id="login-options" className="py-16 bg-background border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-primary-light border border-primary/30">
            <span className="text-primary text-xs font-semibold">🔐 Secure Access</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Choose Your Access</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Separate, secure portals for Admin and Staff with role-based permissions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Login Card */}
          <Link to="/login" className="erp-card-hover erp-card p-8 text-center group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: "linear-gradient(135deg, #2F66B3, #24518F)" }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Admin Login</h3>
              <p className="text-text-secondary mb-6">Full access to manage users, settings, roles & permissions, and all business operations.</p>
              <div className="space-y-3 text-sm text-text-secondary border-t border-border pt-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  User Management
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Roles & Permissions
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Company Settings
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All Reports Access
                </div>
              </div>
              <span className="inline-block erp-btn erp-btn-primary group-hover:bg-primary-dark transition-colors">
                Access Admin Portal →
              </span>
            </div>
          </Link>

          {/* Staff Login Card */}
          <Link to="/login" className="erp-card-hover erp-card p-8 text-center group border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 bg-primary-light">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Staff Login</h3>
              <p className="text-text-secondary mb-6">Secure access for daily operations - sales, purchases, inventory, and basic reports.</p>
              <div className="space-y-3 text-sm text-text-secondary border-t border-border pt-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Sales
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  View Products
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Manage Customers
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic Reports
                </div>
              </div>
              <span className="inline-block erp-btn erp-btn-secondary group-hover:bg-primary-light transition-colors">
                Access Staff Portal →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginButtons;