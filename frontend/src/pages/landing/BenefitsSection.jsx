const benefits = [
  {
    title: "Faster billing",
    description: "Create professional invoices in seconds with pre-filled data, GST calculations, and multiple payment options.",
  },
  {
    title: "Better inventory control",
    description: "Real-time stock tracking, low-stock alerts, multi-unit support, and category/brand organization.",
  },
  {
    title: "Accurate business records",
    description: "Maintain complete audit trails for all transactions with automatic timestamps and user tracking.",
  },
  {
    title: "Easy GST reporting",
    description: "Generate GSTR-1, GSTR-3B ready reports with HSN codes, tax breakdowns, and compliance checks.",
  },
  {
    title: "Secure staff access",
    description: "Role-based permissions, audit logging, and secure authentication keep your data protected.",
  },
  {
    title: "Real-time business insights",
    description: "Dashboard with live metrics, trend charts, and key performance indicators at your fingertips.",
  },
  {
    title: "Easy invoice verification",
    description: "Customers verify invoices instantly via invoice number or QR code - builds trust and reduces disputes.",
  },
  {
    title: "Centralized business management",
    description: "One platform for sales, purchases, inventory, payments, expenses, reports, and staff management.",
  },
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-primary-light border border-primary/30">
            <span className="text-primary text-xs font-semibold">🎯 Built for You</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Built for Modern Hardware Businesses</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Every feature designed to solve real problems faced by hardware and plywood store owners.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="erp-card-hover erp-card p-6 group animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 bg-success-light text-success">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">{benefit.title}</h3>
                  <p className="text-sm text-text-secondary">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
          {[
            { value: "500+", label: "Active Businesses" },
            { value: "10K+", label: "Invoices Daily" },
            { value: "99.9%", label: "Uptime Guarantee" },
            { value: "24/7", label: "Support Available" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center p-6 erp-card">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-text-secondary text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;