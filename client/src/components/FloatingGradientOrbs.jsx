import { useMemo } from "react";
import { Box, usePrefersReducedMotion } from "@chakra-ui/react";

/**
 * FloatingGradientOrbs - Multiple animated gradient orbs
 * Creates dreamy atmospheric background effect
 */
export default function FloatingGradientOrbs() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const orbs = useMemo(
    () => [
      {
        size: "500px",
        top: "10%",
        left: "15%",
        colors:
          "radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(245,208,118,0.06) 40%, transparent 70%)",
        duration: "25s",
        delay: "0s",
        blur: "80px",
      },
      {
        size: "400px",
        top: "60%",
        right: "10%",
        colors:
          "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)",
        duration: "30s",
        delay: "-5s",
        blur: "70px",
      },
      {
        size: "350px",
        bottom: "20%",
        left: "25%",
        colors:
          "radial-gradient(circle, rgba(245,208,118,0.1) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)",
        duration: "28s",
        delay: "-10s",
        blur: "60px",
      },
      {
        size: "300px",
        top: "30%",
        right: "30%",
        colors: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
        duration: "32s",
        delay: "-15s",
        blur: "50px",
      },
    ],
    []
  );

  return (
    <>
      <style>{`
        @keyframes float-orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 10%) scale(1.05); }
          66% { transform: translate(-3%, 5%) scale(0.95); }
        }
        @keyframes float-orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10%, 5%) scale(1.08); }
        }
        @keyframes float-orb-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10%, -5%) scale(1.03); }
          75% { transform: translate(-5%, 10%) scale(0.97); }
        }
        @keyframes float-orb-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-5%, -10%) scale(1.06); }
        }
      `}</style>

      {orbs.map((orb, index) => (
        <Box
          key={index}
          position="absolute"
          top={orb.top}
          left={orb.left}
          right={orb.right}
          bottom={orb.bottom}
          width={orb.size}
          height={orb.size}
          background={orb.colors}
          borderRadius="50%"
          filter={`blur(${orb.blur})`}
          opacity={0.6}
          pointerEvents="none"
          zIndex={0}
          animation={
            !prefersReducedMotion
              ? `float-orb-${index + 1} ${orb.duration} ease-in-out infinite`
              : "none"
          }
          sx={{
            animationDelay: orb.delay,
            willChange: "transform",
          }}
        />
      ))}
    </>
  );
}
