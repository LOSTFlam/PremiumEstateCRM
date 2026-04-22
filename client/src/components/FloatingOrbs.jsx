import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

export default function FloatingOrbs({
  count = 8,
  colors = ["#4F46E5", "#7C3AED", "#EC4899", "#F59E0B"],
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const orbs = [];

    for (let i = 0; i < count; i++) {
      const orb = document.createElement("div");
      const size = Math.random() * 300 + 150;
      const color = colors[Math.floor(Math.random() * colors.length)];

      orb.style.position = "absolute";
      orb.style.width = `${size}px`;
      orb.style.height = `${size}px`;
      orb.style.borderRadius = "50%";
      orb.style.background = `radial-gradient(circle at 30% 30%, ${color}40, ${color}10, transparent)`;
      orb.style.filter = "blur(60px)";
      orb.style.opacity = "0.6";
      orb.style.pointerEvents = "none";

      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      orb.style.left = `${startX}%`;
      orb.style.top = `${startY}%`;

      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 5;

      orb.style.animation = `float-orb-${i} ${duration}s ease-in-out ${delay}s infinite`;

      const keyframes = `
        @keyframes float-orb-${i} {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${0.8 + Math.random() * 0.4});
          }
          50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${0.8 + Math.random() * 0.4});
          }
          75% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${0.8 + Math.random() * 0.4});
          }
        }
      `;

      const style = document.createElement("style");
      style.textContent = keyframes;
      document.head.appendChild(style);

      container.appendChild(orb);
      orbs.push({ element: orb, style });
    }

    return () => {
      orbs.forEach(({ element, style }) => {
        element.remove();
        style.remove();
      });
    };
  }, [count, colors]);

  return (
    <Box
      ref={containerRef}
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      pointerEvents="none"
      zIndex={0}
    />
  );
}
