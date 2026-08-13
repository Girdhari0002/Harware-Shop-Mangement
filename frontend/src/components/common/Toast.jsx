const toneClasses = {
  success: "border-success/30 bg-success-light text-success",
  warning: "border-warning/30 bg-warning-light text-warning",
  danger: "border-danger/30 bg-danger-light text-danger",
  info: "border-primary/30 bg-primary-light text-primary",
};

const Toast = ({ message, tone = "info" }) => {
  if (!message) return null;
  return (
    <div className={`fixed bottom-5 right-5 z-50 max-w-sm erp-card border px-4 py-3 text-sm shadow-[0_10px_40px_rgba(23,32,51,0.15)] animate-in slide-in-from-bottom-2 fade-in-0 duration-300 ${toneClasses[tone]}`}>
      {message}
    </div>
  );
};

export default Toast;