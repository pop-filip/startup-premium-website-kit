'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================================
// 3D HOOKS — Reusable hooks for Three.js interactions
// ============================================================


/**
 * useMouseParallax — Object follows mouse position
 * 
 * Usage:
 *   const ref = useMouseParallax(0.1);
 *   <mesh ref={ref} />
 */
export function useMouseParallax(intensity = 0.1) {
  const ref = useRef<THREE.Object3D>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      mouse.current.x * intensity,
      0.05
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      mouse.current.y * intensity,
      0.05
    );
  });

  return ref;
}


/**
 * useScrollAnimation — Animate based on scroll position
 * 
 * Usage:
 *   const { progress, ref } = useScrollAnimation();
 *   <mesh ref={ref} rotation-y={progress * Math.PI * 2} />
 */
export function useScrollAnimation(
  startOffset = 0,   // 0 = top of viewport
  endOffset = 1,     // 1 = bottom of viewport
) {
  const ref = useRef<THREE.Object3D>(null!);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const rawProgress = docHeight > 0 ? scrollY / docHeight : 0;
      const clamped = Math.max(0, Math.min(1, (rawProgress - startOffset) / (endOffset - startOffset)));
      setProgress(clamped);
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler(); // Initial call
    return () => window.removeEventListener('scroll', handler);
  }, [startOffset, endOffset]);

  return { progress, ref };
}


/**
 * useSpring3D — Smooth spring animation for 3D values
 * 
 * Usage:
 *   const scale = useSpring3D(isHovered ? 1.2 : 1, { stiffness: 200, damping: 20 });
 *   <mesh scale={scale} />
 */
export function useSpring3D(
  target: number,
  config: { stiffness?: number; damping?: number; mass?: number } = {}
) {
  const { stiffness = 170, damping = 26, mass = 1 } = config;
  const current = useRef(target);
  const velocity = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1); // Cap delta to prevent explosion
    const spring = -stiffness * (current.current - target);
    const dampForce = -damping * velocity.current;
    const acceleration = (spring + dampForce) / mass;
    velocity.current += acceleration * dt;
    current.current += velocity.current * dt;
  });

  return current;
}


/**
 * useModelLoader — Track loading progress for models
 * 
 * Usage:
 *   const { progress, isLoading } = useModelLoader(['/model1.glb', '/model2.glb']);
 */
export function useModelLoader(urls: string[]) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const manager = new THREE.LoadingManager();
    
    manager.onProgress = (_, loaded, total) => {
      setProgress((loaded / total) * 100);
    };
    
    manager.onLoad = () => {
      setIsLoading(false);
      setProgress(100);
    };
    
    manager.onError = (url) => {
      setErrors(prev => [...prev, url]);
    };

    // Trigger preloading
    const loader = new THREE.FileLoader(manager);
    urls.forEach(url => loader.load(url, () => {}, undefined, () => {}));
  }, [urls]);

  return { progress, isLoading, errors };
}


/**
 * usePulse — Pulsating scale effect
 * 
 * Usage:
 *   const ref = usePulse({ speed: 2, min: 0.95, max: 1.05 });
 *   <mesh ref={ref} />
 */
export function usePulse(config: { speed?: number; min?: number; max?: number } = {}) {
  const { speed = 1.5, min = 0.95, max = 1.05 } = config;
  const ref = useRef<THREE.Object3D>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = Math.sin(clock.getElapsedTime() * speed) * 0.5 + 0.5;
    const scale = min + t * (max - min);
    ref.current.scale.setScalar(scale);
  });

  return ref;
}


/**
 * useScreenToWorld — Convert screen coordinates to 3D world position
 */
export function useScreenToWorld() {
  const { camera, size } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  return (screenX: number, screenY: number): THREE.Vector3 => {
    const mouse = new THREE.Vector2(
      (screenX / size.width) * 2 - 1,
      -(screenY / size.height) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, target);
    return target;
  };
}
