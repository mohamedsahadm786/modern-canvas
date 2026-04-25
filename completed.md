# Completed Work — ModernCanvas 3D Overhaul

See `plan.md` for the full plan. This file tracks what has been done.

---

## Phase 1 — Foundation ✓
**Branch:** `feature/phase-1-foundation` → merged into `design-overhaul`

- Tagged `main` as `v1-pre-overhaul` for instant rollback
- Installed `three`, `@react-three/fiber@8`, `@react-three/drei@9`, `@react-three/postprocessing@2` (pinned to v8/v9/v2 because project uses React 18; R3F v9 requires React 19)
- Added `Scene3D.tsx` — full-screen fixed Three.js canvas: morphing icosahedron orbs (simplex-noise GLSL shaders), 4000-point starfield, floating binary field, mouse-parallax camera, bloom post-processing
- Added `MorphVisual.tsx` — 360×360 canvas: 5-state auto-morph cycle (Globe → Data Science → Analytics → Neural Net → Terminal), particle burst transitions, theme-aware colors
- Wired `Scene3D` into `App.tsx` via `React.lazy + Suspense` (lazy-loaded to avoid blocking first paint); sits on top of `AnimatedBackground` (both transparent canvases layer correctly)
- Replaced wireframe face in `Hero.tsx` with `MorphVisual`; scroll handler fades + parallaxes it on scroll
- Fixed duplicate `style` attribute warning in `Hero.tsx`
- Removed 4 corner bracket decorations from Hero MorphVisual container
- Reordered MorphVisual states: AI/ML → Software Eng → Data Science → Analytics → Globe
- Replaced DataGlobe in About section with real profile photo (`mine.png`):
  - Zoom-out entry animation (scale 1.4 → 1.0 on scroll into view)
  - Continuous full 360° Y-axis rotation (20s cycle)
  - Two counter-rotating scan rings + cyan neon glow border
- Added `MorphField` system to Hero right panel:
  - Phase cycle (4s each): 1 → 2 → 4 → 8 copies → loops back to 1
  - 1 / 2 / 4 copies: full size (scale 1.0), free random-walk motion (easeInOut)
  - 8 copies: reduced size (scale 0.28), circular orbit motion (rAF loop, evenly spaced)
  - Every copy rotates full 360° on Y-axis (16s, Framer Motion)
  - AnimatePresence handles scale-pop appear / exit between phases

---

## Phase 2 — Matrix Code Rain (3D, Morphing) ✓
**Branch:** `feature/phase-2-matrix-rain` → merged into `design-overhaul`

- Created `MatrixRain3D.tsx` — 1,200 instanced `PlaneGeometry` sprites sharing the Scene3D canvas
- 60 columns × 20 drops per column; Z spread ±4.5 world units for real 3D parallax depth
- Per-instance buffer attributes: column, startY, fallSpeed, depth, charSeed, charSpeed
- Vertex shader: dynamic character cycling per instance (`aCharSpeed * time`), depth-based scale, depth-based alpha
- Fragment shader: samples two canvas atlas textures (640×64px each, 10 chars per atlas), mixes by `uBlend` for smooth cross-fade
- Phase cycling every 4 s: **code keywords → digits (0–9) → math symbols (Σ ∫ ∇ σ …) → algorithm tokens** → loops
- 1-second GLSL cross-fade blend at end of each phase (character shapes dissolve into next set)
- Depth-based colour: near Z = cyan `#00f7eb`, far Z = green `#0de63d`; AdditiveBlending → bloom amplifies glow
- Removed `AnimatedBackground.tsx` (2D canvas) from `App.tsx`; matrix rain now lives inside the existing R3F canvas sharing Bloom post-processing


**Note:** The 3D instanced GLSL approach never produced a visible rain on the transparent canvas after multiple debug attempts. Final resolution: `MatrixRain3D.tsx` was disabled; a simpler `RightBinaryRain` overlay component was added instead. The GLSL phase-morphing rain remains unshipped.

---

## Phase 3 — Scroll-Driven 3D Scene ✓
**Branch:** `feature/phase-3-scroll-3d` → merged into `design-overhaul`

- Added scroll-driven 3D camera path using `useScroll` from Drei + `THREE.CatmullRomCurve3`
- NodeGlobe and NeuralNetViz components were added then removed (kept scroll camera only)
- Scene transitions as user scrolls through sections; cinematic camera movement active

---

## Phase 4 — 3D Morphing Shapes
**Status:** Not started

---

## Phase 5 — 3D Cards ✓
**Branch:** `feature/phase-5-3d-cards` → merged into `design-overhaul`

- Mouse-tracked 3D tilt on all cards (Projects, Certifications, WorkGallery) using Framer Motion `useMotionValue` → `rotateX/rotateY`
- Specular shine: radial gradient `::after` layer tracks cursor position
- Neon glow border: animated `box-shadow` cyan/purple on hover
- Z-pop on hover: `translateZ(40px)` + scale 1.05×
- Entry animation: cards fly in from 60° angle via `whileInView`
- Staggered children fade-in inside each card

---

## Phase 6 — Cinematic Skills Section
**Status:** Not started

## Phase 7 — Typography & Text Effects ✓
**Branch:** `feature/phase-7-typography` → merged into `design-overhaul`

- Created `ScrambleHeading` component: scroll-triggered hacker-style character scramble that resolves left-to-right into real text; unresolved chars glow cyan; full hover re-scramble on any resolved heading; `prefers-reduced-motion` skips straight to resolved; optional `children` prop swaps in multi-colour markup after resolution
- Created `useCinematicTypewriter` hook: sequences through multiple lines — each line types character by character, cursor transfers to the next line after a configurable pause, cursor stays on the last line once all lines are done
- Hero: title replaced with `ScrambleHeading`; subtitle + tagline now use cinematic typewriter with live cursor handoff between the two lines
- All 9 section headings replaced with `ScrambleHeading` (About, Education, WorkGallery, Projects, Experience, Certifications, Skills × h2, Skills × 4 category h3s, Contact)
- Every section heading container gets scroll-driven parallax Y ±18 px via Framer Motion `useScroll` + `useTransform`

## Phase 8 — Global Polish
**Status:** Not started
