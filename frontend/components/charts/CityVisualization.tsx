"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Types for sensor data
interface SensorData {
  _id: string;
  type: string;
  value: number;
  status: "normal" | "warning" | "critical";
  coordinates: [number, number];
}

// Props for the 3D visualization component
interface CityVisualizationProps {
  sensorData?: SensorData[];
  width?: string;
  height?: string;
}

// Helper function to map status to color
const getStatusColor = (status: string): string => {
  switch (status) {
    case "critical":
      return "#EF4444"; // red
    case "warning":
      return "#F59E0B"; // yellow
    default:
      return "#10B981"; // green
  }
};

// Helper function to map sensor type to shape and size
const getSensorTypeConfig = (
  type: string
): { scale: number; shape: string } => {
  switch (type) {
    case "traffic":
      return { scale: 1.2, shape: "box" };
    case "air_quality":
      return { scale: 1.0, shape: "sphere" };
    case "energy":
      return { scale: 1.5, shape: "box" };
    case "water":
      return { scale: 0.8, shape: "sphere" };
    default:
      return { scale: 1.0, shape: "box" };
  }
};

// Sensor visualization component
const SensorEntity = ({
  sensor,
  index,
}: {
  sensor: SensorData;
  index: number;
}) => {
  const { type, value, status, coordinates } = sensor;
  const config = getSensorTypeConfig(type);
  const color = getStatusColor(status);

  // Calculate position based on coordinates
  // Transforming geo coordinates to scene coordinates
  const x = (coordinates[0] + 74) * 10 - 740;
  const z = (coordinates[1] - 40) * 10 - 41;

  // Add some vertical animation based on value
  const meshRef = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Gentle floating animation
    meshRef.current.position.y =
      config.scale + Math.sin(state.clock.elapsedTime + index) * 0.2;

    // Pulse effect when hovering
    if (hover) {
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
    }
  });

  // Render different shapes based on sensor type
  return (
    <group position={[x, config.scale, z]}>
      {config.shape === "box" ? (
        <Box
          ref={meshRef}
          args={[config.scale, config.scale, config.scale]}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <meshStandardMaterial color={color} />
        </Box>
      ) : (
        <Sphere
          ref={meshRef}
          args={[config.scale / 2, 16, 16]}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <meshStandardMaterial color={color} />
        </Sphere>
      )}

      {hover && (
        <Text
          position={[0, config.scale * 2, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {`${type}: ${value}`}
        </Text>
      )}
    </group>
  );
};

// City grid component
const CityGrid = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Main platform */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[50, 50, "#475569", "#475569"]} />
    </group>
  );
};

// Main component
const CityVisualization: React.FC<CityVisualizationProps> = ({
  sensorData = [],
  width = "100%",
  height = "100%",
}) => {
  const [data, setData] = useState<SensorData[]>([]);

  // Fetch data if not provided via props
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:3001/iot/sensor-data");
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (error) {
        console.error(
          "Error fetching sensor data for 3D visualization:",
          error
        );
      }
    };

    if (sensorData.length > 0) {
      setData(sensorData);
    } else {
      fetchSensorData();
    }
  }, [sensorData]);

  return (
    <div style={{ width, height, position: "relative" }}>
      <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <CityGrid />

        {data.map((sensor, index) => (
          <SensorEntity key={sensor._id} sensor={sensor} index={index} />
        ))}

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
        />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 rounded-md p-2 shadow-md text-xs">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Normal</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span>Warning</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
};

export default CityVisualization;
