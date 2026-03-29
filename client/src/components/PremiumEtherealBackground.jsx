import { useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { usePrefersReducedMotion } from "@chakra-ui/react";

/**
 * PremiumEtherealBackground - Ultra-premium background with:
 * - Multiple floating ethereal orbs
 * - Light refraction effects
 * - Gradient mesh
 * - Sparkling particles
 * - Airy atmospheric effects
 */
export default function PremiumEtherealBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const orbConfigs = useMemo(() => [
    {
      size: "600px",
      position: { top: "-10%", right: "-5%" },
      colors: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(245,208,118,0.08) 40%, transparent 70%)",
      animation: "orb-float-1 25s ease-in-out infinite",
      blur: "80px",
    },
    {
      size: "500px",
      position: { bottom: "-15%", left: "-10%" },
      colors: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)",
      animation: "orb-float-2 30s ease-in-out infinite",
      blur: "100px",
    },
    {
      size: "400px",
      position: { top: "40%", left: "50%" },
      colors: "radial-gradient(circle, rgba(245,208,118,0.1) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)",
      animation: "orb-float-3 35s ease-in-out infinite",
      blur: "90px",
    },
    {
      size: "350px",
      position: { top: "20%", left: "20%" },
      colors: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)",
      animation: "orb-float-1 28s ease-in-out infinite reverse",
      blur: "70px",
    },
    {
      size: "450px",
      position: { bottom: "10%", right: "15%" },
      colors: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(245,208,118,0.06) 40%, transparent 70%)",
      animation: "orb-float-2 32s ease-in-out infinite",
      blur: "85px",
    },
  ], []);

  const sparkleConfigs = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 3 + 2}s`,
    opacity: Math.random() * 0.5 + 0.3,
  })), []);

  return (
    <>
      <style>{`
        @keyframes orb-float-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(5%, 10%) scale(1.05);
          }
          50% {
            transform: translate(-3%, 15%) scale(0.98);
          }
          75% {
            transform: translate(-8%, -5%) scale(1.02);
          }
        }

        @keyframes orb-float-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-5%, -8%) scale(1.03);
          }
          66% {
            transform: translate(8%, 5%) scale(0.97);
          }
        }

        @keyframes orb-float-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-10%, 8%) scale(1.04);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes light-ray {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0) rotate(0deg);
          }
          50% {
            opacity: 0.6;
            transform: translateY(-30px) rotate(2deg);
          }
        }

        @keyframes gradient-mesh {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>

      {/* Base gradient mesh */}
      <Box
        position="absolute"
        inset={0}
        background="linear-gradient(-45deg, 
          rgba(8, 17, 26, 0.95) 0%, 
          rgba(16, 25, 36, 0.93) 25%, 
          rgba(22, 35, 52, 0.94) 50%, 
          rgba(13, 20, 31, 0.95) 75%, 
          rgba(8, 17, 26, 0.95) 100%)"
        backgroundSize="400% 400%"
        animation={!prefersReducedMotion ? "gradient-mesh 20s ease infinite" : "none"}
        opacity={0.8}
      />

      {/* Ethereal orbs */}
      {!prefersReducedMotion && orbConfigs.map((orb, index) => (
        <Box
          key={index}
          position="absolute"
          {...orb.position}
          width={orb.size}
          height={orb.size}
          background={orb.colors}
          borderRadius="50%"
          filter={`blur(${orb.blur})`}
          animation={orb.animation}
          opacity={0.6}
          pointerEvents="none"
          zIndex={0}
        />
      ))}

      {/* Sparkling particles */}
      {!prefersReducedMotion && sparkleConfigs.map((sparkle) => (
        <Box
          key={sparkle.id}
          position="absolute"
          left={sparkle.left}
          top={sparkle.top}
          width={sparkle.size}
          height={sparkle.size}
          background="radial-gradient(circle, 
            rgba(255, 255, 255, 0.9) 0%, 
            rgba(212, 175, 55, 0.6) 50%, 
            transparent 70%)"
          borderRadius="50%"
          filter="blur(1px)"
          animation={`sparkle ${sparkle.duration} ease-in-out infinite`}
          animationDelay={sparkle.delay}
          opacity={sparkle.opacity}
          pointerEvents="none"
          zIndex={1}
        />
      ))}

      {/* Ambient light rays */}
      {!prefersReducedMotion && Array.from({ length: 5 }).map((_, i) => (
        <Box
          key={`ray-${i}`}
          position="absolute"
          top={`${i * 20 - 10}%`}
          left={`${i * 25}%`}
          width="200px"
          height="300px"
          background="linear-gradient(180deg, 
            rgba(255, 255, 255, 0.03) 0%, 
            transparent 100%)"
          filter="blur(20px)"
          animation={`light-ray ${8 + i * 2}s ease-in-out infinite`}
          animationDelay={`${i * 0.5}s`}
          opacity={0.4}
          pointerEvents="none"
          zIndex={0}
          transform={`rotate(${i * 5 - 10}deg)`}
        />
      ))}

      {/* Subtle noise texture for depth */}
      <Box
        position="absolute"
        inset={0}
        opacity={0.02}
        pointerEvents="none"
        zIndex={1}
        backgroundImage="url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')"
      />
    </>
  );
}
