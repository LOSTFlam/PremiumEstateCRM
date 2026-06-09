import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    // Create particle material with golden color
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0xd4af37,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    // Create particle system
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create geometric shapes (buildings abstraction)
    const shapes = [];
    const shapeGeometries = [
      new THREE.BoxGeometry(0.3, 0.8, 0.3),
      new THREE.BoxGeometry(0.4, 0.6, 0.4),
      new THREE.BoxGeometry(0.25, 1, 0.25),
      new THREE.ConeGeometry(0.2, 0.6, 4),
    ];

    const shapeMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });

    for (let i = 0; i < 30; i++) {
      const geometry = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
      const shape = new THREE.Mesh(geometry, shapeMaterial);

      shape.position.x = (Math.random() - 0.5) * 12;
      shape.position.y = (Math.random() - 0.5) * 8;
      shape.position.z = (Math.random() - 0.5) * 8 - 4;

      shape.rotation.x = Math.random() * Math.PI;
      shape.rotation.y = Math.random() * Math.PI;

      shapes.push({
        mesh: shape,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.002,
          y: (Math.random() - 0.5) * 0.002,
        },
        floatSpeed: Math.random() * 0.005 + 0.002,
        floatOffset: Math.random() * Math.PI * 2,
      });

      scene.add(shape);
    }

    // Create connecting lines
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.1,
    });

    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(100 * 6);

    for (let i = 0; i < 100; i++) {
      const idx = i * 6;
      linePositions[idx] = (Math.random() - 0.5) * 10;
      linePositions[idx + 1] = (Math.random() - 0.5) * 10;
      linePositions[idx + 2] = (Math.random() - 0.5) * 10;
      linePositions[idx + 3] = (Math.random() - 0.5) * 10;
      linePositions[idx + 4] = (Math.random() - 0.5) * 10;
      linePositions[idx + 5] = (Math.random() - 0.5) * 10;
    }

    linesGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lines);

    camera.position.z = 5;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate particles
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0002;

      // Animate shapes
      shapes.forEach((shapeObj) => {
        shapeObj.mesh.rotation.x += shapeObj.rotationSpeed.x;
        shapeObj.mesh.rotation.y += shapeObj.rotationSpeed.y;
        shapeObj.mesh.position.y += Math.sin(time + shapeObj.floatOffset) * shapeObj.floatSpeed;
      });

      // Subtle camera movement based on mouse
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      // Update lines
      const positions = linesGeometry.attributes.position.array;
      for (let i = 0; i < 100; i++) {
        const idx = i * 6;
        positions[idx] += (Math.random() - 0.5) * 0.01;
        positions[idx + 1] += (Math.random() - 0.5) * 0.01;
        positions[idx + 2] += (Math.random() - 0.5) * 0.01;
        positions[idx + 3] += (Math.random() - 0.5) * 0.01;
        positions[idx + 4] += (Math.random() - 0.5) * 0.01;
        positions[idx + 5] += (Math.random() - 0.5) * 0.01;
      }
      linesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      shapeMaterial.dispose();
      linesMaterial.dispose();
      linesGeometry.dispose();
      shapeGeometries.forEach((geom) => geom.dispose());
    };
  }, []);

  return (
    <div ref={containerRef} id="three-canvas" className="fixed inset-0 z-0 pointer-events-none" />
  );
}
