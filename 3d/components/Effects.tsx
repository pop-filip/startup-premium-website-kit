'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================
// 3D TEXT — For hero sections and headings
//
// NOTE: Requires a font JSON file.
// Convert fonts at: https://gero3.github.io/facetype.js/
// Or use Drei's built-in fonts.
//
// Usage:
//   <Text3DTitle text="Hello" />
//   <Text3DTitle text="Brand" color="#6366F1" metallic />
// ============================================================

interface Text3DProps {
  text: string;
  color?: string;
  size?: number;
  height?: number;
  position?: [number, number, number];
  metallic?: boolean;
  glass?: boolean;
  fontUrl?: string;
  centered?: boolean;
}

export function Text3DTitle({
  text,
  color = '#1B2A4A',
  size = 1,
  height = 0.3,
  position = [0, 0, 0],
  metallic = false,
  glass = false,
  fontUrl = '/fonts/inter-bold.json',  // Put your font JSON in /public/fonts/
  centered = true,
}: Text3DProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const content = (
    <Text3D
      ref={meshRef}
      font={fontUrl}
      size={size}
      height={height}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.02}
      bevelOffset={0}
      bevelSegments={5}
      position={position}
      castShadow
    >
      {text}
      {glass ? (
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          roughness={0.1}
          chromaticAberration={0.05}
          anisotropy={0.3}
          color={color}
        />
      ) : (
        <meshStandardMaterial
          color={color}
          metalness={metallic ? 0.9 : 0.1}
          roughness={metallic ? 0.1 : 0.5}
        />
      )}
    </Text3D>
  );

  return centered ? <Center>{content}</Center> : content;
}


// ============================================================
// PARTICLES — Floating particles for backgrounds
//
// Usage:
//   <Particles count={500} color="#6366F1" />
//   <Particles count={200} spread={10} speed={0.3} size={0.03} />
// ============================================================

interface ParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
  speed?: number;
  opacity?: number;
}

export function Particles({
  count = 500,
  color = '#6366F1',
  size = 0.02,
  spread = 10,
  speed = 0.2,
  opacity = 0.6,
}: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      velocities[i * 3]     = (Math.random() - 0.5) * speed * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * speed * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed * 0.01;
    }

    return { positions, velocities };
  }, [count, spread, speed]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const half = spread / 2;

    for (let i = 0; i < count; i++) {
      pos[i * 3]     += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap around boundaries
      for (let j = 0; j < 3; j++) {
        if (pos[i * 3 + j] > half) pos[i * 3 + j] = -half;
        if (pos[i * 3 + j] < -half) pos[i * 3 + j] = half;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}


// ============================================================
// FLOATING SHAPES — Decorative background elements
//
// Usage:
//   <FloatingShapes count={15} />
// ============================================================

interface FloatingShapesProps {
  count?: number;
  colors?: string[];
  spread?: number;
  minSize?: number;
  maxSize?: number;
}

export function FloatingShapes({
  count = 15,
  colors = ['#6366F1', '#818CF8', '#A5B4FC', '#3B82F6', '#8B5CF6'],
  spread = 12,
  minSize = 0.2,
  maxSize = 0.8,
}: FloatingShapesProps) {
  const shapes = useMemo(() => {
    const types = ['box', 'sphere', 'octahedron', 'torus'] as const;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      type: types[Math.floor(Math.random() * types.length)],
      position: [
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.5,
      ] as [number, number, number],
      scale: minSize + Math.random() * (maxSize - minSize),
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.5 + Math.random() * 2,
      rotationIntensity: 0.2 + Math.random() * 0.5,
      floatIntensity: 0.3 + Math.random() * 0.7,
    }));
  }, [count, colors, spread, minSize, maxSize]);

  return (
    <group>
      {shapes.map((shape) => (
        <Float
          key={shape.id}
          speed={shape.speed}
          rotationIntensity={shape.rotationIntensity}
          floatIntensity={shape.floatIntensity}
        >
          <mesh position={shape.position} scale={shape.scale} castShadow>
            {shape.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
            {shape.type === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
            {shape.type === 'octahedron' && <octahedronGeometry args={[0.5]} />}
            {shape.type === 'torus' && <torusGeometry args={[0.5, 0.2, 16, 32]} />}
            <meshStandardMaterial
              color={shape.color}
              metalness={0.3}
              roughness={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}


// ============================================================
// GRID FLOOR — Infinite-looking grid (great for product pages)
//
// Usage:
//   <GridFloor />
//   <GridFloor color="#6366F1" fadeDistance={30} />
// ============================================================

export function GridFloor({
  size = 100,
  divisions = 100,
  color = '#E5E5E5',
  fadeDistance = 25,
  position = [0, -0.5, 0] as [number, number, number],
}: {
  size?: number;
  divisions?: number;
  color?: string;
  fadeDistance?: number;
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      <gridHelper args={[size, divisions, color, color]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#fafafa" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
