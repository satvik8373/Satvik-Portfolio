# Scrollytelling Portfolio Implementation

## Overview
High-end scrollytelling portfolio with image sequence animation driven by scroll position. Replaces the original hero section with an immersive scroll-linked experience.

## What Changed

### New Components
1. **ScrollyCanvas.jsx** - Canvas-based image sequence scrubber
2. **Overlay.jsx** - Parallax text overlays
3. **ProjectsGlass.jsx** - Glassmorphism project grid

### Updated Components
- **Home.jsx** - Now integrates scrollytelling with existing sections
- **App.jsx** - Simplified to use new Home component

## Components

### 1. ScrollyCanvas.jsx
- 500vh container with sticky canvas
- Preloads 192 WebP frames from `/ezgif-split/`
- Maps scroll progress to frame index (0-191)
- Object-fit: cover for responsive display
- Smooth scroll-linked animation using Framer Motion

### 2. Overlay.jsx
- Parallax text overlays (z-10)
- Three animated sections with fade/slide effects:
  - **0%**: "Satvik Patel. Creative Developer." (center)
  - **30%**: "I build digital experiences." (left)
  - **60%**: "Bridging design and engineering." (right)

### 3. ProjectsGlass.jsx
- Glassmorphism grid after scroll zone
- Backdrop-blur effects with thin borders
- Subtle hover glow animations
- Responsive 2-column layout

## File Structure
```
src/
├── components/
│   ├── Home.jsx (updated - main page)
│   ├── ScrollyCanvas.jsx (new)
│   ├── Overlay.jsx (new)
│   └── ProjectsGlass.jsx (new)
└── App.jsx (updated - simplified routing)

public/
└── ezgif-split/ (192 WebP frames)
```

## Usage

```bash
npm run dev
```

Navigate to `http://localhost:3000` to see the scrollytelling experience.

## Navigation
The site maintains the original navigation structure:
- Home (scrollytelling hero)
- Projects (glassmorphism grid)
- Experience
- Contact

## Tech Stack
- React + Vite
- Framer Motion (scroll animations)
- Tailwind CSS (styling)
- Canvas API (image rendering)
- nano-banana (UI components)

## Performance Notes
- All 192 frames are preloaded for smooth scrubbing
- Canvas rendering for optimal performance
- Scroll-linked animations use Framer Motion's useScroll
- Images are WebP format for smaller file sizes
