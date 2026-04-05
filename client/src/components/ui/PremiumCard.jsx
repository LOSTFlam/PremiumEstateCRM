import { Box, usePrefersReducedMotion } from "@chakra-ui/react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useMouseParallax } from "hooks/useMouseParallax";
import { useMousePosition } from "hooks/useMousePosition";

export const PremiumCard = ({
  children,
  depth = 3,
  glowIntensity = 0.5,
  hoverLift = true,
  shimmer = true,
  className = "",
  ...props
}) => {
  const controls = useAnimation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, offsetX, offsetY } = useMouseParallax({ strength: depth * 0.02 });

  const rotateX = useTransform(offsetY, [-100, 100], [5, -5]);
  const rotateY = useTransform(offsetX, [-100, 100], [-5, 5]);
  const scale = useTransform(offsetX, [-100, 100], [0.99, 1.01]);

  const handleHoverStart = () => {
    if (!prefersReducedMotion && hoverLift) {
      controls.start({
        y: -12,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    }
  };

  const handleHoverEnd = () => {
    controls.start({ y: 0, transition: { duration: 0.3 } });
  };

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        scale: prefersReducedMotion ? 1 : scale,
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      animate={controls}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      whileTap={{ scale: 0.98 }}
      className={`crystal-prism relative overflow-hidden ${className}`}
      {...props}
    >
      <div className="absolute inset-0 ethereal-glow" />

      {shimmer && (
        <div className="absolute inset-0 animated-gradient-border pointer-events-none" />
      )}

      <div className="absolute inset-0 light-refraction pointer-events-none" />

      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(212,175,55,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 70%, rgba(245,208,118,0.08) 0%, transparent 50%)`,
            animation: "gradient-shift 15s ease infinite",
            backgroundSize: "200% 200%",
          }}
        />
      </div>

      <Box position="relative" zIndex={10} p={6} className="content-layer">
        {children}
      </Box>

      <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 animate-pulse-soft" />
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 animate-pulse-soft" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-300 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

      {[...Array(Math.min(depth, 6))].map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `0 ${8 + i * 8}px ${24 + i * 12}px rgba(0,0,0,${0.05 + i * 0.02})`,
            transform: `translateZ(${-i * 10}px)`,
            zIndex: -i - 1,
          }}
        />
      ))}
    </motion.div>
  );
};

export default PremiumCard;
