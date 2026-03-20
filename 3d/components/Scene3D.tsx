'use client';

import React, { Suspense, ReactNode } from 'react';
import { Canvas, CanvasProps } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Preload,
  AdaptiveDpr,
  AdaptiveEvents,
  BakeShadows,
  PerformanceMonitor,
} from '@react-three/drei';

// ============================================================
// SCENE 3D — Main wrapper for all 3D content
//
// Usage:
//   <Scene3D>
//     <YourModel />
//   </Scene3D>
//
// Props:
//   controls    — enable orbit controls (default: true)
//   environment — HDRI environment preset (default: 'city')
//   shadows     — enable shadows (default: true)
//   performance — enable adaptive performance (default: true)
//   className   — CSS class for the canvas container
// ============================================================

interface Scene3DProps {
  children: ReactNode;
  controls?: boolean;
  environment?: 'city' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'park' | 'lobby' | false;
  shadows?: boolean;
  performance?: boolean;
  className?: string;
  style?: React.CSSProperties;
  camera?: CanvasProps['camera'];
  background?: string;
}

// Fallback while 3D loads
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366F1" wireframe />
    </mesh>
  );
}

export function Scene3D({
  children,
  controls = true,
  environment = 'city',
  shadows = true,
  performance = true,
  className = '',
  style,
  camera = { position: [0, 2, 5], fov: 45 },
  background,
}: Scene3DProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        ...style,
      }}
    >
      <Canvas
        shadows={shadows}
        camera={camera}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: !background,
          powerPreference: 'high-performance',
        }}
        style={{ background: background || 'transparent' }}
      >
        {/* Performance optimization */}
        {performance && (
          <>
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            <PerformanceMonitor
              onDecline={() => console.warn('3D: Performance declining, reducing quality')}
            />
          </>
        )}

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow={shadows}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Environment (HDR lighting) */}
        {environment && <Environment preset={environment} />}

        {/* Content */}
        <Suspense fallback={<LoadingFallback />}>
          {children}
          {shadows && <BakeShadows />}
          <Preload all />
        </Suspense>

        {/* Controls */}
        {controls && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
            minPolarAngle={Math.PI / 6}      // Limit looking from below
            maxPolarAngle={Math.PI / 2.2}     // Limit looking from above
            autoRotate={false}
            autoRotateSpeed={1}
            dampingFactor={0.05}
            enableDamping
          />
        )}
      </Canvas>
    </div>
  );
}


// ============================================================
// SCENE PRESETS — Ready-to-use scene configurations
// ============================================================

/** Product showcase scene with turntable rotation */
export function ProductScene({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Scene3D
      className={className}
      style={style}
      environment="studio"
      camera={{ position: [0, 1.5, 4], fov: 35 }}
      background="#f8f9fa"
    >
      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <shadowMaterial opacity={0.15} />
      </mesh>
      {children}
    </Scene3D>
  );
}


/** Hero section with dark cinematic look */
export function HeroScene({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Scene3D
      className={className}
      style={{ minHeight: '600px', ...style }}
      environment="night"
      camera={{ position: [0, 0, 6], fov: 50 }}
      background="#0a0a0a"
      controls={false}
    >
      <fog attach="fog" args={['#0a0a0a', 5, 20]} />
      {children}
    </Scene3D>
  );
}


/** Portfolio / gallery scene with clean white background */
export function GalleryScene({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Scene3D
      className={className}
      style={style}
      environment="warehouse"
      camera={{ position: [0, 2, 8], fov: 40 }}
      background="#ffffff"
    >
      {/* Infinite ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {children}
    </Scene3D>
  );
}
