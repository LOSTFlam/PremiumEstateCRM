import { motion as _motion } from "framer-motion";

export function Heading({ level = "h2", size = "md", children, className = "", ...props }) {
  const sizes = {
    xs: { fontSize: "0.75rem", fontWeight: 600, lineHeight: 1 },
    sm: { fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.25 },
    md: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.3 },
    lg: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
    xl: { fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.4 },
    "2xl": { fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.3 },
    "3xl": { fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.2 },
    "4xl": { fontSize: "2.25rem", fontWeight: 800, lineHeight: 1.1 },
  };

  const Tag = level;
  const style = sizes[size] || sizes.md;

  return (
    <Tag style={style} className={`text-[var(--text-primary)] ${className}`} {...props}>
      {children}
    </Tag>
  );
}
