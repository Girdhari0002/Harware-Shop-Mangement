const Select = ({ label, id, options = [], error, className = "", ...props }) => {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      {label ? <span className="erp-label">{label}</span> : null}
      <select
        id={id}
        className={`erp-input ${error ? "error" : ""} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="erp-error-text">{error}</p> : null}
    </label>
  );
};

export default Select;