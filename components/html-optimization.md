# HTML Optimizacija — Pravila za novi sajt

Naučeno iz mato-website / matografie.at

---

## ❌ NE radi — base64 inline slike (osim favicon)

```html
<!-- LOŠE — 106KB direktno u HTML, duplirano = 212KB -->
<img src="data:image/webp;base64,/9j/4AAQSkZJRgAB...">

<!-- DOBRO — vanjski fajl, browser kešira -->
<img src="logo.webp">
```

**Pravilo:** Base64 inline samo za favicon (`<link rel="icon">`).
Sve ostale slike — vanjski fajl (`.webp`, `.png`, `.jpg`).

**Zašto:** Base64 poveća veličinu slike za 33% + napuha HTML.
Ako se ista slika koristi 2x (nav + intro), to se dupla u HTML-u.

---

## ✅ Logo format — WebP vanjski fajl

```html
<!-- nav logo -->
<img src="logo.webp" alt="Naziv branda">

<!-- intro logo (JS) -->
const img = document.createElement('img');
img.src = 'logo.webp';
```

---

## ❌ NE ostavljaj mrtav CSS/JS kod

Ako deaktivirate efekat (`display:none !important`, komentiran `setTimeout`):
→ **Odmah obriši** sav prateći CSS i JS, ne ostavljaj ga "za svaki slučaj".

Tipični mrtav kod koji se nakupi:
- Typewriter/typing animacije (ako zamijenjene statičkim tekstom)
- Scroll hint indikatori
- Zakomentrani `setTimeout` blokovi

---

## ✅ Video kompresija — ffmpeg

```bash
ffmpeg -i input.mp4 \
  -vf "scale=720:-2" \
  -c:v libx264 -crf 28 -preset slow \
  -r 30 -an \
  -movflags +faststart \
  output_compressed.mp4
```

Rezultat: ~10x manji fajl (npr. 9.7MB → 981KB)

---

## ✅ Preload hero video

```html
<link rel="preload" href="hero.mp4" as="video" type="video/mp4">
```

---

## ✅ Favicon — inline SVG (bez vanjskog HTTP zahtjeva)

```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,...">
```

Favicon može biti base64/inline jer je mali (< 1KB) i ne ponavlja se.

---

## Veličine koje treba targetirati

| Fajl | Cilj |
|---|---|
| `index.html` | < 150KB |
| Logo `.webp` | < 120KB |
| Hero video | < 2MB (compressed) |
| Menu video | < 1MB (compressed) |
