/**
 * Shared Animation Components for Premium Estate CRM
 * Reusable Framer Motion components for consistent animations
 */

import { motion } from "framer-motion";
import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  VStack,
  Grid,
  SimpleGrid,
  Button,
  Image,
  Badge,
  Wrap,
} from "@chakra-ui/react";
import Card from "components/card/Card";

// Animation Variants
export const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  },
  float: {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  },
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  glow: {
    animate: {
      boxShadow: ["0 0 20px rgba(102, 126, 234, 0.3)", "0 0 40px rgba(102, 126, 234, 0.6)", "0 0 20px rgba(102, 126, 234, 0.3)"],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  shimmer: {
    hover: {
      x: [0, 100, 0],
      transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
    }
  }
};

// Motion Components
export const MotionBox = motion(Box);
export const MotionCard = motion(Card);
export const MotionHeading = motion(Heading);
export const MotionText = motion(Text);
export const MotionStack = motion(Stack);
export const MotionHStack = motion(HStack);
export const MotionVStack = motion(VStack);
export const MotionGrid = motion(Grid);
export const MotionSimpleGrid = motion(SimpleGrid);
export const MotionButton = motion(Button);
export const MotionImage = motion(Image);
export const MotionBadge = motion(Badge);
export const MotionWrap = motion(Wrap);

// Animated Card with Hover Effects
export const AnimatedCard = ({ children, delay = 0, ...props }) => (
  <MotionCard
    initial="hidden"
    animate="visible"
    variants={animations.fadeInUp}
    transition={{ delay }}
    whileHover={{ y: -8, scale: 1.02, boxShadow: "0 24px 80px rgba(0,0,0,0.15)" }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300 }}
    {...props}
  >
    {children}
  </MotionCard>
);

// Animated Section with Stagger
export const AnimatedSection = ({ children, delay = 0, ...props }) => (
  <MotionBox
    initial="hidden"
    animate="visible"
    variants={animations.staggerContainer}
    transition={{ delay }}
    {...props}
  >
    {children}
  </MotionBox>
);

// Floating Orb Component
export const FloatingOrb = ({ color, size, top, left, delay = 0 }) => (
  <MotionBox
    position="absolute"
    top={top}
    left={left}
    w={size}
    h={size}
    bg={color}
    borderRadius="full"
    filter="blur(80px)"
    opacity={0.3}
    animate={animations.float.animate}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    pointerEvents="none"
  />
);

// Animated Background with Orbs
export const AnimatedBackground = ({ colors = ["#667eea", "#764ba2", "#f093fb"] }) => (
  <MotionBox
    position="fixed"
    top={0}
    left={0}
    right={0}
    bottom={0}
    zIndex={0}
    pointerEvents="none"
    overflow="hidden"
  >
    <FloatingOrb color={colors[0]} size="600px" top="-10%" right="-5%" delay={0} />
    <FloatingOrb color={colors[1]} size="500px" bottom="-10%" left="-5%" delay={1} />
    <FloatingOrb color={colors[2]} size="400px" top="50%" left="50%" delay={2} />
  </MotionBox>
);

// Particle Component
export const Particle = ({ delay = 0, duration = 3, size = 4, top, left }) => (
  <MotionBox
    position="absolute"
    top={top}
    left={left}
    w={`${size}px`}
    h={`${size}px`}
    bg="rgba(255,255,255,0.6)"
    borderRadius="full"
    animate={{
      y: [0, -30, 0],
      opacity: [0.4, 0.8, 0.4],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

// Animated Particles Container
export const ParticleField = ({ count = 10 }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <Particle
        key={i}
        delay={i * 0.3}
        duration={3 + i}
        size={4 + i % 3}
        top={`${20 + i * 15}%`}
        left={`${10 + i * 15}%`}
      />
    ))}
  </>
);

// Hover Button with Scale
export const HoverButton = ({ children, ...props }) => (
  <MotionButton
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400 }}
    {...props}
  >
    {children}
  </MotionButton>
);

// Shimmer Effect Overlay
export const ShimmerOverlay = () => (
  <MotionBox
    position="absolute"
    top={0}
    left={0}
    right={0}
    bottom={0}
    background="linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
    initial={{ x: "-100%" }}
    whileHover={{ x: "100%" }}
    transition={{ duration: 0.5 }}
    pointerEvents="none"
  />
);

// Rotating Icon
export const RotatingIcon = ({ icon, duration = 20, ...props }) => (
  <MotionBox
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
    {...props}
  >
    {icon}
  </MotionBox>
);

// Pulse Circle
export const PulseCircle = ({ children, color, ...props }) => (
  <MotionBox
    animate={animations.glow.animate}
    as={Box}
    {...props}
  >
    {children}
  </MotionBox>
);

export default {
  animations,
  MotionBox,
  MotionCard,
  MotionHeading,
  MotionText,
  MotionStack,
  MotionHStack,
  MotionVStack,
  MotionGrid,
  MotionSimpleGrid,
  MotionButton,
  MotionImage,
  MotionBadge,
  MotionWrap,
  AnimatedCard,
  AnimatedSection,
  FloatingOrb,
  AnimatedBackground,
  Particle,
  ParticleField,
  HoverButton,
  ShimmerOverlay,
  RotatingIcon,
  PulseCircle,
};
