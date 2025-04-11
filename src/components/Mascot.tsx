import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useMood } from "../lib/stores/useMood";

interface MascotProps {
  size?: number;
  showChat?: boolean;
}

const Mascot = ({ size = 250, showChat = false }: MascotProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { mood } = useMood();

  // Maps the 0-100 mood scale to our mood categories
  const getMoodLabel = (): string => {
    if (mood <= 20) return "angry"; // 0-20: Terrible/Angry
    if (mood <= 40) return "sad"; // 21-40: Bad/Sad
    if (mood <= 60) return "neutral"; // 41-60: Meh/Neutral
    if (mood <= 80) return "calm"; // 61-80: Good/Calm
    return "happy"; // 81-100: Great/Happy
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const currentMood = getMoodLabel();

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(5, 32, 32);

    // Color based on mood
    let sphereColor = new THREE.Color(0x6495ed); // Default calm blue
    let emissiveColor = new THREE.Color(0x4169e1);

    if (showChat) {
      // If in chat mode, use a gentle blue glow
      sphereColor = new THREE.Color(0x6495ed);
      emissiveColor = new THREE.Color(0x4169e1);
    } else {
      // Set colors based on mood
      switch (currentMood) {
        case "happy":
          sphereColor = new THREE.Color(0xffd700); // Gold
          emissiveColor = new THREE.Color(0xdaa520);
          break;
        case "calm":
          sphereColor = new THREE.Color(0x6495ed); // Cornflower blue
          emissiveColor = new THREE.Color(0x4169e1);
          break;
        case "neutral":
          sphereColor = new THREE.Color(808080); // Dark gray
          emissiveColor = new THREE.Color(0x8a8a8a);
          break;
        case "sad":
          sphereColor = new THREE.Color(0x7b68ee); // Medium slate blue
          emissiveColor = new THREE.Color(0x6354cb);
          break;
        case "angry":
          sphereColor = new THREE.Color(0xff6347); // Tomato red
          emissiveColor = new THREE.Color(0xe03420);
          break;
        default:
          // Default to calm
          sphereColor = new THREE.Color(0x6495ed);
          emissiveColor = new THREE.Color(0x4169e1);
      }
    }

    // Create gradient material
    const material = new THREE.MeshPhongMaterial({
      color: sphereColor,
      emissive: emissiveColor,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.9,
      shininess: 90,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Position camera
    camera.position.z = 15;

    // Add face features
    // Left eye
    const leftEyeGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(leftEyeGeometry, eyeMaterial);
    leftEye.position.set(-1.5, 1, 4.5);
    sphere.add(leftEye);

    // Right eye
    const rightEyeGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const rightEye = new THREE.Mesh(rightEyeGeometry, eyeMaterial);
    rightEye.position.set(1.5, 1, 4.5);
    sphere.add(rightEye);

    // Create the mouth - using a thick black material for better visibility
    const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    let smile;

    // Determine appropriate facial expression based on mood
    if (currentMood === "sad" || currentMood === "angry") {
      // Sad/Angry mouth (inverted smile/frown)
      const smileGeometry = new THREE.TorusGeometry(1.2, 0.3, 16, 32, Math.PI);
      smile = new THREE.Mesh(smileGeometry, mouthMaterial);
      smile.position.set(0, -2, 4.7); // Moved slightly forward

      // Add angry eyebrows for angry mood
      if (currentMood === "angry") {
        const leftBrowGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.3);
        const leftBrow = new THREE.Mesh(leftBrowGeometry, mouthMaterial);
        leftBrow.position.set(-1.5, 2.2, 4.7); // Moved slightly forward
        leftBrow.rotation.z = Math.PI / 6; // Angle for angry look
        sphere.add(leftBrow);

        const rightBrowGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.3);
        const rightBrow = new THREE.Mesh(rightBrowGeometry, mouthMaterial);
        rightBrow.position.set(1.5, 2.2, 4.7); // Moved slightly forward
        rightBrow.rotation.z = -Math.PI / 6; // Angle for angry look
        sphere.add(rightBrow);
      }
    } else if (currentMood === "neutral") {
      // Neutral mouth (straight line)
      const mouthGeometry = new THREE.BoxGeometry(2.4, 0.4, 0.3);
      smile = new THREE.Mesh(mouthGeometry, mouthMaterial);
      smile.position.set(0, -1.2, 4.8); // Moved slightly forward
    } else {
      // Happy/Calm mouth (smile)
      const smileGeometry = new THREE.TorusGeometry(1.2, 0.3, 16, 32, Math.PI);
      smile = new THREE.Mesh(smileGeometry, mouthMaterial);
      smile.position.set(0, -1, 4.7); // Moved slightly forward
      smile.rotation.x = Math.PI;
    }
    sphere.add(smile);

    // Animation function
    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      // Gentle floating animation
      sphere.position.y = Math.sin(Date.now() * 0.001) * 0.5;

      // Gentle rotation
      sphere.rotation.y += 0.003;

      renderer.render(scene, camera);

      // Cleanup function
      return () => {
        cancelAnimationFrame(animationId);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    const cleanup = animate();

    // Mouse hover event for interactivity
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Move the sphere slightly towards the mouse
      sphere.rotation.x = y * 0.3;
      sphere.rotation.y = x * 0.3;

      // Change emissive intensity based on mouse position
      const distance = Math.sqrt(x * x + y * y);
      material.emissiveIntensity = 0.4 + distance * 0.2;
    };

    // Add event listeners
    containerRef.current.addEventListener("mousemove", handleMouseMove);
    containerRef.current.addEventListener("mouseenter", () =>
      setIsHovered(true),
    );
    containerRef.current.addEventListener("mouseleave", () =>
      setIsHovered(false),
    );

    return () => {
      cleanup();
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        containerRef.current.removeEventListener("mouseenter", () =>
          setIsHovered(true),
        );
        containerRef.current.removeEventListener("mouseleave", () =>
          setIsHovered(false),
        );
      }
    };
  }, [size, mood, showChat]); // Added mood as dependency to update when it changes

  return (
    <div
      ref={containerRef}
      className={`mascot-sphere ${isHovered ? "cursor-pointer" : ""}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

export default Mascot;
