# Completed Work — ModernCanvas 3D Overhaul

See `plan.md` for the full plan. This file tracks what has been done.

---

## Phase 1 — Foundation ✓
**Branch:** `feature/phase-1-foundation` → merged into `design-overhaul`

- Tagged `main` as `v1-pre-overhaul` for instant rollback
- Installed `three`, `@react-three/fiber@8`, `@react-three/drei@9`, `@react-three/postprocessing@2`
- Added `Scene3D.tsx` — full-screen fixed Three.js canvas: morphing icosahedron orbs, 4000-point starfield, floating binary field, mouse-parallax camera, bloom post-processing
- Added `MorphVisual.tsx` — 360×360 canvas: 5-state auto-morph cycle, particle burst transitions, theme-aware colors
- Wired `Scene3D` into `App.tsx` via `React.lazy + Suspense`
- Replaced wireframe face in `Hero.tsx` with `MorphVisual`; scroll handler fades + parallaxes it on scroll
- Replaced DataGlobe in About section with real profile photo (`mine.png`): zoom-out entry, 360° Y-axis rotation, scan rings, cyan neon glow border
- Added `MorphField` system to Hero right panel (1→2→4→8 copies, orbit motion)

---

## Phase 2 — Matrix Code Rain ✓
**Branch:** `feature/phase-2-matrix-rain` → merged into `design-overhaul`

- Attempted 1,200 instanced GLSL sprite rain (MatrixRain3D.tsx) — never rendered visibly on transparent canvas
- Final resolution: `MatrixRain3D.tsx` disabled; `RightBinaryRain` overlay component added instead
- Removed `AnimatedBackground.tsx` (2D canvas) from `App.tsx`

---

## Phase 3 — Scroll-Driven 3D Scene ✓
**Branch:** `feature/phase-3-scroll-3d` → merged into `design-overhaul`

- Scroll-driven 3D camera path using `useScroll` from Drei + `THREE.CatmullRomCurve3`
- NodeGlobe and NeuralNetViz added then removed; scroll camera kept

---

## Phase 4 — 3D Morphing Shapes ✓
**Branch:** `feature/phase-4-morphing-shapes` → merged into `design-overhaul`

- Created `MorphShape3D.tsx` — dedicated R3F Canvas in Hero right panel
- N=1200 points, CPU Float32Array lerp each frame; 4 shapes: Cube → Sphere → Neural Graph → Humanoid
- `InstancedMesh` with `MeshPhysicalMaterial` clearcoat:1, metalness:0.75
- Auto-cycle every 5s, 80 burst particles at each transition
- DOM label updated via shared `labelRef` (no re-renders)
- Internal EffectComposer + Bloom; pauses when hero not visible

**Superseded:** MorphShape3D later replaced by hero video (see Phase 8)

---

## Phase 5 — 3D Tilt Cards ✓
**Branch:** `feature/phase-5-3d-cards` → merged into `design-overhaul`

- Created `TiltCard.tsx` — reusable wrapper: mouse-tracked rotateX/rotateY, specular shine, neon glow, Z-pop
- Applied to Projects, Certifications, and Skills cards
- Entry animation: cards fly in from 60° angle via `whileInView`; staggered children fade-in

---

## Phase 6 — Cinematic Skills Section ✓
**Branch:** `feature/phase-6-skills` → merged into `design-overhaul`

- `TiltCard` wraps every skill card with per-category glow colours (cyan / green / purple / rose)
- `TiltCard` extended to forward arbitrary HTML attributes (`data-testid` etc.)
- `CountBadge`: IntersectionObserver + GSAP tween counts 0 → value when scrolled into view
- `ProgressBar`: shimmer sweep (`motion.div` x: −100% → 200%) loops after bar fills
- Icon ring border/glow tinted to category colour

---

## Phase 7 — Typography & Text Effects ✓
**Branch:** `feature/phase-7-typography` → merged into `design-overhaul`

- Created `ScrambleHeading` — scroll-triggered hacker-style char scramble resolving left-to-right; hover re-scramble; `prefers-reduced-motion` bypass; optional `children` for multi-colour markup
- Created `useCinematicTypewriter` — sequences multiple lines char-by-char; cursor handoff between lines
- Hero title → `ScrambleHeading`; subtitle + tagline → cinematic typewriter with live cursor
- All section headings (About, Education, Projects, Experience, Certifications, Skills ×5, Contact) replaced with `ScrambleHeading`
- Every section heading container: scroll-driven parallax Y ±18px via Framer Motion `useScroll + useTransform`

---

## Phase 8 — Global Polish ✓
**Branch:** `feature/phase-8-polish` (in progress on `design-overhaul`)

### Hero video
- Removed `MorphShape3D` R3F canvas from Hero right panel
- `AI_Evolution_Transformation_Video.mp4` → `public/assets/hero-video.mp4`
- `<video>` autoPlay loop muted playsInline, `objectFit: cover`, `mixBlendMode: screen`
- Left/top/bottom edge fade overlays blend video into background
- Scroll fade-out handler preserved

### About video
- Removed rotating profile photo + scan rings from About section
- `AI_Face_Evolution_Video_Generation.mp4` → `public/assets/about-video.mp4`
- Video fills full left column (`absolute inset-0`, `items-stretch` on flex row)
- `objectPosition: center top`, edge fades on all sides

### WorkGallery removed
- "Things I've Worked On" section removed from Portfolio entirely

### Theme: light mode removed
- ThemeToggle cycles Night → Dark only (Sun icon removed)
- ThemeProvider `themes` array reduced to `['dark', 'night']`

### Mobile-first responsive overhaul
- `index.css`: `overflow-x: hidden` on html/body, `-webkit-tap-highlight-color` removed, `scroll-padding-top: 72px`, `text-size-adjust` on mobile
- `App.tsx`: Scene3D disabled on touch / coarse-pointer / narrow / <4-core devices
- `TiltCard`: tilt handlers skipped on `hover: none` (touch) devices
- `Navigation`: full-screen right-to-left slide drawer with backdrop blur, animated hamburger ↔ X icon, numbered nav items, body scroll lock, ThemeToggle in mobile header, auto-close on resize
- `Hero`: `pt-20` on mobile for fixed nav clearance; `px-6` on small screens
- `About`: gap `8 lg:16` between columns; video `min-h-[260px] sm:min-h-[360px] lg:min-h-0`
- `Experience`: card inner padding `p-4 sm:p-8`
