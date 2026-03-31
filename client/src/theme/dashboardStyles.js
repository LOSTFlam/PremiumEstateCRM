/**
 * Modern Dashboard Styles
 * Premium design system for the dashboard page
 */

export const dashboardStyles = {
  // Gradient backgrounds
  gradients: {
    hero: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    heroDark: "linear-gradient(135deg, #1a1c2e 0%, #2d1b4e 100%)",
    card: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    stats: {
      purple: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      blue: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      orange: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      green: "linear-gradient(135deg, #4facfe 0%, #55efc4 100%)",
    },
  },

  // Shadows
  shadows: {
    soft: "0 4px 20px rgba(0, 0, 0, 0.08)",
    medium: "0 8px 40px rgba(0, 0, 0, 0.12)",
    large: "0 16px 60px rgba(0, 0, 0, 0.16)",
    xl: "0 24px 80px rgba(0, 0, 0, 0.20)",
    colored: "0 8px 30px rgba(102, 126, 234, 0.3)",
  },

  // Spacing
  spacing: {
    section: { base: 6, md: 8, lg: 10 },
    card: { base: 5, md: 6, lg: 7 },
    gap: { base: 4, md: 6, lg: 8 },
  },

  // Border radius
  radius: {
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "40px",
  },

  // Animations
  transitions: {
    fast: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

export default dashboardStyles;
