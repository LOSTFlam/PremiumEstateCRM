import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

/**
 * MagneticHoverEffect - Adds magnetic attraction to cards
 * Card subtly follows cursor when hovering
 */
export default function MagneticHoverEffect({ children, intensity = 30 }) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      // Smooth magnetic pull
      setPosition({
        x: deltaX * intensity,
        y: deltaY * intensity,
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setPosition({ x: 0, y: 0 });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [intensity]);

  return (
    <Box
      ref={cardRef}
      transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      transform={isHovering ? `translate(${position.x}px, ${position.y}px)` : "translate(0, 0)"}
      sx={{
        willChange: "transform",
      }}
    >
      {children}
    </Box>
  );
}

/**
 * TiltEffect - 3D tilt effect on hover
 */
export function TiltEffect({ children, maxTilt = 10 }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("");

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;
      
      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    };

    const handleMouseLeave = () => {
      setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [maxTilt]);

  return (
    <Box
      ref={cardRef}
      transition="transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      transform={transform}
      sx={{
        willChange: "transform",
      }}
    >
      {children}
    </Box>
  );
}
