import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

export default function SmokeEffect({ opacity = 0.15, speed = 0.5 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = [];
    let animationStartTime = Date.now();

    const resize = () => {
      // Limit canvas size to prevent performance issues on very large screens
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = Math.min(displayWidth, 1920); // Max width 1920
        canvas.height = Math.min(displayHeight, 1080); // Max height 1080
      }
    };

    resize();
    window.addEventListener("resize", resize);

    class SmokeParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 80 + 40; // Reduced max size for performance
        this.speedY = -(Math.random() * 0.5 + 0.3) * speed;
        this.speedX = (Math.random() - 0.5) * 0.5 * speed;
        this.opacity = Math.random() * opacity;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.life++;

        if (this.life > this.maxLife || this.y < -this.size) {
          this.reset();
        }

        const fadeIn = Math.min(this.life / 50, 1);
        const fadeOut = Math.max(1 - (this.life - this.maxLife + 50) / 50, 0);
        this.currentOpacity = this.opacity * fadeIn * fadeOut;
      }

      draw() {
        if (!ctx) return;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(200, 200, 220, ${this.currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(180, 180, 200, ${this.currentOpacity * 0.5})`);
        gradient.addColorStop(1, "rgba(160, 160, 180, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Reduce particle count for performance
    for (let i = 0; i < 8; i++) { // Reduced from 15 to 8 particles
      particles.push(new SmokeParticle());
    }

    const animate = () => {
      if (!ctx) return;
      
      // Limit FPS to prevent excessive CPU usage
      const now = Date.now();
      if (now - animationStartTime < 1000/30) { // Cap at 30fps
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      animationStartTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [opacity, speed]);

  return (
    <Box position="absolute" top={0} left={0} right={0} bottom={0} pointerEvents="none" zIndex={1}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </Box>
  );
}