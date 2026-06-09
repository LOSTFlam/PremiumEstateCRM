/**
 * Depth-based Shadow System
 * Multi-layer shadows for realistic depth perception
 */

export const depthShadows = {
  // Level 1: Subtle elevation
  level1: `
    0 2px 8px rgba(0, 0, 0, 0.15),
    0 0 2px rgba(0, 0, 0, 0.1)
  `,

  // Level 2: Medium elevation
  level2: `
    0 4px 16px rgba(0, 0, 0, 0.2),
    0 0 4px rgba(0, 0, 0, 0.1),
    0 0 20px rgba(212, 175, 55, 0.05)
  `,

  // Level 3: High elevation
  level3: `
    0 8px 32px rgba(0, 0, 0, 0.25),
    0 0 8px rgba(0, 0, 0, 0.15),
    0 0 40px rgba(212, 175, 55, 0.08)
  `,

  // Level 4: Maximum elevation
  level4: `
    0 12px 48px rgba(0, 0, 0, 0.3),
    0 0 12px rgba(0, 0, 0, 0.2),
    0 0 60px rgba(212, 175, 55, 0.1),
    0 0 100px rgba(255, 255, 255, 0.05)
  `,

  // Ethereal glow
  ethereal: `
    0 0 40px rgba(212, 175, 55, 0.15),
    0 0 80px rgba(255, 255, 255, 0.08),
    0 0 120px rgba(212, 175, 55, 0.05)
  `,

  // Floating effect
  floating: `
    0 20px 60px rgba(0, 0, 0, 0.25),
    0 0 40px rgba(212, 175, 55, 0.1),
    0 0 80px rgba(255, 255, 255, 0.05)
  `,

  // Inset depth
  inset: `
    inset 0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 0 4px rgba(0, 0, 0, 0.1)
  `,

  // Glass depth
  glass: `
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(212, 175, 55, 0.12),
    0 0 80px rgba(255, 255, 255, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 0 60px rgba(255, 255, 255, 0.08)
  `,

  // Crystal depth
  crystal: `
    0 12px 48px rgba(0, 0, 0, 0.35),
    0 0 60px rgba(212, 175, 55, 0.15),
    0 0 100px rgba(255, 255, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 0 80px rgba(255, 255, 255, 0.1)
  `,
};

/**
 * Get shadow based on depth level (1-4)
 */
export const getDepthShadow = (level) => {
  return depthShadows[`level${Math.min(Math.max(level, 1), 4)}`];
};

/**
 * Generate shadow with custom color
 */
export const createColoredShadow = (color, intensity = 1, levels = 3) => {
  const shadows = [];
  for (let i = 1; i <= levels; i++) {
    const size = i * 10;
    const opacity = (0.1 * intensity) / i;
    shadows.push(`0 ${size}px ${size * 3} rgba(${color}, ${opacity})`);
  }
  return shadows.join(",");
};

/**
 * Atmospheric perspective - objects get lighter and less saturated with distance
 */
export const atmosphericPerspective = {
  // Foreground - sharp, saturated
  foreground: {
    opacity: 1,
    blur: "0px",
    saturation: "100%",
    contrast: "100%",
  },
  // Mid-ground - slightly hazy
  midground: {
    opacity: 0.85,
    blur: "0.5px",
    saturation: "85%",
    contrast: "95%",
  },
  // Background - hazy, desaturated
  background: {
    opacity: 0.6,
    blur: "1px",
    saturation: "60%",
    contrast: "85%",
  },
  // Far background - very hazy
  farBackground: {
    opacity: 0.4,
    blur: "2px",
    saturation: "40%",
    contrast: "70%",
  },
};

/**
 * Depth-based blur for layered backgrounds
 */
export const depthBlur = {
  far: "blur(40px)",
  mid: "blur(20px)",
  near: "blur(10px)",
  foreground: "blur(0px)",
};

/**
 * Parallax speed multipliers based on depth
 */
export const parallaxSpeed = {
  far: 0.02,
  mid: 0.05,
  near: 0.1,
  foreground: 0.15,
};
