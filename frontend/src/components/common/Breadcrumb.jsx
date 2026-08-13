const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="mb-4 text-xs text-text-muted" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            {index > 0 ? <span className="text-text-muted">/</span> : null}
            <span className={index === items.length - 1 ? "font-medium text-text-primary" : "text-text-secondary"}>{item.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;