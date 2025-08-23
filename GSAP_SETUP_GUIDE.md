# GSAP Setup Guide

This project has been configured with GSAP (GreenSock Animation Platform) for smooth, high-performance animations. Here's how to use it:

## 🚀 Quick Start

### 1. Import GSAP in your component

```jsx
import { gsap } from '../utils/gsapConfig';
// or import specific plugins
import { ScrollTrigger, ScrollSmoother, SplitText } from '../utils/gsapConfig';
```

### 2. Use the custom hook for React components

```jsx
import { useGSAP } from '../utils/useGSAP';

const MyComponent = () => {
  const { elementRef, fadeIn, slideInLeft } = useGSAP();

  useEffect(() => {
    // Trigger animations when component mounts
    fadeIn(1, 0.5); // duration: 1s, delay: 0.5s
  }, [fadeIn]);

  return (
    <div ref={elementRef} className="my-element">
      This will animate in!
    </div>
  );
};
```

### 3. Use utility functions directly

```jsx
import { fadeIn, staggerFadeIn, hoverScale } from '../utils/gsapAnimations';

// Fade in a single element
fadeIn(document.querySelector('.my-element'), 0.8, 0.2);

// Stagger animation for multiple elements
const elements = document.querySelectorAll('.stagger-item');
staggerFadeIn(elements, 0.1, 0.6);

// Add hover effect
hoverScale(document.querySelector('.hover-element'), 1.1, 0.3);
```

## 🎯 Available Animations

### Hook-based animations (useGSAP hook)
- `fadeIn(duration, delay)` - Fade in from bottom
- `slideInLeft(duration, delay)` - Slide in from left
- `slideInRight(duration, delay)` - Slide in from right
- `slideInBottom(duration, delay)` - Slide in from bottom
- `scaleIn(duration, delay)` - Scale in with bounce effect
- `bounce(duration, delay)` - Bounce in animation
- `shake(duration, delay)` - Shake animation
- `pulse(duration, delay)` - Continuous pulse
- `rotate(duration, delay)` - Continuous rotation

### Hover effects
- `addHoverScale(scale, duration)` - Scale on hover
- `addHoverLift(y, duration)` - Lift effect on hover

### Special effects
- `addParallax(speed)` - Parallax scrolling effect

### Animation controls
- `stop()` - Stop current animation
- `pause()` - Pause current animation
- `resume()` - Resume paused animation
- `reverse()` - Reverse current animation
- `restart()` - Restart current animation

## 🛠️ Utility Functions

### Basic animations
```jsx
import { 
  fadeIn, 
  slideInLeft, 
  slideInRight, 
  slideInBottom, 
  scaleIn,
  staggerFadeIn,
  textReveal
} from '../utils/gsapAnimations';

// Apply animations to DOM elements
fadeIn(element, 0.6, 0);
slideInLeft(element, 0.8, 0.2);
scaleIn(element, 1, 0.5);
```

### Hover effects
```jsx
import { hoverScale, hoverLift } from '../utils/gsapAnimations';

// Add hover animations
hoverScale(element, 1.05, 0.3);
hoverLift(element, -10, 0.3);
```

### Advanced effects
```jsx
import { parallax, animateCounter, typeWriter } from '../utils/gsapAnimations';

// Parallax effect
parallax(element, 0.5);

// Counter animation
animateCounter(element, 100, 2, 0);

// Typewriter effect
typeWriter(element, "Hello World!", 2, 0);
```

## 📱 ScrollTrigger & ScrollSmoother Integration

ScrollTrigger and ScrollSmoother are automatically configured and ready to use:

```jsx
import { ScrollTrigger, ScrollSmoother } from '../utils/gsapConfig';

// Create smooth scrolling
const smoother = ScrollSmoother.create({
  smooth: 1,
  effects: true
});

// Create scroll-triggered animation
gsap.to('.my-element', {
  y: -100,
  scrollTrigger: {
    trigger: '.my-element',
    start: 'top center',
    end: 'bottom center',
    scrub: true
  }
});
```

## 🎨 Custom Animations

### Using GSAP directly
```jsx
import { gsap } from '../utils/gsapConfig';

// Timeline for complex animations
const tl = gsap.timeline();
tl.to('.element1', { x: 100, duration: 1 })
  .to('.element2', { y: -50, duration: 0.8 }, '-=0.5')
  .to('.element3', { rotation: 360, duration: 1.2 }, '-=0.8');
```

### Text splitting with SplitText
```jsx
import { SplitText } from '../utils/gsapConfig';

// Split text into characters, words, or lines
const splitText = new SplitText('.my-text', {
  type: "chars,words,lines",
  linesClass: "overflow-hidden"
});

// Animate each character
gsap.from(splitText.chars, {
  opacity: 0,
  y: 50,
  duration: 0.8,
  stagger: 0.02,
  ease: "back.out(1.7)"
});
```

### Drag and drop with Draggable
```jsx
import { Draggable } from '../utils/gsapConfig';

// Make an element draggable
Draggable.create('.draggable-element', {
  type: "x,y",
  bounds: ".container",
  inertia: true,
  onDrag: function() {
    // Custom logic during drag
  },
  onDragEnd: function() {
    // Custom logic when drag ends
  }
});
```

### Custom keyframe animations
```jsx
gsap.to('.my-element', {
  duration: 2,
  ease: "none",
  keyframes: {
    "0%": { x: 0, y: 0 },
    "50%": { x: 100, y: -50 },
    "100%": { x: 0, y: 0 }
  }
});
```

## 🔧 Configuration

### Global defaults
GSAP is configured with sensible defaults:
- Default ease: `power2.out`
- Default duration: `0.6s`
- ScrollTrigger markers: `false` (set to `true` for debugging)

### Customizing defaults
```jsx
import { gsap } from '../utils/gsapConfig';

// Override global defaults
gsap.defaults({
  ease: "bounce.out",
  duration: 1
});
```

## 📚 Examples

### Stagger animation for list items
```jsx
useEffect(() => {
  const listItems = document.querySelectorAll('.list-item');
  staggerFadeIn(listItems, 0.1, 0.8);
}, []);
```

### Conditional animations
```jsx
const { elementRef, fadeIn, slideInLeft } = useGSAP();

useEffect(() => {
  if (isVisible) {
    fadeIn(1, 0);
  } else {
    slideInLeft(0.8, 0);
  }
}, [isVisible, fadeIn, slideInLeft]);
```

### Animation sequences
```jsx
const { elementRef, fadeIn, scaleIn } = useGSAP();

useEffect(() => {
  const tl = gsap.timeline();
  tl.add(() => fadeIn(0.6, 0))
    .add(() => scaleIn(0.8, 0.3), '-=0.3');
}, [fadeIn, scaleIn]);
```

## 🚨 Best Practices

1. **Always use refs** for DOM elements in React
2. **Clean up animations** when components unmount (handled automatically by the hook)
3. **Use the hook** for React components, utility functions for vanilla JS
4. **Keep animations smooth** by using appropriate easing and duration
5. **Test on mobile** - some animations might need adjustment for smaller screens

## 🔍 Debugging

### Enable ScrollTrigger markers
```jsx
import { ScrollTrigger } from '../utils/gsapConfig';

ScrollTrigger.defaults({
  markers: true
});
```

### Check GSAP version
```jsx
import { gsap } from '../utils/gsapConfig';
console.log('GSAP version:', gsap.version);
```

## 📖 Additional Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollTrigger Guide](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP Easing Visualizer](https://greensock.com/docs/v3/Eases)

## 🎯 Demo Component

Check out `src/components/GSAPDemo.jsx` for a comprehensive example of all available animations and features.
