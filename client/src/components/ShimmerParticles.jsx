import { useMemo } from "react";
import { Box, usePrefersReducedMotion } from "@chakra-ui/react";

/**
 * ShimmerParticles - Floating shimmer particles
 * Creates magical atmosphere with floating sparkles
 */
export default function ShimmerParticles({ count = 40 }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: `${Math.random() * 5 + 5}s`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, [count]);

  return (
    <>
      <style>{`
        @keyframes shimmer-float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-30px) translateX(15px) scale(1.2);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-50px) translateX(-10px) scale(1);
            opacity: 0.5;
          }
          75% {
            transform: translateY(-20px) translateX(20px) scale(1.1);
            opacity: 0.7;
          }
        }
        @keyframes shimmer-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      {particles.map((particle) => (
        <Box
          key={particle.id}
          position="absolute"
          left={particle.left}
          top={particle.top}
          width={`${particle.size}px`}
          height={`${particle.size}px`}
          background="radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(212,175,55,0.5) 50%, transparent 70%)"
          borderRadius="50%"
          filter="blur(2px)"
          opacity={particle.opacity}
          pointerEvents="none"
          zIndex={1}
          sx={{
            animation: !prefersReducedMotion
              ? `shimmer-float ${particle.duration} ease-in-out infinite, shimmer-pulse 2s ease-in-out infinite`
              : undefined,
            animationDelay: `${particle.delay}, ${particle.delay}`,
          }}
        />
      ))}
    </>
  );
}

/**
 * LightRays - Animated light rays
 */
export function LightRays({ count = 3 }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const rays = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${i * 33}%`,
      rotation: Math.random() * 20 - 10,
      duration: `${15 + i * 5}s`,
      delay: `${i * 2}s`,
    }));
  }, [count]);

  return (
    <>
      <style>{`
        @keyframes light-ray {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0) rotate(var(--rotation));
          }
          50% {
            opacity: 0.6;
            transform: translateY(-50px) rotate(var(--rotation));
          }
        }
      `}</style>

      {rays.map((ray) => (
        <Box
          key={ray.id}
          position="absolute"
          left={ray.left}
          top="-100px"
          width="300px"
          height="600px"
          background="linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)"
          filter="blur(40px)"
          opacity={0.4}
          pointerEvents="none"
          zIndex={0}
          transform={`rotate(${ray.rotation}deg)`}
          animation={
            !prefersReducedMotion ? `light-ray ${ray.duration} ease-in-out infinite` : "none"
          }
          sx={{
            "--rotation": `${ray.rotation}deg`,
            animationDelay: ray.delay,
          }}
        />
      ))}
    </>
  );
}
