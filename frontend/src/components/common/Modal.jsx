import Button from "./Button";

const Modal = ({ open, title, children, onClose, footer, size = "md" }) => {
  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 animate-in fade-in-0 duration-200" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`erp-card w-full ${sizeClasses[size]} shadow-[0_20px_60px_rgba(23,32,51,0.2)] animate-in zoom-in-95 fade-in-0 duration-200`}>
        <header className="mb-4 flex items-center justify-between border-b border-border p-5">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </header>
        <div className="p-5">{children}</div>
        {footer ? <footer className="mt-4 p-5 border-t border-border">{footer}</footer> : null}
      </div>
    </div>
  );
};

export default Modal;