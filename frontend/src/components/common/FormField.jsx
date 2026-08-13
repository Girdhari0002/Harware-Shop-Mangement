const FormField = ({ label, id, type = "text", value, onChange, options, required, placeholder, min, rows = 3, error, className = "", children }) => {
  const inputClass = `erp-input ${error ? "error" : ""} ${className}`;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={id} className="erp-label">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      ) : null}
      {type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          required={required}
        >
          <option value="">— Select {label} —</option>
          {(options || []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${inputClass} resize-y`}
          required={required}
        />
      ) : children ? (
        children
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          min={min}
          className={inputClass}
        />
      )}
      {error ? <p className="erp-error-text">{error}</p> : null}
    </div>
  );
};

export default FormField;