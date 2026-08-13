const features = [
  {
    icon: "📦",
    title: "Inventory Management",
    description: "Track products, stock levels and low-stock alerts.",
  },
  {
    icon: "🛒",
    title: "Sales Management",
    description: "Create and manage sales invoices quickly.",
  },
  {
    icon: "🚚",
    title: "Purchase Management",
    description: "Track purchases and supplier transactions.",
  },
  {
    icon: "💰",
    title: "Payments",
    description: "Monitor payments and outstanding balances.",
  },
  {
    icon: "📊",
    title: "Business Reports",
    description: "Get clear sales, profit, stock and GST reports.",
  },
  {
    icon: "🧾",
    title: "GST Management",
    description: "Manage GST-related information and reports.",
  },
  {
    icon: "👥",
    title: "Staff Management",
    description: "Manage staff accounts and permissions.",
  },
  {
    icon: "🔐",
    title: "Role-Based Access",
    description: "Keep Admin and Staff access secure.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-primary-light border border-primary/30">
            <span className="text-primary text-xs font-semibold">✨ Everything You Need</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Everything You Need to Run Your Business</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Complete ERP solution designed specifically for hardware and plywood businesses.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="erp-card-hover erp-card p-6 group animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 bg-primary-light text-primary text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;