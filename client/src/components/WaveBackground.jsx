import React, { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

/**
 * Animated wave background effect
 */
const WaveBackground = ({
  colors = ["rgba(59, 130, 246, 0.1)", "rgba(139, 92, 246, 0.1)", "rgba(236, 72, 153, 0.1)"],
  speed = 0.02,
  amplitude = 20,
  frequency = 0.01,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const drawWave = (offset, color, yOffset) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2 + yOffset);

      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin(x * frequency + offset) * amplitude + canvas.height / 2 + yOffset;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += speed;

      // Draw multiple waves
      drawWave(timeRef.current, colors[0], -50);
      drawWave(timeRef.current + 1, colors[1], 0);
      drawWave(timeRef.current + 2, colors[2], 50);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resize);
    };
  }, [colors, speed, amplitude, frequency]);

  return (
    <Box
      as="canvas"
      ref={canvasRef}
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      pointerEvents="none"
      zIndex={0}
    />
  );
};

export default WaveBackground;
