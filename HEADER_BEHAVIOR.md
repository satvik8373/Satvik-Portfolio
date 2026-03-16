# Header Behavior Update

## Changes Made

### Header.jsx
1. **Added `showHeader` state** - Controls header visibility based on scroll position
2. **Updated scroll handler** - Calculates when to show header:
   - Scrollytelling section is 500vh (5x viewport height)
   - Header appears after scrolling past 80% of this section
   - Threshold: `windowHeight * 5 * 0.8`

3. **Updated animation** - Header slides in/out smoothly:
   ```javascript
   animate={{ 
     y: showHeader ? 0 : -100,
     opacity: showHeader ? 1 : 0
   }}
   ```

### ScrollyCanvas.jsx
- **Removed top gradient overlay** - No longer needed since header is hidden initially
- Full immersive experience at the start
- Bottom gradient remains for seamless transition to projects section

## User Experience

### Initial Load (Top of Page)
- ✅ Header completely hidden
- ✅ Full-screen immersive scrollytelling
- ✅ No UI distractions
- ✅ Clean, cinematic experience

### After Scrolling (80% through)
- ✅ Header smoothly slides in from top
- ✅ Navigation becomes available
- ✅ Smooth fade-in animation
- ✅ User can navigate to other sections

### Why 80%?
- Gives users time to experience the full scrollytelling
- Appears before reaching the projects section
- Provides navigation when users are ready to explore more
- Feels natural and intentional

## Technical Details
- Scroll threshold: `window.innerHeight * 5 * 0.8`
- Animation duration: 0.5s with easeInOut
- Header z-index: 50 (above content)
- Smooth transitions maintained
