import { useEffect, useRef, useState } from "react";

const SearchSelect = ({
  label, id, value, onChange, options = [],
  getLabel = (o) => o.label, getValue = (o) => o._id, getSubLabel,
  placeholder = "Search...", required, className = ""
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  const selected = options.find((o) => getValue(o) === value);

  useEffect(() => {
    const onClickOutside = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = query.trim()
    ? options.filter((o) => getLabel(o).toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={boxRef}>
      {label ? (
        <label htmlFor={id} className="erp-label">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      ) : null}
      <input
        id={id}
        className="erp-input"
        placeholder={placeholder}
        value={open ? query : (selected ? getLabel(selected) : "")}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        autoComplete="off"
      />
      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto erp-card py-1">
          {filtered.length === 0 && <div className="px-3 py-2 text-sm text-text-muted">No matches</div>}
          {filtered.map((o) => (
            <button
              type="button"
              key={getValue(o)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-hover-bg"
              onClick={() => { onChange(getValue(o), o); setQuery(""); setOpen(false); }}
            >
              <div>{getLabel(o)}</div>
              {getSubLabel && <div className="text-xs text-text-muted">{getSubLabel(o)}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
