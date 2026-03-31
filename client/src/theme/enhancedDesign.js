/**
 * Enhanced Design Styles for Premium Estate CRM
 * Modern spacing, effects, and text overflow prevention
 */

export const enhancedShadows = {
  // Soft elevation shadows
  soft: "0 4px 20px rgba(0, 0, 0, 0.08)",
  medium: "0 8px 40px rgba(0, 0, 0, 0.12)",
  large: "0 16px 60px rgba(0, 0, 0, 0.16)",
  xl: "0 24px 80px rgba(0, 0, 0, 0.20)",
  
  // Premium glow effects
  goldGlow: "0 0 30px rgba(212, 175, 55, 0.3)",
  blueGlow: "0 0 30px rgba(76, 110, 245, 0.3)",
  greenGlow: "0 0 30px rgba(100, 200, 150, 0.3)",
  purpleGlow: "0 0 30px rgba(139, 92, 246, 0.3)",
  
  // Hover lift shadows
  hoverSoft: "0 12px 40px rgba(0, 0, 0, 0.15)",
  hoverMedium: "0 20px 60px rgba(0, 0, 0, 0.20)",
  hoverLarge: "0 32px 80px rgba(0, 0, 0, 0.25)",
};

export const enhancedSpacing = {
  // Section spacing
  sectionPaddingY: { base: 16, md: 20, lg: 24 },
  sectionPaddingX: { base: 6, md: 8, lg: 12 },
  
  // Card spacing
  cardPadding: { base: 5, md: 6, lg: 7 },
  cardGap: { base: 4, md: 6, lg: 8 },
  
  // Content spacing
  contentGap: { base: 3, md: 4, lg: 5 },
  stackGap: { base: 2, md: 3, lg: 4 },
  
  // Grid spacing
  gridGap: { base: 4, md: 6, lg: 8 },
};

export const enhancedBorderRadius = {
  // Consistent rounded corners
  sm: "16px",
  md: "24px",
  lg: "32px",
  xl: "40px",
  xxl: "48px",
  full: "9999px",
};

export const enhancedTransitions = {
  // Smooth transitions
  fast: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  normal: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  slower: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  
  // Hover transforms
  hoverLift: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  hoverScale: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
};

export const textStyles = {
  // Prevent text overflow
  noWrap: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  lineClamp: (lines = 2) => ({
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }),
  
  // Premium text effects
  gradient: {
    bg: "linear-gradient(135deg, #F5D076 0%, #D4AF37 50%, #B8962E 100%)",
    bgClip: "text",
    color: "transparent",
  },
  
  // Responsive font sizes
  responsiveHeading: {
    base: "2xl",
    md: "3xl",
    lg: "4xl",
    xl: "5xl",
  },
  
  responsiveBody: {
    base: "sm",
    md: "md",
    lg: "lg",
  },
};

export const cardStyles = {
  // Base card with glass effect
  glass: {
    bg: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: enhancedBorderRadius.xl,
    boxShadow: enhancedShadows.medium,
  },
  
  // Premium card with gradient border
  premium: {
    bg: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(30px)",
    border: "2px solid transparent",
    borderImage: "linear-gradient(135deg, #F5D076, #D4AF37, #B8962E) 1",
    borderRadius: enhancedBorderRadius.xxl,
    boxShadow: enhancedShadows.large,
  },
  
  // Hover effects
  hover: {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: enhancedShadows.hoverLarge,
    transition: enhancedTransitions.slower,
  },
};

export const containerStyles = {
  // Max width containers
  maxW: {
    sm: "6xl",
    md: "7xl",
    lg: "8xl",
    xl: "9xl",
  },
  
  // Responsive padding
  padding: {
    base: "20px",
    md: "40px",
    lg: "60px",
    xl: "80px",
  },
};

export const animationStyles = {
  // Fade in animations
  fadeInUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  
  // Stagger animations
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  // Scale animations
  scaleUp: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  
  // Slide animations
  slideIn: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const gradientBackgrounds = {
  // Hero gradients
  hero: "linear-gradient(135deg, rgba(7, 12, 20, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)",
  
  // Card gradients
  card: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
  
  // Accent gradients
  gold: "linear-gradient(135deg, #F5D076 0%, #D4AF37 50%, #B8962E 100%)",
  blue: "linear-gradient(135deg, #4C6EF5 0%, #3B5BDB 100%)",
  purple: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
  green: "linear-gradient(135deg, #64C896 0%, #55B884 100%)",
  
  // Background overlays
  overlay: "linear-gradient(180deg, rgba(7, 12, 20, 0.8) 0%, rgba(7, 12, 20, 0.4) 100%)",
};

export const responsiveGrid = {
  // Auto-fit grids
  autoFit: {
    base: "1fr",
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
    xl: "repeat(4, 1fr)",
  },
  
  // Featured grids
  featured: {
    base: "1fr",
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
  },
  
  // Stats grids
  stats: {
    base: "repeat(2, 1fr)",
    md: "repeat(4, 1fr)",
  },
};

export const spacingPresets = {
  // Tight spacing for compact layouts
  tight: {
    px: { base: 4, md: 6 },
    py: { base: 8, md: 12 },
  },
  
  // Normal spacing for standard layouts
  normal: {
    px: { base: 6, md: 8 },
    py: { base: 12, md: 16 },
  },
  
  // Spacious layouts for premium feel
  spacious: {
    px: { base: 8, md: 12 },
    py: { base: 16, md: 20 },
  },
  
  // Extra spacious for hero sections
  extraSpacious: {
    px: { base: 8, md: 12 },
    py: { base: 20, md: 24 },
  },
};

// Helper function to generate responsive spacing
export const getResponsiveSpacing = (size = "normal", direction = "both") => {
  const preset = spacingPresets[size] || spacingPresets.normal;
  
  if (direction === "x") return preset.px;
  if (direction === "y") return preset.py;
  return { px: preset.px, py: preset.py };
};

// Helper function to generate grid columns
export const getResponsiveGrid = (type = "autoFit", min = 1, max = 4) => {
  const columns = {};
  for (let i = min; i <= max; i++) {
    const breakpoint = i === 1 ? "base" : i === 2 ? "md" : i === 3 ? "lg" : "xl";
    columns[breakpoint] = `repeat(${i}, 1fr)`;
  }
  return responsiveGrid[type] || columns;
};

// Export all as default
export default {
  shadows: enhancedShadows,
  spacing: enhancedSpacing,
  borderRadius: enhancedBorderRadius,
  transitions: enhancedTransitions,
  text: textStyles,
  cards: cardStyles,
  containers: containerStyles,
  animations: animationStyles,
  gradients: gradientBackgrounds,
  grid: responsiveGrid,
  spacingPresets,
  getResponsiveSpacing,
  getResponsiveGrid,
};
