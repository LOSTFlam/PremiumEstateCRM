import { useRef, useEffect, useState } from "react";

export const useMagneticPhysics = ({
  strength = 0.15,
  radius = 150,
  smoothness = 0.08,
  repel = false,
}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationFrame;
    let targetX = 0, targetY = 0;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        setIsHovered(true);
        const force = 1 - (distance / radius);
        const direction = repel ? -1 : 1;

        targetX = dx * strength * force * direction;
        targetY = dy * strength * force * direction;
      } else {
        setIsHovered(false);
        targetX = 0;
        targetY = 0;
      }
    };

    const animate = () => {
      setPosition((prev) => ({
        x: prev.x + (targetX - prev.x) * smoothness,
        y: prev.y + (targetY - prev.y) * smoothness,
      }));
      animationFrame = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [strength, radius, smoothness, repel]);

  return {
    ref,
    style: {
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      transition: isHovered ? "none" : "transform 0.3s ease-out",
      willChange: "transform",
    },
    isHovered,
  };
};

export default useMagneticPhysics;
