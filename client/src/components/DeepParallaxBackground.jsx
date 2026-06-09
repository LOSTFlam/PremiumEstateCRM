import { useMemo } from "react";
import { Box, usePrefersReducedMotion } from "@chakra-ui/react";

/**
 * DeepParallaxBackground - Multi-layer depth background
 * Creates atmospheric perspective with multiple parallax layers
 */
export default function DeepParallaxBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Deep background layers - from furthest to closest
  const backgroundLayers = useMemo(
    () => [
      {
        // Layer 1: Furthest - subtle gradient
        opacity: 0.3,
        background: "radial-gradient(circle at 20% 30%, rgba(212,175,55,0.03) 0%, transparent 50%)",
        blur: "0px",
        zIndex: 0,
        speed: 0.02,
      },
      {
        // Layer 2: Deep atmosphere
        opacity: 0.4,
        background:
          "radial-gradient(circle at 80% 70%, rgba(255,255,255,0.02) 0%, transparent 45%)",
        blur: "0px",
        zIndex: 0,
        speed: 0.05,
      },
      {
        // Layer 3: Mid-depth gold mist
        opacity: 0.5,
        background:
          "radial-gradient(circle at 40% 60%, rgba(245,208,118,0.04) 0%, transparent 40%)",
        blur: "20px",
        zIndex: 1,
        speed: 0.08,
      },
      {
        // Layer 4: Closer white mist
        opacity: 0.6,
        background:
          "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.03) 0%, transparent 35%)",
        blur: "30px",
        zIndex: 2,
        speed: 0.12,
      },
      {
        // Layer 5: Foreground subtle depth
        opacity: 0.7,
        background: "linear-gradient(180deg, rgba(8,17,26,0.05) 0%, transparent 50%)",
        blur: "0px",
        zIndex: 3,
        speed: 0.15,
      },
    ],
    []
  );

  // Floating particles at different depths
  const particleLayers = useMemo(
    () => [
      // Far particles (small, slow, dim)
      ...Array.from({ length: 30 }, (_, i) => ({
        id: `far-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`,
        opacity: Math.random() * 0.3 + 0.1,
        speed: `${20 + Math.random() * 10}s`,
        delay: `${Math.random() * 5}s`,
        depth: "far",
      })),
      // Mid particles (medium, medium speed)
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `mid-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 3 + 2}px`,
        opacity: Math.random() * 0.4 + 0.2,
        speed: `${15 + Math.random() * 8}s`,
        delay: `${Math.random() * 5}s`,
        depth: "mid",
      })),
      // Near particles (larger, faster, brighter)
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `near-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 4 + 3}px`,
        opacity: Math.random() * 0.5 + 0.3,
        speed: `${10 + Math.random() * 5}s`,
        delay: `${Math.random() * 5}s`,
        depth: "near",
      })),
    ],
    []
  );

  return (
    <>
      <style>{`
        @keyframes float-depth-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, 3%) scale(1.02); }
          66% { transform: translate(-1%, 2%) scale(0.98); }
        }
        @keyframes float-depth-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-3%, 4%) scale(1.03); }
        }
        @keyframes float-depth-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(4%, -2%) scale(1.01); }
          75% { transform: translate(-2%, 3%) scale(0.99); }
        }
        @keyframes particle-float {
          0%, 100% { 
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-30px) translateX(15px);
            opacity: 0.8;
          }
        }
      `}</style>

      {/* Deep background layers */}
      {backgroundLayers.map((layer, index) => (
        <Box
          key={`bg-layer-${index}`}
          position="absolute"
          inset={0}
          background={layer.background}
          opacity={layer.opacity}
          zIndex={layer.zIndex}
          filter={layer.blur !== "0px" ? `blur(${layer.blur})` : undefined}
          animation={
            !prefersReducedMotion
              ? `float-depth-${(index % 3) + 1} ${25 + index * 5}s ease-in-out infinite`
              : "none"
          }
          pointerEvents="none"
        />
      ))}

      {/* Floating particles at different depths */}
      {!prefersReducedMotion &&
        particleLayers.map((particle) => (
          <Box
            key={particle.id}
            position="absolute"
            left={particle.left}
            top={particle.top}
            width={particle.size}
            height={particle.size}
            background="radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(212,175,55,0.4) 50%, transparent 70%)"
            borderRadius="50%"
            filter="blur(1px)"
            opacity={particle.opacity}
            animation={`particle-float ${particle.speed} ease-in-out infinite`}
            pointerEvents="none"
            zIndex={particle.depth === "far" ? 0 : particle.depth === "mid" ? 1 : 2}
            sx={{
              animationDelay: particle.delay,
            }}
          />
        ))}

      {/* Atmospheric haze layers */}
      <Box
        position="absolute"
        inset={0}
        background="linear-gradient(180deg, rgba(8,17,26,0.4) 0%, rgba(8,17,26,0.2) 50%, rgba(8,17,26,0.1) 100%)"
        opacity={0.5}
        zIndex={4}
        pointerEvents="none"
        filter="blur(40px)"
      />

      {/* Vignette for depth */}
      <Box
        position="absolute"
        inset={0}
        background="radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)"
        opacity={0.6}
        zIndex={5}
        pointerEvents="none"
      />
    </>
  );
}
