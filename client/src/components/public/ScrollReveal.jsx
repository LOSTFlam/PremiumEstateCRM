import { useRef } from "react";
import { Box } from "@chakra-ui/react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const MotionBox = motion.create(Box);

export default function ScrollReveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  if (prefersReducedMotion) {
    return <Box {...props}>{children}</Box>;
  }

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      willChange="transform, opacity"
      {...props}
    >
      {children}
    </MotionBox>
  );
}
