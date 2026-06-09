import React from "react";
import { Box } from "@chakra-ui/react";

/**
 * Premium GlassCard with enhanced glassmorphism effects
 * Features:
 * - Multi-layer glass effect with enhanced blur
 * - Gradient border with ethereal glow
 * - Light refraction simulation
 * - Floating airy appearance
 * - Fully rounded corners (40px)
 * - NO dark halos on hover
 */
const GlassCard = ({
  children,
  hover = true,
  blur = 30,
  brightness = 200,
  opacity = 0.08,
  borderOpacity = 0.4,
  glow = true,
  borderRadius = "40px",
  ...props
}) => {
  // Premium ethereal glass gradient
  const glassBg = `linear-gradient(135deg, 
    rgba(255, 255, 255, ${opacity + 0.05}) 0%, 
    rgba(255, 255, 255, ${opacity}) 50%, 
    rgba(212, 175, 55, ${opacity * 0.3}) 100%)`;

  return (
    <Box
      position="relative"
      overflow="hidden"
      bg={glassBg}
      sx={{
        backdropFilter: `blur(${blur}px) saturate(${brightness}%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${brightness}%)`,
      }}
      border="1px solid"
      borderColor={`rgba(255, 255, 255, ${borderOpacity})`}
      borderRadius={borderRadius}
      boxShadow={
        glow
          ? `
        0 8px 32px 0 rgba(0, 0, 0, 0.2),
        0 0 40px rgba(212, 175, 55, 0.08),
        0 0 80px rgba(255, 255, 255, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 0 60px rgba(255, 255, 255, 0.05)
      `
          : "0 8px 32px 0 rgba(0, 0, 0, 0.2)"
      }
      transition={hover ? "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : "none"}
      _hover={
        hover
          ? {
              transform: "translateY(-10px)",
              boxShadow: `
          0 15px 50px 0 rgba(0, 0, 0, 0.25),
          0 0 60px rgba(212, 175, 55, 0.15),
          0 0 100px rgba(255, 255, 255, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 0 80px rgba(255, 255, 255, 0.1)
        `,
              borderColor: `rgba(212, 175, 55, ${borderOpacity + 0.2})`,
            }
          : {}
      }
      {...props}
    >
      {/* Inner ethereal glow gradient */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="70%"
        background="radial-gradient(circle at 50% 0%, 
          rgba(255, 255, 255, 0.15) 0%, 
          rgba(255, 255, 255, 0.05) 40%, 
          transparent 70%)"
        pointerEvents="none"
        opacity={0.8}
      />

      {/* Animated shimmer overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        background="linear-gradient(105deg, 
          transparent 40%, 
          rgba(255,255,255,0.03) 45%, 
          rgba(255,255,255,0.06) 50%, 
          rgba(255,255,255,0.03) 55%, 
          transparent 60%)"
        backgroundSize="300% 100%"
        opacity={0}
        pointerEvents="none"
        _hover={{
          opacity: 1,
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />

      {/* Gradient border glow effect */}
      <Box
        position="absolute"
        top="-1px"
        left="-1px"
        right="-1px"
        bottom="-1px"
        background="linear-gradient(135deg, 
          rgba(255, 255, 255, 0.4) 0%, 
          rgba(255, 255, 255, 0.1) 50%, 
          rgba(212, 175, 55, 0.3) 100%)"
        borderRadius={borderRadius}
        zIndex={-1}
        opacity={glow ? 0.5 : 0}
        filter="blur(15px)"
        transition="opacity 0.5s ease"
        _hover={{
          opacity: glow ? 0.8 : 0,
        }}
      />

      {/* Top-left corner light accent */}
      <Box
        position="absolute"
        top="3px"
        left="3px"
        width="50px"
        height="50px"
        background="radial-gradient(circle, 
          rgba(255, 255, 255, 0.4) 0%, 
          rgba(255, 255, 255, 0.15) 40%, 
          transparent 70%)"
        borderRadius="50%"
        filter="blur(8px)"
        opacity={0.6}
        pointerEvents="none"
      />

      {/* Bottom-right corner gold accent */}
      <Box
        position="absolute"
        bottom="3px"
        right="3px"
        width="50px"
        height="50px"
        background="radial-gradient(circle, 
          rgba(212, 175, 55, 0.35) 0%, 
          rgba(212, 175, 55, 0.1) 40%, 
          transparent 70%)"
        borderRadius="50%"
        filter="blur(10px)"
        opacity={0.4}
        pointerEvents="none"
        _hover={{
          opacity: 0.6,
          filter: "blur(12px)",
        }}
      />

      {/* Content */}
      {children}
    </Box>
  );
};

export default GlassCard;
