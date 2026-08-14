import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 bg-background overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: "#2F66B3" }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "#FFB800" }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl" style={{ background: "#2F66B3" }} />
      </div>

      <div className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-in fade-in-0 slide-in-from-left-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-primary-light border border-primary/30 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-100">
              <span className="text-primary text-xs font-semibold">🚀 New Release v2.0</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
              Manage Your Hardware Business{" "}
              <span className="relative" style={{ background: "linear-gradient(90deg, #2F66B3, #24518F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Smarter
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto lg:mx-0 mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
              Hardware ERP helps you manage sales, purchases, inventory, payments, expenses, GST reports and business operations from one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400">
              <Link to="/login" className="erp-btn erp-btn-primary px-8 py-3 text-base w-full sm:w-auto">
                Admin Login
              </Link>
              <Link to="/login" className="erp-btn erp-btn-secondary px-8 py-3 text-base w-full sm:w-auto">
                Staff Login
              </Link>
              <button 
                onClick={() => document.getElementById('verify-invoice')?.scrollIntoView({ behavior: 'smooth' })}
                className="erp-btn erp-btn-accent px-8 py-3 text-base w-full sm:w-auto"
              >
                Verify Invoice
              </button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-text-secondary animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Right - Dashboard Visual */}
          <div className="relative animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-300">
            <div className="relative">
              {/* Floating cards — hidden below md so they can't push the mockup wider than the viewport */}
              <div className="hidden md:block absolute -top-4 -right-4 w-40 lg:w-48 h-28 lg:h-32 erp-card bg-primary-light border-primary/30 animate-float delay-100">
                <div className="p-3">
                  <div className="text-xs text-text-secondary mb-1">Total Sales</div>
                  <div className="text-2xl font-bold text-primary">₹2,45,000</div>
                </div>
              </div>
              <div className="hidden md:block absolute top-20 -left-6 w-40 lg:w-48 h-28 lg:h-32 erp-card bg-success-light border-success/30 animate-float delay-200">
                <div className="p-3">
                  <div className="text-xs text-text-secondary mb-1">Profit</div>
                  <div className="text-2xl font-bold text-success">₹89,500</div>
                </div>
              </div>
              <div className="hidden md:block absolute bottom-10 right-10 w-40 lg:w-48 h-28 lg:h-32 erp-card bg-warning-light border-warning/30 animate-float delay-300">
                <div className="p-3">
                  <div className="text-xs text-text-secondary mb-1">Low Stock</div>
                  <div className="text-2xl font-bold text-warning">3 Items</div>
                </div>
              </div>

              {/* Main Dashboard Mockup */}
              <div className="relative erp-card shadow-xl border-border bg-surface overflow-hidden" style={{ borderRadius: "16px" }}>
                <div className="flex items-center gap-2 px-4 py-3 bg-background border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">Dashboard Overview</h3>
                      <p className="text-sm text-text-secondary">Real-time business insights</p>
                    </div>
                    <div className="erp-badge erp-badge-success">Live</div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="erp-card p-4 bg-primary-light border-primary/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-text-secondary">Today's Sales</p>
                          <p className="text-2xl font-bold text-primary">₹45,200</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/20">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="erp-card p-4 bg-success-light border-success/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-text-secondary">Today's Profit</p>
                          <p className="text-2xl font-bold text-success">₹12,800</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-success/20">
                          <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="erp-card p-4 bg-warning-light border-warning/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-text-secondary">Pending Payments</p>
                          <p className="text-2xl font-bold text-warning">₹34,500</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-warning/20">
                          <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="erp-card p-4 bg-info-light border-info/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-text-secondary">Stock Alerts</p>
                          <p className="text-2xl font-bold text-info">3 Items</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-info/20">
                          <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart placeholder */}
                  <div className="erp-card p-4 bg-background border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-text-primary">Sales Trend (Last 7 Days)</h4>
                      <select className="text-sm text-text-secondary bg-surface border border-border px-3 py-1 rounded-lg">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                      </select>
                    </div>
                    <div className="h-32 flex items-end justify-around gap-2">
                      {[45, 62, 38, 78, 55, 85, 70].map((height, i) => (
                        <div key={i} className="flex-1 max-w-12 rounded-t-lg bg-gradient-to-t from-primary to-primary/60 transition-all duration-300 hover:from-primary hover:to-primary" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                    <div className="flex justify-around mt-4 text-xs text-text-secondary">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                        <div key={i} className="w-12 text-center">{day}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;