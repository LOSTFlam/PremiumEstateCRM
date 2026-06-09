import { Box } from "@chakra-ui/react";

/**
 * PremiumGradientBorder - Beautiful animated gradient border
 * Features:
 * - Smooth gradient animation
 * - Inner glow effect
 * - Fully rounded corners
 * - Ethereal glow
 */
export default function PremiumGradientBorder({
  children,
  size = "2px",
  colors = ["#F5D076", "#D4AF37", "#B8962E", "#F5D076"],
  animated = true,
  glow = true,
  borderRadius = "40px",
  ...props
}) {
  return (
    <Box position="relative" borderRadius={borderRadius} {...props}>
      {/* Animated gradient border */}
      <Box
        position="absolute"
        top={`-${size}`}
        left={`-${size}`}
        right={`-${size}`}
        bottom={`-${size}`}
        background={`linear-gradient(90deg, ${colors.join(", ")})`}
        backgroundSize="300% 100%"
        borderRadius={borderRadius}
        zIndex={-1}
        animation={animated ? "gradient-shift 8s ease infinite" : "none"}
        opacity={0.8}
        filter={glow ? "blur(8px)" : "none"}
      />

      {/* Inner border */}
      <Box
        position="absolute"
        top={size}
        left={size}
        right={size}
        bottom={size}
        background="linear-gradient(135deg, rgba(8, 17, 26, 1) 0%, rgba(16, 25, 36, 0.98) 100%)"
        borderRadius={borderRadius}
        zIndex={-1}
      />

      {/* Content */}
      {children}
    </Box>
  );
}

/**
 * PremiumGlowOrb - Floating ethereal glow orb
 */
export function PremiumGlowOrb({
  size = "300px",
  color = "rgba(212, 175, 55, 0.15)",
  position = { top: 0, right: 0 },
  blur = "100px",
  animated = true,
  ...props
}) {
  return (
    <Box
      position="absolute"
      {...position}
      width={size}
      height={size}
      background={`radial-gradient(circle, ${color} 0%, transparent 70%)`}
      borderRadius="50%"
      filter={`blur(${blur})`}
      animation={animated ? "orb-float 20s ease-in-out infinite" : "none"}
      opacity={0.6}
      pointerEvents="none"
      zIndex={0}
      {...props}
    />
  );
}

/**
 * PremiumLightLeak - Cinematic light leak effect
 */
export function PremiumLightLeak({
  position = "top",
  color = "rgba(255, 255, 255, 0.08)",
  size = "200px",
  rotation = 0,
  ...props
}) {
  const positions = {
    top: { top: 0, left: 0, right: 0, height: size },
    bottom: { bottom: 0, left: 0, right: 0, height: size },
    left: { top: 0, bottom: 0, left: 0, width: size },
    right: { top: 0, bottom: 0, right: 0, width: size },
  };

  return (
    <Box
      position="absolute"
      {...positions[position]}
      background={`linear-gradient(${rotation}deg, ${color} 0%, transparent 100%)`}
      filter="blur(30px)"
      pointerEvents="none"
      zIndex={0}
      opacity={0.5}
      {...props}
    />
  );
}

/**
 * PremiumShimmer - Shimmer effect overlay
 */
export function PremiumShimmer({
  direction = "diagonal",
  intensity = 0.1,
  speed = "3s",
  ...props
}) {
  const directions = {
    diagonal: "105deg",
    horizontal: "90deg",
    vertical: "180deg",
  };

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      background={`linear-gradient(${directions[direction]}, 
        transparent 40%, 
        rgba(255,255,255,${intensity}) 45%, 
        rgba(255,255,255,${intensity + 0.05}) 50%, 
        rgba(255,255,255,${intensity}) 55%, 
        transparent 60%)`}
      backgroundSize="300% 100%"
      animation={`shimmer ${speed} ease-in-out infinite`}
      pointerEvents="none"
      zIndex={1}
      opacity={0.6}
      {...props}
    />
  );
}
