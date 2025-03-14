"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  Float,
  PerspectiveCamera,
  Stars,
  Cloud,
  Text,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { MotionConfig } from "framer-motion";
import * as THREE from "three";

// Define props interface
interface CityModelViewerProps {
  height?: string;
  isInteractive?: boolean;
  onError?: (error: Error) => void;
}

// Define a simple building component
const Building = ({ position, scale, color, height, delay }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Subtle hovering motion
      meshRef.current.position.y =
        Math.sin(clock.getElapsedTime() * 0.5 + delay) * 0.05 + height / 2;
    }
  });

  return (
    <mesh position={[position[0], position[1], position[2]]} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />

      {/* Building windows - limit the number for performance */}
      {Array.from({ length: Math.min(Math.floor(height * 2), 10) }).map(
        (_, i) => (
          <mesh
            key={i}
            position={[0, -height / 2 + i * 0.5 + 0.25, 0.51]}
            scale={[0.6, 0.3, 0.1]}
          >
            <boxGeometry />
            <meshStandardMaterial
              emissive={
                Math.random() > 0.3
                  ? new THREE.Color(0xffffaa)
                  : new THREE.Color(0x000000)
              }
              emissiveIntensity={Math.random() * 0.5 + 0.5}
            />
          </mesh>
        )
      )}
    </mesh>
  );
};

// Create a ground component with reflections
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={512} // Reduced for better performance
        mixBlur={1}
        mixStrength={50}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#101010"
        metalness={0.8}
        mirror={0.75}
      />
    </mesh>
  );
};

// Dynamic clouds floating above the city - reduced for performance
const CloudSystem = () => {
  return (
    <group position={[0, 15, 0]}>
      <Cloud position={[-10, 0, 0]} speed={0.2} opacity={0.5} />
      <Cloud position={[10, 5, -10]} speed={0.1} opacity={0.3} />
    </group>
  );
};

// Flying particles/drones in the city - reduced count for performance
const Particles = () => {
  const particles = useRef<THREE.Points>(null);
  const count = 50; // Reduced from 200 for better performance

  // Use useMemo to prevent recreating arrays on each render
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = Math.random() * 15;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;

      // Different colors for particles
      colors[i3] = Math.random();
      colors[i3 + 1] = Math.random();
      colors[i3 + 2] = Math.random();

      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    return [positions, colors, sizes];
  }, [count]);

  useFrame(({ clock }) => {
    if (particles.current) {
      const time = clock.getElapsedTime();
      const positionAttribute = particles.current.geometry.attributes.position;
      const array = positionAttribute.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Move particles in a pattern
        array[i3] += Math.sin(time * 0.1 + i) * 0.01;
        array[i3 + 1] += Math.cos(time * 0.05 + i) * 0.01;
        array[i3 + 2] += Math.sin(time * 0.05 + i) * 0.01;
      }

      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        transparent
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// City scene component
const CityScene = ({ isInteractive }: { isInteractive: boolean }) => {
  const { camera } = useThree();
  const [buildingScales, setBuildingScales] = useState<number[]>([]);

  // Use fewer buildings for better performance
  const buildings = useMemo(
    () => [
      // City center
      {
        position: [0, 0, 0],
        scale: [2, 1, 2],
        color: "#4361ee",
        height: 8,
        delay: 0,
      },
      {
        position: [3, 0, 1],
        scale: [1.5, 1, 1.5],
        color: "#3a0ca3",
        height: 6,
        delay: 0.1,
      },
      {
        position: [-3, 0, -1],
        scale: [1.5, 1, 1.5],
        color: "#7209b7",
        height: 7,
        delay: 0.2,
      },
      {
        position: [1, 0, 4],
        scale: [1.2, 1, 1.2],
        color: "#f72585",
        height: 4,
        delay: 0.3,
      },
      {
        position: [-2, 0, 3],
        scale: [1.2, 1, 1.2],
        color: "#4cc9f0",
        height: 5,
        delay: 0.15,
      },
      // Fewer outer buildings for performance
      {
        position: [6, 0, -3],
        scale: [1, 1, 1],
        color: "#4895ef",
        height: 3,
        delay: 0.4,
      },
      {
        position: [-6, 0, -4],
        scale: [1, 1, 1],
        color: "#f72585",
        height: 3.5,
        delay: 0.6,
      },
      {
        position: [-5, 0, 5],
        scale: [1, 1, 1],
        color: "#3a0ca3",
        height: 2,
        delay: 0.25,
      },
    ],
    []
  );

  // Camera animation
  useEffect(() => {
    if (!isInteractive) {
      // Set up camera animation for non-interactive mode
      const interval = setInterval(() => {
        const randomX = (Math.random() - 0.5) * 20;
        const randomZ = (Math.random() - 0.5) * 20;

        camera.position.set(randomX, 10 + Math.random() * 5, randomZ);
        camera.lookAt(0, 0, 0);
      }, 10000); // Change view every 10 seconds

      return () => clearInterval(interval);
    }
  }, [camera, isInteractive]);

  // Initialize building scales
  useEffect(() => {
    setBuildingScales(buildings.map(() => 0));

    // Animate buildings growing over time
    const timeouts: NodeJS.Timeout[] = [];

    buildings.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setBuildingScales((prev) => {
          const newScales = [...prev];
          newScales[index] = 1;
          return newScales;
        });
      }, index * 150);

      timeouts.push(timeout);
    });

    // Cleanup timeouts on unmount
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [buildings]);

  return (
    <>
      {/* Environment */}
      <color attach="background" args={["#041929"]} />
      <fog attach="fog" args={["#041929", 10, 50]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      {/* Controls - only enabled in interactive mode */}
      {isInteractive && (
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.5}
        />
      )}

      {/* Skybox */}
      <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />

      {/* Ground */}
      <Ground />

      {/* City buildings */}
      {buildings.map((building, index) => (
        <Building key={index} {...building} />
      ))}

      {/* City name - use pre-loaded font */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 12, 0]}
          color="#ffffff"
          fontSize={2}
          letterSpacing={0.1}
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          SMART CITY
        </Text>
      </Float>

      {/* Clouds */}
      <CloudSystem />

      {/* Animated particles/drones */}
      <Particles />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={45} />
    </>
  );
};

// Error boundary for Three.js
const ErrorFallback = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-4">
        <h3 className="text-xl font-bold mb-2">3D Visualization Error</h3>
        <p>Unable to load the 3D city model. Please try refreshing the page.</p>
      </div>
    </div>
  );
};

// Main component with error handling
const CityModelViewer: React.FC<CityModelViewerProps> = ({
  height = "400px",
  isInteractive = true,
  onError,
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (error: Error) => {
    console.error("CityModelViewer error:", error);
    setHasError(true);
    if (onError) onError(error);
  };

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div style={{ height, width: "100%" }}>
      <MotionConfig transition={{ duration: 0.5 }}>
        <Canvas
          shadows
          gl={{ antialias: true, powerPreference: "default" }}
          onCreated={({ gl }) => {
            gl.setClearColor("#041929");
          }}
          onError={(event: any) => {
            // Extract error information if available, or create a generic error
            const error = event?.error || new Error("Canvas rendering failed");
            handleError(error);
          }}
        >
          <CityScene isInteractive={isInteractive} />
        </Canvas>
      </MotionConfig>
    </div>
  );
};

export default CityModelViewer;
