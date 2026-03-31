/**
 * Modern Layout System
 * Wide, spacious, and beautiful design
 */

// Container widths
export const CONTAINER_MAX_WIDTHS = {
  narrow: '1200px',
  standard: '1400px',
  wide: '1600px',
  ultra: '1920px',
};

// Grid configurations
export const GRID_CONFIGS = {
  // Dashboard grids
  dashboardStats: {
    base: '1fr',
    md: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
    xl: 'repeat(3, 1fr)',
  },
  dashboardCards: {
    base: '1fr',
    md: 'repeat(2, 1fr)',
    lg: 'repeat(2, 1fr)',
    xl: 'repeat(3, 1fr)',
  },
  
  // Offers grids
  offersFeatured: {
    base: '1fr',
    md: '1fr',
    lg: '1fr',
  },
  offersGrid: {
    base: '1fr',
    md: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
    xl: 'repeat(4, 1fr)',
  },
  
  // Landing page grids
  landingStats: {
    base: 'repeat(2, 1fr)',
    md: 'repeat(4, 1fr)',
  },
  landingRoutes: {
    base: '1fr',
    md: 'repeat(2, 1fr)',
    lg: 'repeat(2, 1fr)',
  },
  landingCollections: {
    base: '1fr',
    md: 'repeat(2, 1fr)',
  },
};

// Spacing presets
export const SPACING = {
  // Section spacing
  sectionPadding: {
    base: '60px',
    md: '80px',
    lg: '100px',
  },
  
  // Card spacing
  cardPadding: {
    sm: '20px',
    md: '28px',
    lg: '36px',
    xl: '48px',
  },
  
  // Gap sizes
  gaps: {
    tight: '16px',
    normal: '24px',
    wide: '32px',
    wider: '40px',
    widest: '48px',
  },
};

// Border radius
export const BORDER_RADIUS = {
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '40px',
  xxl: '48px',
  full: '9999px',
};

// Responsive text sizes
export const TEXT_SIZES = {
  // Headings
  h1: {
    base: '32px',
    md: '40px',
    lg: '48px',
    xl: '56px',
  },
  h2: {
    base: '24px',
    md: '32px',
    lg: '40px',
    xl: '48px',
  },
  h3: {
    base: '20px',
    md: '24px',
    lg: '28px',
    xl: '32px',
  },
  
  // Body text
  body: {
    sm: '14px',
    md: '16px',
    lg: '18px',
  },
  
  // Labels
  label: {
    xs: '11px',
    sm: '12px',
    md: '14px',
  },
};

// Line heights for readability
export const LINE_HEIGHTS = {
  tight: '1.2',
  normal: '1.5',
  relaxed: '1.75',
  loose: '2.0',
};

// Max widths for text content
export const TEXT_MAX_WIDTHS = {
  narrow: '600px',
  normal: '720px',
  wide: '840px',
  wider: '960px',
};

export default {
  containers: CONTAINER_MAX_WIDTHS,
  grids: GRID_CONFIGS,
  spacing: SPACING,
  radius: BORDER_RADIUS,
  text: TEXT_SIZES,
  lineHeights: LINE_HEIGHTS,
  textMaxWidths: TEXT_MAX_WIDTHS,
};
