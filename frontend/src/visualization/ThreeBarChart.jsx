import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { formatDuration } from "../utils/format";

const COLORS = [
  "#4f46e5", 
  "#8b5cf6", 
  "#0ea5e9", 
  "#10b981", 
  "#f59e0b", 
  "#f43f5e", 
  "#6366f1", 
];



const Bar = ({ position, height, color, label, value }) => {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (mesh.current) {
      
      mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, Math.max(0.1, height), delta * 4);
      mesh.current.position.y = (mesh.current.scale.y) / 2;

      
      const targetScaleXZ = hovered ? 1.05 : 1;
      mesh.current.scale.x = THREE.MathUtils.lerp(mesh.current.scale.x, targetScaleXZ, delta * 10);
      mesh.current.scale.z = THREE.MathUtils.lerp(mesh.current.scale.z, targetScaleXZ, delta * 10);

      
      const targetColor = new THREE.Color(color);
      if (hovered) {
        targetColor.offsetHSL(0, 0, 0.05);
      }
      mesh.current.material.color.lerp(targetColor, delta * 10);
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh
        ref={mesh}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        castShadow
        receiveShadow
        scale={[1, 0.01, 1]}
      >
        {}
        <boxGeometry args={[1.4, 1, 1.4]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3} 
          metalness={0.1} 
        />
      </mesh>

      {}
      <Text
        position={[0, 0.2, 1.8]}
        rotation={[-Math.PI / 4, 0, 0]}
        fontSize={0.45}
        color={hovered ? "#ffffff" : "#cbd5e1"}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {}
      {hovered && (
        <Html position={[0, height + 0.5, 0]} center distanceFactor={15} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
          <div className="bg-slate-900/95 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-2xl border border-slate-700 whitespace-nowrap transform -translate-y-full tracking-wide">
            {formatDuration(value)}
          </div>
        </Html>
      )}
    </group>
  );
};

const Scene = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.total), 1);
  const MAX_HEIGHT = 7;
  const SPACING = 2.5;

  const totalWidth = (data.length - 1) * SPACING;
  const startX = -totalWidth / 2;

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-10, 10, -5]}
        intensity={0.5}
        color="#e0e7ff"
      />

      {}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {data.map((item, index) => {
        const normalizedHeight = Math.max((item.total / maxValue) * MAX_HEIGHT, 0.2);
        const xPos = startX + (index * SPACING);

        return (
          <Bar
            key={index}
            position={[xPos, 0, 0]}
            height={normalizedHeight}
            color={COLORS[index % COLORS.length]}
            label={item.day}
            value={item.total}
          />
        );
      })}
    </>
  );
};

const ThreeBarChart = ({ data = [] }) => {
  return (
    <div className="w-full h-[450px] rounded-2xl bg-slate-950 shadow-inner relative border border-slate-800">
      <Canvas
        shadows
        camera={{ position: [0, 8, 22], fov: 35 }} 
        dpr={[1, 2]}
      >
        <CameraSetup />
        <fog attach="fog" args={['#020617', 15, 50]} />
        <Scene data={data} />
      </Canvas>
    </div>
  );
};

const CameraSetup = () => {
  useFrame(({ camera }) => {
    camera.lookAt(0, 3, 0);
  });
  return null;
};

export default ThreeBarChart;
