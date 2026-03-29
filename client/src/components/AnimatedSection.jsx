import React from "react";
import { Box } from "@chakra-ui/react";
import { useScrollReveal } from "hooks/useScrollReveal";

/**
 * AnimatedSection Component
 * Wrapper for scroll-revealed sections with various animation presets
 */
export default function AnimatedSection({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  rootMargin = "50px",
  triggerOnce = true,
  style = {},
  ...props
}) {
  const [ref, isRevealed] = useScrollReveal({
    threshold,
    rootMargin,
    triggerOnce,
    delay,
  });

  const getAnimationStyle = () => {
    const baseStyle = {
      transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), 
                   transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    };

    if (isRevealed) {
      return {
        ...baseStyle,
        opacity: 1,
        transform: "translateY(0) scale(1)",
      };
    }

    switch (animation) {
      case "fade-up":
        return {
          ...baseStyle,
          opacity: 0,
          transform: "translateY(50px)",
        };
      case "fade-down":
        return {
          ...baseStyle,
          opacity: 0,
          transform: "translateY(-50px)",
        };
      case "fade-left":
        return {
          ...baseStyle,
          opacity: 0,
          transform: "translateX(-50px)",
        };
      case "fade-right":
        return {
          ...baseStyle,
          opacity: 0,
          transform: "translateX(50px)",
        };
      case "scale-up":
        return {
          ...baseStyle,
          opacity: 0,
          transform: "scale(0.9)",
        };
      case "scale-down":
        return {
          ...baseStyle,
          opacity: 0,
          transform: "scale(1.1)",
        };
      case "zoom-in":
        return {
          ...baseStyle,
          opacity: 0,
          transform: "scale(0.8)",
        };
      case "blur-in":
        return {
          ...baseStyle,
          opacity: 0,
          filter: "blur(10px)",
          transform: "translateY(30px)",
        };
      case "slide-up":
        return {
          ...baseStyle,
          opacity: 0,
          transform: "translateY(100px)",
        };
      case "rotate-in":
        return {
          ...baseStyle,
          opacity: 0,
          transform: "rotate(-5deg) scale(0.9)",
        };
      default:
        return {
          ...baseStyle,
          opacity: 0,
          transform: "translateY(50px)",
        };
    }
  };

  return (
    <Box
      ref={ref}
      style={{
        ...getAnimationStyle(),
        ...style,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/**
 * StaggerGrid Component
 * For grid items with staggered reveal animation
 */
export function StaggerGrid({
  children,
  columns = 3,
  staggerDelay = 100,
  animation = "fade-up",
  threshold = 0.1,
  ...props
}) {
  const items = React.Children.toArray(children);

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: "1fr",
        md: columns === 2 ? "repeat(2, 1fr)" : columns === 3 ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
        lg: `repeat(${columns}, 1fr)`,
      }}
      gap={6}
      {...props}
    >
      {items.map((item, index) => (
        <AnimatedSection
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          threshold={threshold}
        >
          {item}
        </AnimatedSection>
      ))}
    </Box>
  );
}

/**
 * AnimatedNumber Component
 * Displays animated counting number
 */
export function AnimatedNumber({ end, duration = 2000, suffix = "", prefix = "", ...props }) {
  const [ref, count] = useScrollReveal();
  const [displayCount, setDisplayCount] = React.useState(0);

  React.useEffect(() => {
    if (ref.current) {
      let startTime;
      let animationFrame;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayCount(Math.floor(easeOutQuart * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    }
  }, [ref, end, duration]);

  return (
    <Box ref={ref} {...props}>
      {prefix}{displayCount}{suffix}
    </Box>
  );
}

// Re-export hooks for convenience
export { useScrollReveal, useParallax, useMouseParallax, useCountUp } from "hooks/useScrollReveal";
