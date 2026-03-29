import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

/**
 * Animated background with simple house/plot silhouettes for visual appeal
 * Non-interactive, just decorative animation
 */
const PropertyBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let houses = [];

    // Simple house silhouette
    class House {
      constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.baseScale = scale;
        this.scale = scale;
        this.opacity = Math.random() * 0.1 + 0.05;
        this.speed = Math.random() * 0.3 + 0.1;
        this.phase = Math.random() * Math.PI * 2;
      }

      update(time) {
        // Gentle floating animation
        this.scale = this.baseScale + Math.sin(time * this.speed + this.phase) * 0.05;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.opacity;

        // Draw simple house silhouette
        ctx.fillStyle = 'rgba(212, 175, 55, 1)';
        
        // House body
        ctx.beginPath();
        ctx.rect(-30, -20, 60, 40);
        ctx.fill();

        // Roof
        ctx.beginPath();
        ctx.moveTo(-35, -20);
        ctx.lineTo(0, -50);
        ctx.lineTo(35, -20);
        ctx.closePath();
        ctx.fill();

        // Chimney
        ctx.beginPath();
        ctx.rect(15, -40, 8, 20);
        ctx.fill();

        ctx.restore();
      }
    }

    const initHouses = () => {
      houses = [];
      const numHouses = Math.floor(canvas.width / 150);
      
      for (let i = 0; i < numHouses; i++) {
        const x = i * 150 + Math.random() * 50;
        const y = canvas.height * 0.7 + Math.random() * canvas.height * 0.2;
        const scale = 0.5 + Math.random() * 0.5;
        houses.push(new House(x, y, scale));
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initHouses();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0.07)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw houses
      houses.forEach((house) => {
        house.update(time);
        house.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    initHouses();
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
      opacity={0.4}
    />
  );
};

export default PropertyBackground;
