# 🎮 3D Module — React Three Fiber za Next.js

Kompletni 3D starter za premium website-ove. Sadrži scene, modele, efekte, post-processing, animacije i 5 gotovih primera.

---

## ⚡ Instalacija

```bash
# Core (obavezno)
npm install three @react-three/fiber @react-three/drei

# Post-processing efekti (opciono, ali preporučeno)
npm install @react-three/postprocessing postprocessing

# TypeScript tipovi
npm install -D @types/three
```

---

## 📁 Struktura

```
3d/
├── components/
│   ├── Scene3D.tsx          # Canvas wrapper sa 4 preset scene
│   ├── Model.tsx            # GLB/GLTF model loader + primitive shapes
│   ├── Effects.tsx          # 3D Text, Particles, FloatingShapes, GridFloor
│   ├── PostProcessing.tsx   # Bloom, Vignette, Chromatic Aberration preset-i
│   └── Loader3D.tsx         # Loading screen (in-canvas + overlay)
│
├── hooks/
│   └── use3d-hooks.ts       # useMouseParallax, useScrollAnimation, useSpring3D,
│                            # useModelLoader, usePulse, useScreenToWorld
│
├── examples/
│   └── ExamplePages.tsx     # 5 gotovih primera (product, hero, gallery, interactive, model)
│
└── models/                  # Stavi .glb fajlove ovde → /public/models/
```

---

## 🚀 Quick Start

### 1. Dodaj u Next.js config

```js
// next.config.js — dodaj transpilePackages
const nextConfig = {
  transpilePackages: ['three'],
  // ... ostali config
};
```

### 2. Osnovna 3D scena

```tsx
// app/page.tsx
import { Scene3D } from '@/3d/components/Scene3D';
import { Box } from '@/3d/components/Model';

export default function Home() {
  return (
    <div style={{ height: '500px' }}>
      <Scene3D>
        <Box color="#6366F1" />
      </Scene3D>
    </div>
  );
}
```

### 3. Product Showcase sa modelom

```tsx
import { ProductScene } from '@/3d/components/Scene3D';
import { Model } from '@/3d/components/Model';

// Stavi model u: /public/models/shoe.glb
export default function ProductPage() {
  return (
    <div style={{ height: '600px' }}>
      <ProductScene>
        <Model url="/models/shoe.glb" autoRotate scale={2} />
      </ProductScene>
    </div>
  );
}
```

### 4. Hero sa česticama

```tsx
import { HeroScene } from '@/3d/components/Scene3D';
import { Particles, FloatingShapes } from '@/3d/components/Effects';
import { CinematicEffects } from '@/3d/components/PostProcessing';

export default function Hero() {
  return (
    <section style={{ height: '100vh', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <HeroScene>
          <Particles count={800} color="#6366F1" />
          <FloatingShapes count={10} />
          <CinematicEffects />
        </HeroScene>
      </div>
      <div style={{ position: 'relative', zIndex: 10, color: 'white' }}>
        <h1>Your Hero Text</h1>
      </div>
    </section>
  );
}
```

---

## 🎨 Scene Presets

| Preset | Koristi za | Background | Environment |
|--------|-----------|------------|-------------|
| `Scene3D` | Generalna scena | Transparent | City |
| `ProductScene` | E-commerce product viewer | #f8f9fa | Studio |
| `HeroScene` | Landing page hero | #0a0a0a | Night |
| `GalleryScene` | Portfolio / showcase | #ffffff | Warehouse |

---

## ✨ Post-Processing Presets

| Preset | Stil | Efekti |
|--------|------|--------|
| `SubtleEffects` | Čist, profesionalan | SMAA, Tone mapping, Vignette |
| `CinematicEffects` | Filmski, dramatičan | Bloom, Chromatic Aberration, Vignette |
| `NeonEffects` | Cyberpunk, tech | Heavy Bloom, Noise, Vignette |
| `FocusEffects` | Fotografski | Depth of Field, Vignette |

---

## 🎯 Performance Tips

1. **Modeli**: Koristi `.glb` format, kompresuj sa Draco
   ```bash
   npx gltfjsx model.glb --transform --simplify
   ```

2. **Teksture**: Max 2048x2048, koristi KTX2 kompresiju

3. **Poligoni**: < 100K za mobile, < 500K za desktop

4. **Lazy loading**: Učitavaj 3D scene samo kad su vidljive
   ```tsx
   const [show3D, setShow3D] = useState(false);
   // useIntersectionObserver → setShow3D(true)
   {show3D && <Scene3D>...</Scene3D>}
   ```

5. **`<AdaptiveDpr>`** automatski smanjuje rezoluciju na slabijim uređajima

6. **`<BakeShadows>`** renderuje senke samo jednom (za statične scene)

7. **Testiranje**: Lighthouse tretira Canvas kao jednu sliku — ne utiče na CLS

---

## 📦 Besplatni Modeli

- [Poly Pizza](https://poly.pizza) — Low-poly modeli (besplatno)
- [Sketchfab](https://sketchfab.com) — Besplatni + plaćeni modeli
- [PMND Market](https://market.pmnd.rs) — Optimizovani za R3F
- [Quaternius](https://quaternius.com) — Game-ready modeli

## 🔤 3D Fontovi

Konvertuj bilo koji font u JSON za Text3D:
- [Facetype.js](https://gero3.github.io/facetype.js/)
- Stavi JSON u `/public/fonts/`

---

Kreirano sa Claude AI — 2026
