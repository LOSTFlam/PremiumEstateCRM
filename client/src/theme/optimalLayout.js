/**
 * OPTIMAL LAYOUT CALCULATIONS
 * Premium Estate CRM - Dashboard, Offers, Landing Pages
 * 
 * Calculated for ideal space usage and beautiful arrangement
 */

// ============================================
// DASHBOARD PAGE (/dashboard)
// ============================================

export const DASHBOARD_LAYOUT = {
  // Page container
  container: {
    px: { base: 4, md: 6, lg: 8 },  // 16px, 24px, 32px
    py: { base: 5, md: 6, lg: 8 },  // 20px, 24px, 32px
    maxW: "1920px",
  },
  
  // Hero section (gradient card)
  hero: {
    height: { base: "auto", md: "420px" },
    padding: { base: 6, md: 8, lg: 10 },  // 24px, 32px, 40px
    gridColumns: { base: "1fr", lg: "1.2fr 0.8fr" },
    gap: { base: 5, md: 6, lg: 8 },  // 20px, 24px, 32px
    borderRadius: "32px",
    
    // Stats inside hero
    stats: {
      width: "calc(33.333% - 14px)",  // 3 equal columns with gap compensation
      minW: "180px",
      padding: { base: 4, md: 5 },
      gap: { base: 3, md: 4, lg: 5 },  // 12px, 16px, 20px
    },
  },
  
  // Search/Filter card
  searchCard: {
    width: "100%",
    padding: { base: 6, md: 8 },  // 24px, 32px
    borderRadius: "28px",
    gap: { base: 4, md: 5 },  // 16px, 20px
    
    // Input fields
    inputs: {
      height: "52px",
      borderRadius: "18px",
      gridColumns: { base: "1fr", md: "repeat(2, 1fr)" },
      gap: { base: 3, md: 4 },  // 12px, 16px
    },
    
    // Buttons
    buttons: {
      height: "50px",
      fontSize: "md",
      gap: { base: 3, md: 4 },
    },
  },
  
  // Property metrics row
  metricsRow: {
    columns: { base: 1, md: 2, xl: 3 },
    gap: { base: 4, md: 5, lg: 6 },  // 16px, 20px, 24px
    cardPadding: { base: 5, md: 6 },
    borderRadius: "24px",
  },
  
  // Featured property card
  featuredProperty: {
    gridColumns: { base: "1fr", xl: "1fr 1fr" },  // Equal 50/50 split
    imageHeight: { base: "280px", xl: "100%" },
    contentPadding: { base: 6, md: 8, lg: 10 },  // 24px, 32px, 40px
    gap: { base: 5, md: 6, lg: 8 },
    borderRadius: "30px",
    
    // Metrics inside featured
    metrics: {
      columns: { base: 1, md: 3 },
      gap: { base: 3, md: 4 },
      cardPadding: { base: 3, md: 4 },
      borderRadius: "18px",
    },
  },
  
  // Property listing cards
  propertyCards: {
    columns: { base: 1, md: 2, xl: 3 },
    gap: { base: 5, md: 6, lg: 8 },  // 20px, 24px, 32px
    cardPadding: { base: 5, md: 6 },
    borderRadius: "26px",
    imageHeight: "240px",
  },
};

// ============================================
// OFFERS PAGE (/offers)
// ============================================

