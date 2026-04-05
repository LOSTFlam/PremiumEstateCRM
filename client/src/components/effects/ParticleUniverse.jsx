import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleUniverse({
  density = 150,
  speed = 0.3,
  connectionRadius = 120,
  colorScheme = "gold",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const positions = [];
    const velocities = [];

    for (let i = 0; i < density; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      velocities.push(
        (Math.random() - 0.5) * speed * 0.01,
        (Math.random() - 0.5) * speed * 0.01,
        (Math.random() - 0.5) * speed * 0.01
      );
    }

    particlesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: colorScheme === "gold" ? 0xd4af37 : 0xe5e7eb,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const linesMaterial = new THREE.LineBasicMaterial({
      color: colorScheme === "gold" ? 0xd4af37 : 0x9ca3af,
      transparent: true,
      opacity: 0.15,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 15;

    let mouseX = 0,
      mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      const pos = particlesGeometry.attributes.position.array;
      for (let i = 0; i < density; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3 + 2] += velocities[i * 3 + 2];

        if (Math.abs(pos[i * 3]) > 10) velocities[i * 3] *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -1;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      particleSystem.rotation.x += (mouseY * 0.0005 - particleSystem.rotation.x) * 0.05;
      particleSystem.rotation.y += (mouseX * 0.0005 - particleSystem.rotation.y) * 0.05;
      particleSystem.position.y = Math.sin(Date.now() * 0.0003) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [density, speed, connectionRadius, colorScheme]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
}
