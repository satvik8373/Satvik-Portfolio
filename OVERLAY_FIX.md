# Overlay Text Persistence Fix

## Problem
The "Bridging design and engineering" text from the Overlay component was still visible after scrolling past the scrollytelling section into the Projects section.

## Root Cause
The Overlay component was using `useScroll()` without a target, which tracked the entire page scroll (0-100% of the whole page). This meant the overlay text animations were based on the full page scroll, not just the scrollytelling section.

## Solution

### 1. Scoped Scroll Tracking
Updated Overlay to accept a `containerRef` prop and track only the scrollytelling section:

```javascript
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start start', 'end end']
})
```

### 2. Shared Reference
Created a shared ref in Home.jsx that wraps the scrollytelling section:

```javascript
const scrollyRef = useRef(null)

<div id="home" className="relative" ref={scrollyRef}>
  <ScrollyCanvas />
  <Overlay containerRef={scrollyRef} />
</div>
```

### 3. Earlier Fade Out
Adjusted Section 3 opacity to fade out earlier (at 78% instead of 85%):

```javascript
const section3Opacity = useTransform(scrollYProgress, [0.55, 0.6, 0.75, 0.78], [0, 1, 1, 0])
```

## Result
- ✅ Overlay text only appears during scrollytelling section
- ✅ Text completely fades out before reaching projects section
- ✅ No text overlap with other sections
- ✅ Clean transition between sections
- ✅ Scroll progress is now relative to the 500vh scrollytelling container, not the entire page

## Technical Details
- Overlay scroll progress: 0% = start of scrollytelling, 100% = end of scrollytelling
- Section 1 (center): 0-25%
- Section 2 (left): 25-55%
- Section 3 (right): 55-78%
- All text faded out by 78% of scrollytelling section
