import Button from "./Button";

const FormModal = ({ open, title, children, onClose, onSubmit, loading, size = "md" }) => {
  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 animate-in fade-in-0 duration-200"
    >
      <div className={`erp-card w-full ${sizeClasses[size]} shadow-[0_20px_60px_rgba(23,32,51,0.2)] animate-in zoom-in-95 fade-in-0 duration-200 flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5 flex-shrink-0">
          <span className="text-lg font-semibold text-text-primary">{title}</span>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>
        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-border flex-shrink-0">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={onSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;