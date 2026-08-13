import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section id="cta" className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2F66B3 0%, #24518F 100%)" }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: "#FFB800" }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "#FFFFFF" }} />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/20 border border-white/30">
            <span className="text-white text-xs font-semibold">🚀 Ready to Start?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Manage Your Business{" "}
            <span className="relative" style={{ background: "linear-gradient(90deg, #FFB800, #FFF4CC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Smarter
            </span>
            ?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
            Take control of your sales, inventory, purchases and business reports with Hardware ERP. Join hundreds of businesses already growing with us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="erp-btn px-8 py-3 text-base w-full sm:w-auto bg-white text-primary hover:bg-white/90 transition-colors" style={{ borderRadius: "8px" }}>
              Admin Login
            </Link>
            <Link to="/login" className="erp-btn px-8 py-3 text-base w-full sm:w-auto bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-colors" style={{ borderRadius: "8px" }}>
              Staff Login
            </Link>
            <button className="erp-btn px-8 py-3 text-base w-full sm:w-auto bg-accent text-text-primary hover:bg-[#E6A600] transition-colors" style={{ borderRadius: "8px" }}>
              Verify Invoice
            </button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/70 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm">Secure & encrypted</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;