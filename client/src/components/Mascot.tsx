import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useMood } from "../lib/stores/useMood";

interface MascotProps {
  size?: number;
  showChat?: boolean;
}

const Mascot = ({ size = 450, showChat = false }: MascotProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { mood } = useMood();

  // Map 0-100 mood scale to labels
  const getMoodLabel = (): string => {
    if (mood <= 20) return "angry";
    if (mood <= 40) return "sad";
    if (mood <= 60) return "neutral";
    if (mood <= 80) return "calm";
    return "happy";
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const currentMood = getMoodLabel();

    // THREE.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Sphere geometry + material
    const geometry = new THREE.SphereGeometry(20, 32, 32);
    let sphereColor = new THREE.Color(0x6495ed);
    let emissiveColor = new THREE.Color(0x4169e1);
    switch (showChat ? "calm" : currentMood) {
      case "happy":
        sphereColor.set(0xffd700);
        emissiveColor.set(0xdaa520);
        break;
      case "calm":
        sphereColor.set(0x6495ed);
        emissiveColor.set(0x4169e1);
        break;
      case "neutral":
        sphereColor.set(0x808080);
        emissiveColor.set(0x8a8a8a);
        break;
      case "sad":
        sphereColor.set(0x7b68ee);
        emissiveColor.set(0x6354cb);
        break;
      case "angry":
        sphereColor.set(0xff6347);
        emissiveColor.set(0xe03420);
        break;
    }
    const material = new THREE.MeshBasicMaterial({ color: sphereColor, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 35;

    // Face features (eyes + mouth)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    [ -1.5, 1.5 ].forEach((xPos) => {
      const eyeGeo = new THREE.SphereGeometry(0.8, 16, 16);
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(xPos, 1, 20);
      sphere.add(eye);
    });

    let smile: THREE.Mesh;
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    if (currentMood === "sad" || currentMood === "angry") {
      const geo = new THREE.TorusGeometry(1.2, 0.3, 16, 32, Math.PI);
      smile = new THREE.Mesh(geo, mouthMat);
      smile.position.set(0, -2, 20);
      if (currentMood === "angry") {
        [ { x: -1.5, r: Math.PI / 6 }, { x: 1.5, r: -Math.PI / 6 } ].forEach(({ x, r }) => {
          const browGeo = new THREE.BoxGeometry(1.2, 0.3, 0.3);
          const brow = new THREE.Mesh(browGeo, mouthMat);
          brow.position.set(x, 2.2, 20);
          brow.rotation.z = r;
          sphere.add(brow);
        });
      }
    } else if (currentMood === "neutral") {
      const geo = new THREE.BoxGeometry(2.4, 0.4, 0.3);
      smile = new THREE.Mesh(geo, mouthMat);
      smile.position.set(0, -1.2, 20);
    } else {
      const geo = new THREE.TorusGeometry(1.2, 0.3, 16, 32, Math.PI);
      smile = new THREE.Mesh(geo, mouthMat);
      smile.position.set(0, -1, 20);
      smile.rotation.x = Math.PI;
    }
    sphere.add(smile);

    // Dragging control variables
    let isDragging = false;
    const prevMouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse.set(e.clientX, e.clientY);
    };

    const onMouseMoveDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      sphere.rotation.y += deltaX * 0.005;
      sphere.rotation.x += deltaY * 0.005;
      prevMouse.set(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch events for mobile
    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      prevMouse.set(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const { clientX, clientY } = e.touches[0];
      const deltaX = clientX - prevMouse.x;
      const deltaY = clientY - prevMouse.y;
      sphere.rotation.y += deltaX * 0.005;
      sphere.rotation.x += deltaY * 0.005;
      prevMouse.set(clientX, clientY);
    };
    const onTouchEnd = () => { isDragging = false; };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      // Only auto-rotate when not dragging
      if (!isDragging) {
        sphere.rotation.y += 0.003;
      }
      // Gentle float
      sphere.position.y = Math.sin(Date.now() * 0.001) * 0.5;
      renderer.render(scene, camera);
    };
    animate();

    // Add event listeners
    const dom = containerRef.current;
    dom.addEventListener("mousedown", onMouseDown);
    dom.addEventListener("mousemove", onMouseMoveDrag);
    window.addEventListener("mouseup", onMouseUp);

    dom.addEventListener("touchstart", onTouchStart);
    dom.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    dom.addEventListener("mouseenter", () => setIsHovered(true));
    dom.addEventListener("mouseleave", () => setIsHovered(false));

    // Cleanup
    return () => {
      dom.removeEventListener("mousedown", onMouseDown);
      dom.removeEventListener("mousemove", onMouseMoveDrag);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("touchstart", onTouchStart);
      dom.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      dom.removeEventListener("mouseenter", () => setIsHovered(true));
      dom.removeEventListener("mouseleave", () => setIsHovered(false));
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [size, mood, showChat]);

  return (
    <div
      ref={containerRef}
      className={`mascot-sphere ${isHovered ? "cursor-grab" : ""}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

export default Mascot;
