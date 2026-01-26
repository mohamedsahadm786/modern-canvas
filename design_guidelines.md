# Apple-Inspired Portfolio Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from Apple's design language - clean, minimal, premium feel with generous whitespace, crisp typography, and subtle interactions.

## Core Design Elements

### A. Color Palette
**Light Mode Primary:**
- Background: Pure white (#FFFFFF) and light grays (245 10% 97%)
- Text: Near-black (220 10% 15%) for headings, medium gray (220 5% 40%) for body
- Accent: Apple blue (214 100% 45%) for CTAs and interactive elements
- Borders: Light gray (220 10% 90%) for subtle dividers

**Neutral Grays:**
- Card backgrounds: Off-white (220 15% 98%)
- Hover states: Light gray (220 10% 95%)
- Subtle shadows: (220 10% 80% with low opacity)

### B. Typography
**Font Stack:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

**Hierarchy:**
- Hero H1: 48-64px desktop, 32-40px mobile, font-weight 700
- Section headings: 32-40px desktop, 24-28px mobile, font-weight 600
- Body text: 16-18px, line-height 1.6, font-weight 400
- Captions: 14px, font-weight 500

### C. Layout System
**Spacing Scale:** Use consistent spacing units based on 4px grid
- Primary spacing: 16px, 24px, 32px, 48px, 64px (p-4, p-6, p-8, p-12, p-16)
- Generous whitespace between sections: 80-120px vertical
- Container max-width: 1200px with 24px horizontal padding

### D. Component Library

**Navigation:**
- Sticky header with subtle backdrop blur
- Minimal brand left, simple links right
- Mobile hamburger with slide-out menu
- 60px height with 16px vertical padding

**Cards:**
- Rounded corners (12px border-radius)
- Subtle drop shadows (0 4px 16px rgba(0,0,0,0.1))
- White/off-white backgrounds
- Hover: slight scale (1.02) with enhanced shadow

**Buttons:**
- Primary: Apple blue background, white text, 12px border-radius
- Secondary: White background, blue border, blue text
- Large CTAs: 48px height, medium: 40px height
- Glass effect on hero buttons with backdrop blur

**Hero Section:**
- Full-bleed edge-to-edge layout
- Dark translucent overlay (rgba(0,0,0,0.4)) for text readability
- Large centered typography in white
- Subtle parallax scroll effect on background image

**Timeline (Education):**
- Vertical center line with circular nodes
- Cards alternate left/right on desktop, stack on mobile
- Scroll-triggered animations with fade-up entrance
- Blue accent line and filled nodes for active states

**Grid Layouts:**
- Projects: 3 columns desktop, 2 tablet, 1 mobile
- Skills: 4 columns desktop, 2 tablet, 1 mobile
- Responsive with consistent 24px gaps

### E. Interactions & Motion
- CSS transitions: 0.3s ease for hover states
- Scroll animations: fade-up with 0.6s duration
- Hover effects: scale(1.05) for cards, opacity changes for buttons
- Respect `prefers-reduced-motion` for accessibility
- Subtle parallax on hero (0.5x scroll speed)

## Images
**Hero Image:** Large, high-quality full-bleed background image from images/about/ folder with dark overlay for text contrast

**Profile Images:** Circular cropped images (180px diameter) with subtle borders

**Project Thumbnails:** Optimized to WebP format with fallbacks, lazy loading on non-hero images

**Gallery Grid:** Masonry layout for "Things I've worked on" with hover scale effects

## Accessibility Features
- WCAG AA color contrast compliance
- Keyboard navigation for all interactive elements
- Focus indicators with blue outline
- Semantic HTML5 structure with proper heading hierarchy
- Alt text for all images with descriptive content
- Skip links for main navigation

## Performance Optimizations
- WebP images with JPEG fallbacks
- Lazy loading for below-fold images
- Minimal custom JavaScript (<150KB)
- CSS variables for consistent theming
- Mobile-first responsive approach