// client/src/components/MiniMascot.tsx
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface MiniMascotProps {
  size?: number;
}

const MiniMascot: React.FC<MiniMascotProps> = ({ size = 80 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    // disable default touch gestures on the canvas
    renderer.domElement.style.touchAction = 'none';

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Sphere mascot
    const geometry = new THREE.SphereGeometry(20, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: true});
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // Face (eyes and smile)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    [ -1.5, 1.5 ].forEach((x) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(1, 3, 3), eyeMat);
      eye.position.set(x, 1, 20);
      sphere.add(eye);
    });
    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.5, 10, 100, Math.PI),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    smile.position.set(0, -2, 20);
    smile.rotation.x = Math.PI;
    sphere.add(smile);

    // Rotation control variables
    let isDragging = false;
    const prevMouse = new THREE.Vector2();
    const baseSpin = 0.015;

    // Pointer handlers
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse.set(e.clientX, e.clientY);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      sphere.rotation.y += deltaX * 0.002;
      sphere.rotation.x += deltaY * 0.002;
      prevMouse.set(e.clientX, e.clientY);
    };
    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    // Touch handlers (for older browsers or Safari without full PointerEvent support)
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isDragging = true;
      const touch = e.touches[0];
      prevMouse.set(touch.clientX, touch.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      e.preventDefault(); // prevent page scroll
      const touch = e.touches[0];
      const deltaX = touch.clientX - prevMouse.x;
      const deltaY = touch.clientY - prevMouse.y;
      sphere.rotation.y += deltaX * 0.003;
      sphere.rotation.x += deltaY * 0.003;
      prevMouse.set(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    // Attach event listeners
    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchcancel', onTouchEnd);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (!isDragging) sphere.rotation.y += baseSpin;
      sphere.position.y = Math.sin(Date.now() * 0.001) * 0.5;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);

      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: size,
        height: size,
        cursor: isHovered ? 'grab' : 'auto',
        // also disable browser gestures at the wrapper level
        touchAction: 'none',
      }}
    />
  );
};

export default MiniMascot;
