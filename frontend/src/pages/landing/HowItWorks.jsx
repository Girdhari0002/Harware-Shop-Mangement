const steps = [
  {
    number: "01",
    title: "Login",
    description: "Admin or Staff securely logs into the system.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Manage Your Business",
    description: "Manage sales, purchases, inventory, payments and expenses.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Track & Analyze",
    description: "View reports, profits, stock and GST information.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Verify Invoices",
    description: "Customers can verify invoices instantly.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-primary-light border border-primary/30">
            <span className="text-primary text-xs font-semibold">🚀 Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">How It Works</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Get started in minutes with our simple 4-step process.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ${
                  index % 2 === 0 ? "lg:pl-1/2 lg:pr-12 lg:text-right" : "lg:pr-1/2 lg:pl-12 lg:text-left"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Timeline dot */}
                <div className="hidden lg:block absolute top-4 left-1/2 w-4 h-4 rounded-full border-4 border-white z-10 -translate-x-1/2" style={{ background: "#2F66B3" }} />

                {/* Step number */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 text-primary font-bold text-lg" style={{ background: "#EAF3FF" }}>
                  {step.number}
                </div>

                {/* Content */}
                <div className="erp-card p-6 max-w-md lg:max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-light text-primary">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">{step.title}</h3>
                  </div>
                  <p className="text-text-secondary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;