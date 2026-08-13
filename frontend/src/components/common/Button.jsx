const variantClasses = {
  primary: "bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary/30",
  secondary: "bg-surface text-primary border border-primary hover:bg-primary-light focus-visible:ring-primary/25",
  accent: "bg-accent text-text-primary hover:bg-[#E6A600] focus-visible:ring-accent/30",
  danger: "bg-danger text-white hover:bg-[#B91C1C] focus-visible:ring-danger/30",
  success: "bg-success text-white hover:bg-[#15803D] focus-visible:ring-success/30",
  outline: "border border-border bg-surface text-text-secondary hover:bg-hover-bg hover:border-primary hover:text-primary focus-visible:ring-primary/20",
  ghost: "bg-transparent text-text-secondary hover:bg-hover-bg hover:text-text-primary focus-visible:ring-primary/15",
};

const sizeClasses = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

const Button = ({
  type = "button",
  variant = "outline",
  size = "md",
  className = "",
  disabled = false,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;