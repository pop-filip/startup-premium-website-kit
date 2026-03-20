'use client';

import React from 'react';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  ToneMapping,
  SMAA,
  DepthOfField,
  Noise,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';

// ============================================================
// POST-PROCESSING PRESETS
//
// npm install @react-three/postprocessing postprocessing
//
// Usage inside <Canvas>:
//   <CinematicEffects />
//   <SubtleEffects />
//   <NeonEffects />
// ============================================================


/** Subtle polish — Use for product pages and clean designs */
export function SubtleEffects() {
  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette
        offset={0.3}
        darkness={0.4}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}


/** Cinematic look — Use for hero sections and landing pages */
export function CinematicEffects({
  bloomIntensity = 0.5,
  vignetteStrength = 0.5,
}: {
  bloomIntensity?: number;
  vignetteStrength?: number;
}) {
  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.5}
        mipmapBlur
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <ChromaticAberration
        offset={[0.0005, 0.0005]}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette
        offset={0.3}
        darkness={vignetteStrength}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}


/** Neon / Cyberpunk look — Use for tech or gaming sites */
export function NeonEffects() {
  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        offset={[0.002, 0.002]}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        opacity={0.05}
        blendFunction={BlendFunction.OVERLAY}
      />
      <Vignette
        offset={0.4}
        darkness={0.8}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}


/** Depth of Field — Blurs background for focus effect */
export function FocusEffects({
  focusDistance = 0.01,
  focalLength = 0.02,
  bokehScale = 3,
}: {
  focusDistance?: number;
  focalLength?: number;
  bokehScale?: number;
}) {
  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      <DepthOfField
        focusDistance={focusDistance}
        focalLength={focalLength}
        bokehScale={bokehScale}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.3} darkness={0.3} />
    </EffectComposer>
  );
}
