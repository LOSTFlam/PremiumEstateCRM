import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export const ScrollRevealPro = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 60,
  stagger = false,
  staggerDelay = 100,
  threshold = 0.1,
  once = true,
  blurAmount = 10,
  scaleStart = 0.9,
  easing = [0.4, 0, 0.2, 1],
  ...props
}) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { threshold, once });
  const [hasAnimated, setHasAnimated] = useState(false);

  const variants = {
    hidden: {
      opacity: 0,
      ...(direction === "up" && { y: distance }),
      ...(direction === "down" && { y: -distance }),
      ...(direction === "left" && { x: distance }),
      ...(direction === "right" && { x: -distance }),
      ...(direction === "scale" && { scale: scaleStart }),
      ...(direction === "blur" && { filter: `blur(${blurAmount}px)` }),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "blur(0)",
      transition: {
        duration,
        delay: delay / 1000,
        ease: easing,
      },
    },
  };

  useEffect(() => {
    if (isInView && (!once || !hasAnimated)) {
      controls.start("visible");
      if (once) setHasAnimated(true);
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, once, hasAnimated, controls]);

  const childVariants = stagger
    ? {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: (delay + i * staggerDelay) / 1000,
            duration: 0.5,
            ease: easing,
          },
        }),
      }
    : undefined;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={stagger ? undefined : variants}
      {...props}
    >
      {stagger
        ? React.Children.map(children, (child, i) =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
                  variants: childVariants,
                  custom: i,
                  initial: "hidden",
                  animate: "visible",
                })
              : child
          )
        : children}
    </motion.div>
  );
};

export default ScrollRevealPro;
