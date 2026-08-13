import { Outlet } from "react-router-dom";
import useCompany from "../hooks/useCompany";

const AuthLayout = () => {
  const { name, logoUrl } = useCompany() || {};

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 lg:p-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #EAF3FF 100%)" }}>
        {/* Decorative elements */}
        <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #2F66B3, transparent)" }} />
        <div className="absolute bottom-[-40px] right-[-40px] w-60 h-60 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #FFB800, transparent)" }} />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #2F66B3, transparent)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="w-11 h-11 rounded-xl object-cover" />
          ) : (
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xl font-bold" style={{ background: "linear-gradient(135deg, #2F66B3, #24518F)" }}>
              ⚡
            </div>
          )}
          <span className="text-text-primary font-bold text-2xl tracking-tight">{name}</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
            Manage your{" "}
            <span style={{ background: "linear-gradient(90deg, #2F66B3, #24518F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              business smarter
            </span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-lg">
            Complete ERP solution for hardware & plywood businesses. Manage inventory, billing, GST compliance, and reports — all in one professional platform.
          </p>
          
          {/* Feature chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: "📦", label: "Inventory Management" },
              { icon: "💰", label: "Billing & GST" },
              { icon: "📊", label: "Real-time Reports" },
              { icon: "👥", label: "Multi-user Access" }
            ].map(f => (
              <span key={f.label} className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary bg-surface border border-border hover:border-primary/50 hover:text-primary transition-colors flex items-center gap-2">
                <span>{f.icon}</span>
                {f.label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 border-l-4 pl-4" style={{ borderColor: "#2F66B3" }}>
          <p className="text-text-muted text-sm italic">"Streamline operations and grow with confidence."</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12" style={{ background: "var(--color-background)" }}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg font-bold" style={{ background: "linear-gradient(135deg, #2F66B3, #24518F)" }}>⚡</div>
            )}
            <span className="text-text-primary font-bold text-xl">{name}</span>
          </div>

          {/* Login Card */}
          <div className="erp-card p-6 lg:p-8 shadow-card">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;