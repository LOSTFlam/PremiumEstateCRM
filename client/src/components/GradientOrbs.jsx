import React, { useEffect, useRef } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

const GradientOrbs = () => {
  const canvasRef = useRef(null);
  const orbsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize orbs
    const initOrbs = () => {
      orbsRef.current = [
        {
          x: canvas.width * 0.3,
          y: canvas.height * 0.4,
          radiusX: canvas.width * 0.3,
          radiusY: canvas.height * 0.25,
          color1: 'rgba(212, 175, 55, 0.16)',
          color2: 'rgba(212, 175, 55, 0)',
          speedX: 0.3,
          speedY: 0.4,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
        },
        {
          x: canvas.width * 0.7,
          y: canvas.height * 0.6,
          radiusX: canvas.width * 0.25,
          radiusY: canvas.height * 0.2,
          color1: 'rgba(180, 83, 9, 0.14)',
          color2: 'rgba(180, 83, 9, 0)',
          speedX: 0.25,
          speedY: 0.35,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
        },
        {
          x: canvas.width * 0.5,
          y: canvas.height * 0.3,
          radiusX: canvas.width * 0.35,
          radiusY: canvas.height * 0.3,
          color1: 'rgba(148, 163, 184, 0.12)',
          color2: 'rgba(148, 163, 184, 0)',
          speedX: 0.2,
          speedY: 0.3,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
        },
      ];
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.0003;

      orbsRef.current.forEach((orb) => {
        // Update position with smooth sine wave motion
        orb.x = canvas.width * (0.3 + Math.sin(time * orb.speedX + orb.phaseX) * 0.2);
        orb.y = canvas.height * (0.4 + Math.cos(time * orb.speedY + orb.phaseY) * 0.15);

        // Create elliptical gradient
        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          Math.max(orb.radiusX, orb.radiusY)
        );
        gradient.addColorStop(0, orb.color1);
        gradient.addColorStop(1, orb.color2);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    initOrbs();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Box
      as="canvas"
      ref={canvasRef}
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={0}
      pointerEvents="none"
      opacity={0.6}
    />
  );
};

export default GradientOrbs;
