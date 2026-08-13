const Card = ({ title, subtitle, action, className = "", children, icon }) => {
  return (
    <section className={`erp-card p-5 lg:p-6 ${className}`}>
      {(title || action || subtitle || icon) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {icon && <span className="text-xl mb-1 block">{icon}</span>}
            {title ? <h3 className="text-lg lg:text-xl font-semibold text-text-primary">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-text-secondary">{subtitle}</p> : null}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
};

export default Card;