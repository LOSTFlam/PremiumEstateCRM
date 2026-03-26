import React, { useEffect, useRef } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, radius: 200 });
  const particleColor = useColorModeValue('rgba(100, 200, 150,', 'rgba(134, 239, 172,');
  const equipmentColor = useColorModeValue('rgba(50, 80, 70,', 'rgba(80, 120, 100,');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let equipment = [];

    // Construction equipment silhouette
    class ConstructionEquipment {
      constructor(x, y, type, scale) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.baseScale = scale;
        this.scale = scale;
        this.opacity = Math.random() * 0.08 + 0.03;
        this.speed = Math.random() * 0.2 + 0.1;
        this.phase = Math.random() * Math.PI * 2;
        this.moveRange = 30;
        this.baseY = y;
      }

      update(time) {
        this.y = this.baseY + Math.sin(time * this.speed + this.phase) * this.moveRange;
        this.scale = this.baseScale + Math.sin(time * 0.5 + this.phase) * 0.03;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = equipmentColor + '1)';

        if (this.type === 'crane') {
          ctx.beginPath();
          ctx.rect(-5, -80, 10, 80);
          ctx.fill();
          ctx.rect(-60, -80, 120, 6);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(50, -74);
          ctx.lineTo(50, -20);
          ctx.lineWidth = 2;
          ctx.strokeStyle = equipmentColor + '0.8)';
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(50, -15, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === 'excavator') {
          ctx.beginPath();
          ctx.rect(-40, -30, 80, 30);
          ctx.fill();
          ctx.rect(-20, -50, 30, 25);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-30, -35);
          ctx.lineTo(-70, -60);
          ctx.lineTo(-80, -40);
          ctx.lineWidth = 8;
          ctx.strokeStyle = equipmentColor + '1)';
          ctx.stroke();
          ctx.rect(-45, 0, 90, 10);
          ctx.fill();
        } else if (this.type === 'truck') {
          ctx.beginPath();
          ctx.rect(-30, -40, 35, 40);
          ctx.fill();
          ctx.rect(-70, -30, 40, 30);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-55, 10, 10, 0, Math.PI * 2);
          ctx.arc(-15, 10, 10, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Initialize construction equipment
    const initEquipment = () => {
      equipment = [];
      const numEquipment = Math.floor(canvas.width / 400);
      for (let i = 0; i < numEquipment; i++) {
        const types = ['crane', 'excavator', 'truck'];
        const type = types[i % types.length];
        const x = (i * 400) + 200 + Math.random() * 100;
        const y = canvas.height * 0.75 + Math.random() * canvas.height * 0.15;
        const scale = 0.6 + Math.random() * 0.4;
        equipment.push(new ConstructionEquipment(x, y, type, scale));
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initEquipment();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, radius: 250 };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1.5;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += 0.05;
        this.size += Math.sin(this.pulse) * 0.05;

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

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
      }

      draw() {
        const safeSize = Math.max(1, this.size);
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, safeSize * 2);
        gradient.addColorStop(0, `${particleColor} ${this.opacity})`);
        gradient.addColorStop(1, `${particleColor} 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, safeSize * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = `${particleColor} ${this.opacity})`;
      }
    }

    const init = () => {
      particles = [];
      const density = 12000;
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / density);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.0005;
      const orb1X = canvas.width * (0.3 + Math.sin(time) * 0.1);
      const orb1Y = canvas.height * (0.4 + Math.cos(time * 0.8) * 0.15);
      const orb2X = canvas.width * (0.7 + Math.cos(time * 0.7) * 0.12);
      const orb2Y = canvas.height * (0.6 + Math.sin(time * 0.6) * 0.1);

      const orb1Gradient = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 400);
      orb1Gradient.addColorStop(0, 'rgba(100, 200, 150, 0.15)');
      orb1Gradient.addColorStop(1, 'rgba(100, 200, 150, 0)');
      ctx.fillStyle = orb1Gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const orb2Gradient = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 350);
      orb2Gradient.addColorStop(0, 'rgba(147, 51, 234, 0.12)');
      orb2Gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
      ctx.fillStyle = orb2Gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      equipment.forEach((item) => {
        item.update(time * 0.001);
        item.draw(ctx);
      });

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            const opacity = 0.25 * (1 - distance / 140);
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
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

      const mouseGlow = ctx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, mouseRef.current.radius);
      mouseGlow.addColorStop(0, 'rgba(100, 200, 150, 0.08)');
      mouseGlow.addColorStop(1, 'rgba(100, 200, 150, 0)');
      ctx.fillStyle = mouseGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    initEquipment();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColor, equipmentColor]);

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
