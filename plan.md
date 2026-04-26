# Plan: Cinematic 3D Portfolio — ModernCanvas

---

## Git / GitHub Strategy (Safety First)

### Branch Structure
```
main                    ← production (live website, CI/CD deploys from here)
  └── design-overhaul   ← current working branch (where we are now)
        └── feature/phase-1-foundation
        └── feature/phase-2-matrix-rain
        └── feature/phase-3-scroll-3d
        └── feature/phase-4-morphing-shapes
        └── feature/phase-5-3d-cards
        └── feature/phase-6-skills
        └── feature/phase-7-typography
        └── feature/phase-8-polish
```

### Rules
- **Never commit directly to `main`** — main is always the last known-working deployed version
- **Never commit directly to `design-overhaul`** — this is the integration branch for the overhaul
- Each phase gets its own `feature/phase-N-*` branch cut from `design-overhaul`
- A phase branch is merged into `design-overhaul` only after it visually looks correct
- `design-overhaul` is merged into `main` only when the entire overhaul is ready to go live
- Before starting any phase, commit/stash all current changes so rollback is clean

### Rollback Procedure
If something goes catastrophically wrong at any point:
```bash
# Revert to last working main (your current live website)
git checkout main

# Or if design-overhaul itself breaks, reset it to last good commit
git checkout design-overhaul
git log --oneline          # find the last good commit hash
git reset --hard <hash>    # reset to it

# To nuke a bad feature branch entirely
git branch -D feature/phase-N-*
```

### Workflow per Phase
```bash
# 1. Start a phase
git checkout design-overhaul
git checkout -b feature/phase-N-name

# 2. Do the work, commit often with clear messages
git add <specific files>
git commit -m "Phase N: short description of what this commit does"

# 3. When phase is visually working — merge into design-overhaul
git checkout design-overhaul
git merge feature/phase-N-name

# 4. Push design-overhaul to GitHub (NOT main — CI/CD won't trigger)
git push origin design-overhaul

# 5. Only when EVERYTHING is done and tested:
git checkout main
git merge design-overhaul
git push origin main      # ← this triggers CI/CD deploy
```

### GitHub Conventions
- Commit messages: `Phase N: one-line description` (e.g. `Phase 2: Matrix rain instanced sprites + GLSL phase morph`)
- Never force-push to `main` or `design-overhaul`
- Tag the pre-overhaul state of main for instant rollback: `git tag v1-pre-overhaul main`

---

## Current State

- Stack: React 18 + Vite + TypeScript, GSAP 3.15, Framer Motion 11, Lenis (smooth scroll)
- Already written but **not yet installed/used**: `Scene3D.tsx` (R3F canvas with morphing orbs + bloom) and `MorphVisual.tsx` (canvas 2D with 5 morphing states)
- Missing packages: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- Current branch: `design-overhaul`

---

## Phase 1 — Foundation
**Branch:** `feature/phase-1-foundation`

- Tag current main: `git tag v1-pre-overhaul main`
- Install missing packages: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- Wire `Scene3D.tsx` as persistent full-screen background canvas (z-index 0)
- Wire `MorphVisual.tsx` into Hero section replacing the current wireframe face
- Lazy-load the entire R3F canvas with `React.lazy + Suspense` (Three.js is ~600KB)
- Verify build passes, no runtime errors

---

## Phase 2 — Matrix Code Rain (3D, Morphing)
**Branch:** `feature/phase-2-matrix-rain`

Replace the current `AnimatedBackground.tsx` with a Three.js instanced version:
- **1,200 instanced sprites** as falling characters with real 3D Z-depth spread
- **Phase cycling** every 4 seconds: `code keywords → digits (0-9) → math symbols (∑ ∫ ∇ σ) → algorithm pseudocode → back`
- GLSL fragment shader cross-fades between character atlas regions using `mix(charA, charB, phase)`
- Characters at different Z depths = real 3D parallax rain, not flat 2D overlay
- Color: cyan/green glow, enhanced by bloom post-processing from Scene3D

---

## Phase 3 — Scroll-Driven 3D Scene (Main Cinematic Element)
**Branch:** `feature/phase-3-scroll-3d`

Full-screen R3F scene that transforms as the user scrolls through sections:

| Scroll % | Scene State |
|---|---|
| 0–15%   | Hero: Floating morphing orbs + star field |
| 15–30%  | About: Globe of nodes assembles from particles |
| 30–45%  | Skills: Neural network wires light up, bars extrude in 3D |
| 45–60%  | Projects: Cards fly in from Z-space in a 3D carousel |
| 60–75%  | Experience: Timeline rendered as 3D path, camera travels along it |
| 75–100% | Contact: Scene collapses back into central point, pulse |

**Tech:**
- `useScroll()` from Drei → drives GSAP ScrollTrigger timeline
- Timeline mutates: `uniformProgress`, camera position on `THREE.CatmullRomCurve3` path, object `scale`/`rotation`
- `@14islands/r3f-scroll-rig` for syncing DOM scroll with Three.js canvas

