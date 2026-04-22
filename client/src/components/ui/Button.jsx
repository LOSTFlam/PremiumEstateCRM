import { motion } from "framer-motion";

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)]",
    secondary:
      "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--card-border)] hover:bg-[var(--bg-tertiary)]",
    ghost: "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]",
    danger: "bg-[var(--danger)] text-white hover:bg-red-600",
    success: "bg-[var(--success)] text-white hover:bg-emerald-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      ) : null}
      {children}
    </motion.button>
  );
}
