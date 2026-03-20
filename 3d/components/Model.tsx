'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================
// MODEL LOADER — Load any .glb/.gltf model
//
// Usage:
//   <Model url="/models/shoe.glb" />
//   <Model url="/models/car.glb" scale={2} autoRotate />
//   <Model url="/models/character.glb" animation="Walk" />
//
// Free models: https://sketchfab.com, https://poly.pizza
// Convert to GLB: https://gltf.report
// Compress with Draco: npx gltfjsx model.glb --transform
// ============================================================

interface ModelProps {
  url: string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  autoRotate?: boolean;
  rotateSpeed?: number;
  animation?: string;       // Name of animation clip to play
  floatEnabled?: boolean;   // Gentle floating effect
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
  castShadow?: boolean;
  receiveShadow?: boolean;
  centered?: boolean;
}

export function Model({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = false,
  rotateSpeed = 0.5,
  animation,
  floatEnabled = false,
  onClick,
  onHover,
  castShadow = true,
  receiveShadow = false,
  centered = true,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, groupRef);
  const [hovered, setHovered] = useState(false);

  // Clone scene so multiple instances work independently
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  // Apply shadows to all meshes
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
      }
    });
  }, [clonedScene, castShadow, receiveShadow]);

  // Play animation
  useEffect(() => {
    if (!animation || !actions) return;

    const clip = actions[animation];
    if (clip) {
      clip.reset().fadeIn(0.5).play();
      return () => { clip.fadeOut(0.5); };
    } else {
      console.warn(`Animation "${animation}" not found. Available: ${names.join(', ')}`);
    }
  }, [animation, actions, names]);

  // Auto-rotate
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * rotateSpeed;
    }
  });

  // Hover cursor
  useEffect(() => {
    if (onClick || onHover) {
      document.body.style.cursor = hovered ? 'pointer' : 'auto';
    }
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, onClick, onHover]);

  const handlePointerOver = () => {
    setHovered(true);
    onHover?.(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(false);
  };

  const content = (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {centered ? (
        <Center>
          <primitive object={clonedScene} />
        </Center>
      ) : (
        <primitive object={clonedScene} />
      )}
    </group>
  );

  if (floatEnabled) {
    return (
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        {content}
      </Float>
    );
  }

  return content;
}


// Preload model for faster loading
Model.preload = (url: string) => useGLTF.preload(url);


// ============================================================
// PRIMITIVE SHAPES — Quick placeholders / decorative elements
// ============================================================

interface ShapeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  wireframe?: boolean;
  castShadow?: boolean;
  onClick?: () => void;
}

export function Box({ position = [0, 0, 0], color = '#6366F1', scale = 1, metalness = 0.3, roughness = 0.5, wireframe = false, castShadow = true, onClick, ...props }: ShapeProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (hovered && ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      scale={hovered ? scale * 1.1 : scale}
      castShadow={castShadow}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} wireframe={wireframe} />
    </mesh>
  );
}

export function Sphere({ position = [0, 0, 0], color = '#6366F1', scale = 1, metalness = 0.5, roughness = 0.2, wireframe = false, castShadow = true, ...props }: ShapeProps) {
  return (
    <mesh position={position} scale={scale} castShadow={castShadow}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} wireframe={wireframe} />
    </mesh>
  );
}

export function Torus({ position = [0, 0, 0], color = '#6366F1', scale = 1, metalness = 0.5, roughness = 0.2, castShadow = true, ...props }: ShapeProps) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.3;
      ref.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale} castShadow={castShadow}>
      <torusGeometry args={[1, 0.4, 32, 64]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}
