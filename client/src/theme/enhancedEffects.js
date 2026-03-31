/**
 * Enhanced Design Effects CSS
 * Modern spacing, text overflow prevention, and special effects
 */

export const enhancedEffectsCSS = `
  /* ============================================
     ENHANCED SPACING & LAYOUT
     ============================================ */
  
  /* Section Spacing */
  .section-spacious {
    padding-top: clamp(3rem, 5vw, 5rem);
    padding-bottom: clamp(3rem, 5vw, 5rem);
  }
  
  .section-extra-spacious {
    padding-top: clamp(4rem, 8vw, 8rem);
    padding-bottom: clamp(4rem, 8vw, 8rem);
  }
  
  /* Container Max Widths */
  .container-premium {
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
    padding-left: clamp(1rem, 3vw, 2rem);
    padding-right: clamp(1rem, 3vw, 2rem);
  }
  
  /* Grid Gaps */
  .grid-gap-sm {
    gap: clamp(1rem, 2vw, 1.5rem);
  }
  
  .grid-gap-md {
    gap: clamp(1.5rem, 3vw, 2rem);
  }
  
  .grid-gap-lg {
    gap: clamp(2rem, 4vw, 3rem);
  }
  
  /* ============================================
     TEXT OVERFLOW PREVENTION
     ============================================ */
  
  /* Prevent text overflow in all elements */
  .text-prevent-overflow {
    max-width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
  }
  
  /* Multi-line truncation */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Responsive text sizing */
  .text-responsive {
    font-size: clamp(1rem, 2vw, 1.25rem);
  }
  
  .heading-responsive {
    font-size: clamp(1.5rem, 4vw, 3rem);
  }
  
  /* ============================================
     MODERN CARD EFFECTS
     ============================================ */
  
  /* Glass Card Premium */
  .glass-card-premium {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.12),
      0 0 40px rgba(212, 175, 55, 0.05);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .glass-card-premium:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 24px 64px rgba(0, 0, 0, 0.2),
      0 0 60px rgba(212, 175, 55, 0.15);
    border-color: rgba(212, 175, 55, 0.3);
  }
  
  /* Gradient Border Card */
  .gradient-border-card {
    position: relative;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    border-radius: 32px;
    padding: 2px;
  }
  
  .gradient-border-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 32px;
    padding: 2px;
    background: linear-gradient(135deg, #F5D076, #D4AF37, #B8962E);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
  
  /* Shimmer Effect on Hover */
  .shimmer-hover {
    position: relative;
    overflow: hidden;
  }
  
  .shimmer-hover::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.6s ease;
  }
  
  .shimmer-hover:hover::after {
    left: 100%;
  }
  
  /* ============================================
     PREMIUM BUTTON EFFECTS
     ============================================ */
  
  /* Premium Button */
  .btn-premium {
    position: relative;
    padding: clamp(12px, 2vw, 16px) clamp(24px, 3vw, 32px);
    border-radius: 9999px;
    font-weight: 600;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .btn-premium::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }
  
  .btn-premium:hover::before {
    width: 300px;
    height: 300px;
  }
  
  .btn-premium:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
  
  /* ============================================
     IMAGE EFFECTS
     ============================================ */
  
  /* Image Zoom on Hover */
  .image-zoom-container {
    overflow: hidden;
    border-radius: 24px;
  }
  
  .image-zoom {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .image-zoom-container:hover .image-zoom {
    transform: scale(1.1);
  }
  
  /* Image Overlay Gradient */
  .image-overlay-gradient {
    background: linear-gradient(
      180deg,
      rgba(7, 12, 20, 0.05) 0%,
      rgba(7, 12, 20, 0.35) 50%,
      rgba(7, 12, 20, 0.85) 100%
    );
  }
  
  /* ============================================
     BADGE EFFECTS
     ============================================ */
  
  /* Floating Badge */
  .badge-floating {
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 8px 16px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  /* Glow Badge */
  .badge-glow {
    position: relative;
    padding: 8px 16px;
    border-radius: 9999px;
    background: rgba(212, 175, 55, 0.15);
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: #F5D076;
    font-weight: 600;
  }
  
  .badge-glow::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 9999px;
    background: linear-gradient(135deg, #F5D076, #D4AF37);
    z-index: -1;
    opacity: 0.3;
    filter: blur(8px);
  }
  
  /* ============================================
     SCROLL EFFECTS
     ============================================ */
  
  /* Smooth Scroll */
  html {
    scroll-behavior: smooth;
  }
  
  /* Scroll Reveal Animation */
  .scroll-reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .scroll-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Stagger Animation */
  .stagger-animation > *:nth-child(1) { transition-delay: 0.1s; }
  .stagger-animation > *:nth-child(2) { transition-delay: 0.2s; }
  .stagger-animation > *:nth-child(3) { transition-delay: 0.3s; }
  .stagger-animation > *:nth-child(4) { transition-delay: 0.4s; }
  .stagger-animation > *:nth-child(5) { transition-delay: 0.5s; }
  .stagger-animation > *:nth-child(6) { transition-delay: 0.6s; }
  
  /* ============================================
     LOADING EFFECTS
     ============================================ */
  
  /* Skeleton Loading */
  .skeleton-loading {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.05) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  /* ============================================
     HOVER LIFT EFFECTS
     ============================================ */
  
  /* Hover Lift */
  .hover-lift {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease;
  }
  
  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
  
  /* Hover Scale */
  .hover-scale {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .hover-scale:hover {
    transform: scale(1.05);
  }
  
  /* Hover Glow */
  .hover-glow {
    transition: box-shadow 0.3s ease;
  }
  
  .hover-glow:hover {
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
  }
  
  /* ============================================
     RESPONSIVE UTILITIES
     ============================================ */
  
  /* Mobile-first spacing */
  @media (max-width: 768px) {
    .section-spacious {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }
    
    .grid-gap-lg {
      gap: 1.5rem;
    }
  }
  
  /* Tablet spacing */
  @media (min-width: 768px) and (max-width: 1024px) {
    .container-premium {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
  
  /* Desktop spacing */
  @media (min-width: 1024px) {
    .section-extra-spacious {
      padding-top: 6rem;
      padding-bottom: 6rem;
    }
  }
`;

export default enhancedEffectsCSS;
