import React, { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * 3D Parallax card effect with mouse tracking
 */
const ParallaxCard = ({ children, intensity = 15, ...props }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(y, springConfig);
  const rotateY = useSpring(x, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateXValue = ((e.clientY - centerY) / rect.height) * intensity;
    const rotateYValue = ((e.clientX - centerX) / rect.width) * -intensity;

    x.set(rotateYValue);
    y.set(rotateXValue);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        {...props}
        style={{
          transform: isHovered ? "translateZ(20px)" : "translateZ(0)",
          transition: "transform 0.3s ease",
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
};

/**
 * Parallax layer for depth effect
 */
export const ParallaxLayer = ({ children, depth = 1, ...props }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / (50 / depth);
      const y = (e.clientY - window.innerHeight / 2) / (50 / depth);
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [depth]);

  return (
    <Box
      {...props}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.3s ease-out",
      }}
    >
      {children}
    </Box>
  );
};

/**
 * Tilt effect on hover
 */
export const TiltCard = ({ children, maxTilt = 10, ...props }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * maxTilt;
    const tiltY = ((x - centerX) / centerX) * -maxTilt;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <Box
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.3s ease",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </Box>
  );
};

export default ParallaxCard;
