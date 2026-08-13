import { forwardRef } from "react";

const Input = forwardRef(({ label, id, error, className = "", ...props }, ref) => {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      {label ? <span className="erp-label">{label}</span> : null}
      <input
        ref={ref}
        id={id}
        className={`erp-input ${error ? "error" : ""} ${className}`}
        {...props}
      />
      {error ? <p className="erp-error-text">{error}</p> : null}
    </label>
  );
});

export default Input;