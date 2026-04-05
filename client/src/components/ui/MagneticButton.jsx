import { Box, Button } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useMagneticPhysics } from "hooks/useMagneticPhysics";

export const MagneticButton = ({
  children,
  magneticStrength = 0.2,
  ripple = true,
  gradient = true,
  ...props
}) => {
  const { ref, style: magneticStyle, isHovered } = useMagneticPhysics({
    strength: magneticStrength,
    radius: 200,
    smoothness: 0.1,
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div ref={ref} style={magneticStyle} whileTap={{ scale: 0.95 }}>
      <Button
        position="relative"
        overflow="hidden"
        onMouseMove={handleMouseMove}
        className={`btn-premium relative ${gradient ? "gradient-text" : ""}`}
        {...props}
      >
        {ripple && isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            transform: "translateX(-100%)",
          }}
          animate={isHovered ? { transform: "translateX(100%)" } : {}}
          transition={{ duration: 0.6 }}
        />

        <Box position="relative" zIndex={1}>
          {children}
        </Box>

        <motion.div
          className="absolute inset-0 rounded-premium pointer-events-none"
          style={{
            boxShadow: "0 0 0 0 rgba(212, 175, 55, 0)",
          }}
          animate={{
            boxShadow: isHovered
              ? "0 0 0 2px rgba(212, 175, 55, 0.5), 0 0 30px rgba(212, 175, 55, 0.3)"
              : "0 0 0 0 rgba(212, 175, 55, 0)",
          }}
          transition={{ duration: 0.2 }}
        />
      </Button>
    </motion.div>
  );
};

export default MagneticButton;
