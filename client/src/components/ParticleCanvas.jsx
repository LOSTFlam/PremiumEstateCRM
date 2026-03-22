import React, { useEffect, useRef } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, radius: 200 });
  const particleColor = useColorModeValue('rgba(100, 200, 150,', 'rgba(134, 239, 172,');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas not ready');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('Canvas context not available');
      return;
    }

    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse movement
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        radius: 250,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Particle class with enhanced effects
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1.5;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.hue = Math.random() * 60 + 140; // Green-cyan range
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulsing effect
        this.pulse += 0.05;
        this.size += Math.sin(this.pulse) * 0.05;

        // Mouse interaction - stronger repulsion
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRef.current.radius) {
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
          this.opacity = Math.min(1, this.opacity + force * 0.3);
        } else {
          this.opacity = Math.max(0.3, this.opacity - 0.01);
        }

        // Boundary check with bounce
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
      }

      draw() {
        const safeSize = Math.max(1, this.size); // Ensure size is never negative or zero
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, safeSize * 2);
        gradient.addColorStop(0, `${particleColor} ${this.opacity})`);
        gradient.addColorStop(1, `${particleColor} 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, safeSize * 2, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = `${particleColor} ${this.opacity})`;
      }
    }

    // Initialize particles
    const init = () => {
      particles = [];
      const density = 12000;
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / density);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient orbs in background
      const time = Date.now() * 0.0005;
      const orb1X = canvas.width * (0.3 + Math.sin(time) * 0.1);
      const orb1Y = canvas.height * (0.4 + Math.cos(time * 0.8) * 0.15);
      const orb2X = canvas.width * (0.7 + Math.cos(time * 0.7) * 0.12);
      const orb2Y = canvas.height * (0.6 + Math.sin(time * 0.6) * 0.1);

      // First orb - cyan
      const orb1Gradient = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 400);
      orb1Gradient.addColorStop(0, 'rgba(100, 200, 150, 0.15)');
      orb1Gradient.addColorStop(1, 'rgba(100, 200, 150, 0)');
      ctx.fillStyle = orb1Gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Second orb - purple
      const orb2Gradient = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 350);
      orb2Gradient.addColorStop(0, 'rgba(147, 51, 234, 0.12)');
      orb2Gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
      ctx.fillStyle = orb2Gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections with enhanced effect
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            const opacity = 0.25 * (1 - distance / 140);
            const gradient = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            );
            gradient.addColorStop(0, `${particleColor} ${opacity})`);
            gradient.addColorStop(1, `${particleColor} ${opacity * 0.5})`);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw mouse glow
      const mouseGlow = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        mouseRef.current.radius
      );
      mouseGlow.addColorStop(0, 'rgba(100, 200, 150, 0.08)');
      mouseGlow.addColorStop(1, 'rgba(100, 200, 150, 0)');
      ctx.fillStyle = mouseGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColor]);

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
      opacity={0.8}
    />
  );
};

export default ParticleCanvas;