---

## Phase 4 — 3D Morphing Shapes (The "computer → robot" sequence)
**Branch:** `feature/phase-4-morphing-shapes`

Central object in Hero that auto-cycles and also reacts to scroll:

- Shape sequence: **Wireframe Cube → Sphere of Data Points → Neural Network Graph → Humanoid Point Cloud**
- Each transition: GLSL vertex shader `mix(posA, posB, uProgress)` blends geometry vertex positions
- Morph targets stored as `BufferGeometry` position arrays
- Triggered by scroll (Phase 3 progress) OR 5-second auto-cycle when idle
- Particle burst explosion at the moment of each morph transition
- All shapes use `MeshPhysicalMaterial` with `clearcoat: 1` for glass-metal look

---

## Phase 5 — 3D Cards (Projects, Certs, Work)
**Branch:** `feature/phase-5-3d-cards`

Every card in Projects, Certifications, WorkGallery gets:

- **Mouse-tracked 3D tilt**: Framer Motion `useMotionValue` → `rotateX/rotateY` CSS transforms
- **Specular shine**: radial gradient `::after` layer chasing cursor position
- **Glow border**: animated `box-shadow` neon cyan/purple on hover
- **Z-pop on hover**: card translates `translateZ(40px)` + scales to 1.05×
- **Entry animation**: cards fly in from 60° angle on scroll via `whileInView`
- **Staggered children**: child elements inside card fade in with stagger delay

---

## Phase 6 — Cinematic Skills Section
**Branch:** `feature/phase-6-skills`

Replace flat skill tags with a proper 3D proficiency visualization:

- **3D bar chart in R3F**: each skill is an extruded 3D bar growing along Z-axis on scroll
- **GSAP counter**: percentage numbers count up from 0 as bars grow (`gsap.to(counter, { textContent: value, snap: 1 })`)
- **Particle trail** flows along the surface of each growing bar
- **Category clustering**: bars orbit and cluster by category (ML, Web, Cloud, Tools)
- Bars use `MeshPhysicalMaterial` with `clearcoat` for glass-metal finish
- Hover: individual bar highlights, shows skill tooltip in 3D space

---

## Phase 7 — Typography & Text Effects
**Branch:** `feature/phase-7-typography`

- **GSAP SplitText**: all section headings split into characters, staggered scroll-triggered reveal
- **Glitch scramble**: hacker-style letter randomize on entry → then resolves to real text
- **Typewriter upgrade**: Hero typewriter → multi-line cinematic sequence with cursor blink
- **Parallax text layers**: different DOM text elements move at different Z-speeds on scroll
- **Hover scramble**: hovering any heading triggers a quick letter scramble → re-resolve

---

## Phase 8 — Global Polish
**Branch:** `feature/phase-8-polish`

- **Smooth scroll**: tune Lenis to `lerp: 0.08` for buttery feel
- **Custom cursor**: glowing dot that expands on hover targets, leaves short particle trail
- **Page load intro**: particles assemble into the site logo/name, then dissolve into first section
- **Mobile fallback**: detect `navigator.hardwareConcurrency < 4` → disable R3F canvas, keep CSS/Framer Motion only
- **`prefers-reduced-motion`**: media query strips all animations for accessibility compliance
- **Perf limits**: `pixelRatio: Math.min(devicePixelRatio, 2)` in Canvas, `frameloop="demand"` on static scenes
- **Lazy loading**: all heavy 3D sections wrapped in `React.lazy + Suspense`

---

## New Packages (Phases 1–8)

```bash
# Phase 1 — Core 3D (install yourself in project root terminal)
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing

# Phase 3 — Scroll rig (optional, if scroll sync needs more control)
npm install @14islands/r3f-scroll-rig
```

All animation work uses **GSAP + Framer Motion** — already installed, no new packages needed.

---

## What We Are NOT Doing
- No Barba.js — Framer Motion `AnimatePresence` covers page transitions for SPA
- No 21st.dev — building fully custom, not templates
- No Rive/Lottie — GLSL shaders give us more cinematic control
- No scroll-linked video sequences — too heavy; GLSL morphing is cleaner and ~10× smaller

---

## Status Tracker

| Phase | Branch | Status |
|---|---|---|
| 1 — Foundation | feature/phase-1-foundation | Not started |
| 2 — Matrix Rain | feature/phase-2-matrix-rain | Not started |
| 3 — Scroll 3D | feature/phase-3-scroll-3d | Not started |
| 4 — Morphing Shapes | feature/phase-4-morphing-shapes | Not started |
| 5 — 3D Cards | feature/phase-5-3d-cards | Not started |
| 6 — Skills | feature/phase-6-skills | Not started |
| 7 — Typography | feature/phase-7-typography | Not started |
| 8 — Polish | feature/phase-8-polish | Not started |
