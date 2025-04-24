// client/src/components/MiniMascot.tsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface MiniMascotProps {
  size?: number;
}

const MiniMascot: React.FC<MiniMascotProps> = ({ size = 80 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Sphere
    const geometry = new THREE.SphereGeometry(20, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    const point = new THREE.PointLight(0xffffff, 0.8);
    point.position.set(50, 50, 50);
    scene.add(ambient, point);

    // Face (eyes and smile)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    [ -1.5, 1.5 ].forEach(x => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(1, 3, 3), eyeMat);
      eye.position.set(x, 1, 20);
      sphere.add(eye);
    });
    const smileGeom = new THREE.TorusGeometry(2.3, 0.5, 10, 100, Math.PI);
    const smile = new THREE.Mesh(smileGeom, new THREE.MeshBasicMaterial({ color: 0x000000 }));
    smile.position.set(0, -2, 20);
    smile.rotation.x = Math.PI;
    sphere.add(smile);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      sphere.position.y = Math.sin(Date.now() * 0.001) * 0.5;
      sphere.rotation.y += 0.015;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [size]);

  return <div ref={containerRef} style={{ width: size, height: size }} />;
};

export default MiniMascot;