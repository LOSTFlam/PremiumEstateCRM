export function Text({
  size = "sm",
  weight = "normal",
  children,
  className = "",
  as: Tag = "span",
  ...props
}) {
  const sizes = {
    xs: { fontSize: "0.75rem", lineHeight: 1 },
    sm: { fontSize: "0.875rem", lineHeight: 1.25 },
    md: { fontSize: "1rem", lineHeight: 1.5 },
    lg: { fontSize: "1.125rem", lineHeight: 1.6 },
    xl: { fontSize: "1.25rem", lineHeight: 1.7 },
  };

  const weights = {
    normal: { fontWeight: 400 },
    medium: { fontWeight: 500 },
    semibold: { fontWeight: 600 },
    bold: { fontWeight: 700 },
  };

  const style = { ...sizes[size], ...weights[weight] };

  return (
    <Tag style={style} className={`text-[var(--text-secondary)] ${className}`} {...props}>
      {children}
    </Tag>
  );
}
