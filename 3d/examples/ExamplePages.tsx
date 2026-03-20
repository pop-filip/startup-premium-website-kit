'use client';

import React, { Suspense, useState } from 'react';
import { Scene3D, ProductScene, HeroScene, GalleryScene } from '../components/Scene3D';
import { Model, Box, Sphere, Torus } from '../components/Model';
import { Particles, FloatingShapes, Text3DTitle, GridFloor } from '../components/Effects';
import { CinematicEffects, SubtleEffects, NeonEffects } from '../components/PostProcessing';
import { Loader3D, LoadingOverlay } from '../components/Loader3D';
import { useMouseParallax } from '../hooks/use3d-hooks';

// ============================================================
// EXAMPLE 1: Product Showcase (E-commerce)
// Perfect for: shoes, electronics, furniture, jewelry
// ============================================================

export function ProductShowcase() {
  const [color, setColor] = useState('#6366F1');

  return (
    <div style={{ height: '600px', position: 'relative' }}>
      <ProductScene>
        {/* Replace with your .glb model */}
        <Suspense fallback={<Loader3D />}>
          {/* <Model url="/models/shoe.glb" autoRotate scale={2} /> */}
          
          {/* Placeholder until you add a model: */}
          <Box position={[0, 0, 0]} color={color} scale={1.5} metalness={0.6} roughness={0.2} />
        </Suspense>
        <SubtleEffects />
      </ProductScene>

      {/* Color selector overlay */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '0.75rem',
      }}>
        {['#6366F1', '#EF4444', '#22C55E', '#F59E0B', '#1A1A2E'].map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            aria-label={`Color ${c}`}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: c, border: color === c ? '3px solid white' : '3px solid transparent',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              minWidth: '44px', minHeight: '44px', // WCAG touch target
            }}
          />
        ))}
      </div>
    </div>
  );
}


// ============================================================
// EXAMPLE 2: Hero Section with Particles
// Perfect for: landing pages, tech sites, SaaS
// ============================================================

export function HeroWith3D() {
  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* 3D Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <HeroScene>
          <Particles count={800} color="#6366F1" size={0.02} spread={15} speed={0.3} />
          <FloatingShapes count={10} colors={['#6366F1', '#818CF8', '#3B82F6']} />
          <CinematicEffects bloomIntensity={0.8} />
        </HeroScene>
      </div>

      {/* HTML overlay content */}
      <div style={{
        position: 'relative', zIndex: 10, height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: 'white', textAlign: 'center', padding: '2rem',
      }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, margin: 0 }}>
          Build Something Amazing
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.7, maxWidth: '600px', marginTop: '1rem' }}>
          Premium 3D experiences that captivate your audience.
        </p>
        <button style={{
          marginTop: '2rem', padding: '1rem 2.5rem',
          background: '#6366F1', color: 'white', border: 'none',
          borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600,
          cursor: 'pointer', minHeight: '44px',
        }}>
          Get Started
        </button>
      </div>
    </section>
  );
}


// ============================================================
// EXAMPLE 3: 3D Model Gallery / Portfolio
// Perfect for: architecture, 3D artists, design studios
// ============================================================

export function ModelGallery() {
  return (
    <div style={{ height: '700px' }}>
      <GalleryScene>
        {/* Replace with your models */}
        <Sphere position={[-3, 0.5, 0]} color="#6366F1" scale={0.8} metalness={0.8} roughness={0.1} />
        <Box position={[0, 0.5, 0]} color="#EF4444" scale={0.8} metalness={0.5} roughness={0.3} />
        <Torus position={[3, 0.5, 0]} color="#22C55E" scale={0.6} metalness={0.7} roughness={0.2} />
        <SubtleEffects />
      </GalleryScene>
    </div>
  );
}


// ============================================================
// EXAMPLE 4: Interactive Scene (mouse tracking)
// Perfect for: about pages, team pages, fun interactions
// ============================================================

function MouseTrackingContent() {
  const groupRef = useMouseParallax(0.3);

  return (
    <group ref={groupRef}>
      <Torus position={[0, 0, 0]} color="#6366F1" scale={1.5} metalness={0.9} roughness={0.05} />
      <Sphere position={[2, 1, -1]} color="#818CF8" scale={0.4} />
      <Sphere position={[-2, -0.5, -1]} color="#A5B4FC" scale={0.3} />
      <Box position={[1.5, -1, -0.5]} color="#3B82F6" scale={0.3} />
    </group>
  );
}

export function InteractiveScene() {
  return (
    <div style={{ height: '500px' }}>
      <Scene3D
        environment="sunset"
        controls={false}
        camera={{ position: [0, 0, 6], fov: 50 }}
        background="#0F0F1A"
      >
        <MouseTrackingContent />
        <Particles count={300} color="#6366F1" size={0.015} opacity={0.4} />
        <NeonEffects />
      </Scene3D>
    </div>
  );
}


// ============================================================
// EXAMPLE 5: Loading a real GLB model
// ============================================================

export function RealModelExample() {
  return (
    <div style={{ height: '600px' }}>
      <ProductScene>
        <Suspense fallback={<Loader3D />}>
          {/*
            To use a real model:
            1. Put your .glb file in /public/models/
            2. Uncomment the line below
            3. Delete the placeholder Box
            
            Free models: 
              - https://poly.pizza (free low-poly)
              - https://sketchfab.com (free + paid)
              - https://market.pmnd.rs (R3F optimized)
            
            Optimize models:
              npx gltfjsx model.glb --transform --simplify
          */}
          {/* <Model url="/models/your-model.glb" autoRotate scale={2} /> */}
          
          <Box position={[0, 0.5, 0]} color="#6366F1" scale={1.5} metalness={0.7} roughness={0.1} />
          <GridFloor />
        </Suspense>
        <SubtleEffects />
      </ProductScene>
    </div>
  );
}