export const OFFERS_LAYOUT = {
  container: {
    px: { base: 4, md: 6, lg: 8 },
    py: { base: 6, md: 8, lg: 10 },
    maxW: "1920px",
  },
  
  // Hero/search section
  hero: {
    padding: { base: 6, md: 8, lg: 10 },
    borderRadius: "34px",
    gap: { base: 5, md: 6, lg: 8 },
    gridColumns: { base: "1fr", lg: "1fr 1fr" },
    
    searchBox: {
      height: "60px",
      borderRadius: "22px",
      padding: { base: 4, md: 5 },
    },
    
    filters: {
      gridColumns: { base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
      gap: { base: 3, md: 4 },
      buttonHeight: "54px",
    },
  },
  
  // Property grid
  propertyGrid: {
    columns: { base: 1, md: 2, lg: 3, xl: 4 },
    gap: { base: 5, md: 6, lg: 8 },  // 20px, 24px, 32px
  },
  
  // Individual property card
  card: {
    borderRadius: "30px",
    imageHeight: { base: "240px", md: "280px" },
    padding: { base: 5, md: 6 },
    gap: { base: 4, md: 5 },
    
    // Metrics inside card
    metrics: {
      columns: { base: 3 },
      gap: { base: 2, md: 3 },
      iconSize: { base: "32px", md: "36px" },
      fontSize: { base: "sm", md: "md" },
    },
  },
};

// ============================================
// LANDING PAGE (/)
// ============================================

export const LANDING_LAYOUT = {
  container: {
    px: { base: 4, md: 6, lg: 8 },
    py: { base: 0, md: 0 },
    maxW: "1920px",
  },
  
  // Hero section
  hero: {
    paddingTop: { base: 28, md: 32, lg: 36 },  // 112px, 128px, 144px
    paddingBottom: { base: 16, md: 20, lg: 24 },  // 64px, 80px, 96px
    gridColumns: { base: "1fr", xl: "1.05fr 0.95fr" },
    gap: { base: 10, md: 12, lg: 16 },  // 40px, 48px, 64px
    
    // Stats inside hero
    stats: {
      columns: { base: 1, md: 3 },
      gap: { base: 4, md: 5 },
      cardPadding: { base: 5, md: 6 },
      borderRadius: "28px",
    },
  },
  
  // Market stats section
  marketStats: {
    paddingY: { base: 16, md: 20, lg: 24 },
    gridColumns: { base: "1fr", xl: "0.95fr 1.05fr" },
    gap: { base: 6, md: 8 },
    
    statCards: {
      columns: { base: 2, md: 4 },
      gap: { base: 3, md: 4 },
      padding: { base: 4, md: 5 },
      borderRadius: "26px",
    },
  },
  
  // Routes section
  routes: {
    paddingY: { base: 16, md: 20 },
    gridColumns: { base: "1fr", xl: "1fr 1fr" },
    gap: { base: 5, md: 6, lg: 8 },
    
    routeCards: {
      columns: { base: 1, md: 2 },
      gap: { base: 4, md: 5 },
      padding: { base: 5, md: 6 },
      borderRadius: "32px",
    },
  },
  
  // Collections section
  collections: {
    paddingY: { base: 16, md: 20, lg: 24 },
    gridColumns: { base: "1fr", xl: "1.08fr 0.92fr" },
    gap: { base: 6, md: 8 },
    
    collectionCards: {
      columns: { base: 1, md: 2 },
      gap: { base: 4, md: 5 },
      padding: { base: 5, md: 6 },
      borderRadius: "32px",
    },
  },
  
  // Property grid section
  propertySection: {
    paddingY: { base: 16, md: 20, lg: 24 },
    gridColumns: { base: 1, md: 2, lg: 3, xl: 4 },
    gap: { base: 5, md: 6, lg: 8 },
  },
};

// ============================================
// SHARED COMPONENT SIZES
// ============================================

export const SHARED_SIZES = {
  // Buttons
  buttons: {
    sm: { height: "40px", paddingX: "16px", fontSize: "sm" },
    md: { height: "48px", paddingX: "20px", fontSize: "md" },
    lg: { height: "56px", paddingX: "28px", fontSize: "lg" },
  },
  
  // Cards
  cards: {
    sm: { padding: "16px", borderRadius: "16px" },
    md: { padding: "24px", borderRadius: "24px" },
    lg: { padding: "32px", borderRadius: "32px" },
    xl: { padding: "40px", borderRadius: "40px" },
  },
  
  // Icons
  icons: {
    sm: "20px",
    md: "24px",
    lg: "28px",
    xl: "32px",
  },
  
  // Text
  text: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px",
  },
  
  // Line heights
  lineHeights: {
    heading: "1.1",
    subheading: "1.2",
    body: "1.6",
    relaxed: "1.8",
  },
  
  // Gaps
  gaps: {
    tight: "12px",
    normal: "16px",
    wide: "24px",
    wider: "32px",
    widest: "40px",
  },
};

export default {
  dashboard: DASHBOARD_LAYOUT,
  offers: OFFERS_LAYOUT,
  landing: LANDING_LAYOUT,
  shared: SHARED_SIZES,
};
