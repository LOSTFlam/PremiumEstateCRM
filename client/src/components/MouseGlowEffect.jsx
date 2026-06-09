import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

/**
 * MouseGlowEffect - Follows cursor with smooth glowing orb
 * Creates premium interactive lighting effect
 */
export default function MouseGlowEffect() {
  const glowRef = useRef(null);
  const [position, setPosition] = useState({ x: -500, y: -500 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Smooth follow with lerp
      const targetX = e.clientX;
      const targetY = e.clientY;

      setPosition((prev) => ({
        x: prev.x + (targetX - prev.x) * 0.1,
        y: prev.y + (targetY - prev.y) * 0.1,
      }));
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>

      {/* Main glow orb */}
      <Box
        ref={glowRef}
        position="fixed"
        left={0}
        top={0}
        transform={`translate(${position.x}px, ${position.y}px)`}
        width="500px"
        height="500px"
        borderRadius="50%"
        background="radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 30%, transparent 70%)"
        filter="blur(60px)"
        pointerEvents="none"
        zIndex={0}
        opacity={isHovering ? 0.6 : 0.3}
        transition="opacity 0.5s ease"
        sx={{
          animation: "glow-pulse 4s ease-in-out infinite",
        }}
      />

      {/* Inner bright core */}
      <Box
        position="fixed"
        left={0}
        top={0}
        transform={`translate(${position.x}px, ${position.y}px)`}
        width="200px"
        height="200px"
        borderRadius="50%"
        background="radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)"
        filter="blur(40px)"
        pointerEvents="none"
        zIndex={0}
        opacity={isHovering ? 0.5 : 0.2}
      />

      {/* Secondary gold glow */}
      <Box
        position="fixed"
        left={0}
        top={0}
        transform={`translate(${position.x + 50}px, ${position.y + 50}px)`}
        width="300px"
        height="300px"
        borderRadius="50%"
        background="radial-gradient(circle, rgba(245,208,118,0.08) 0%, transparent 70%)"
        filter="blur(50px)"
        pointerEvents="none"
        zIndex={0}
        opacity={isHovering ? 0.4 : 0.15}
      />
    </>
  );
}
