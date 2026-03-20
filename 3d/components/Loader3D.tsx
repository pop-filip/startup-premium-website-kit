'use client';

import React from 'react';
import { useProgress, Html } from '@react-three/drei';

// ============================================================
// 3D LOADING SCREEN — Shows while models/textures load
//
// Usage (inside Canvas, inside Suspense):
//   <Suspense fallback={<Loader3D />}>
//     <Model url="/big-model.glb" />
//   </Suspense>
// ============================================================

export function Loader3D({
  color = '#6366F1',
  barColor = '#6366F1',
  textColor = '#ffffff',
}: {
  color?: string;
  barColor?: string;
  textColor?: string;
}) {
  const { progress, active } = useProgress();

  if (!active) return null;

  return (
    <Html center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          userSelect: 'none',
        }}
      >
        {/* Spinning ring */}
        <div
          style={{
            width: '48px',
            height: '48px',
            border: `3px solid ${color}20`,
            borderTopColor: color,
            borderRadius: '50%',
            animation: 'spin3d 1s linear infinite',
          }}
        />

        {/* Progress bar */}
        <div
          style={{
            width: '200px',
            height: '4px',
            background: `${barColor}20`,
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: barColor,
              borderRadius: '2px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Percentage */}
        <span
          style={{
            fontSize: '14px',
            fontFamily: 'monospace',
            color: textColor,
            opacity: 0.8,
          }}
        >
          {progress.toFixed(0)}%
        </span>

        <style>{`
          @keyframes spin3d {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Html>
  );
}


// ============================================================
// HTML LOADING OVERLAY — Shows before Canvas mounts
// Use this OUTSIDE the Canvas as a page-level loader
//
// Usage:
//   <LoadingOverlay isLoading={isLoading} />
// ============================================================

export function LoadingOverlay({
  isLoading,
  color = '#6366F1',
  background = '#0a0a0a',
}: {
  isLoading: boolean;
  color?: string;
  background?: string;
}) {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background,
        zIndex: 100,
        transition: 'opacity 0.5s ease',
      }}
      role="progressbar"
      aria-label="Loading 3D content"
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          border: `3px solid ${color}30`,
          borderTopColor: color,
          borderRadius: '50%',
          animation: 'spin3d 0.8s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin3d {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
