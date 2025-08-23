import { gsap } from './gsapConfig';

// Fade in animation
export const fadeIn = (element, duration = 0.6, delay = 0) => {
  return gsap.fromTo(element, 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration, delay, ease: "power2.out" }
  );
};

// Slide in from left
export const slideInLeft = (element, duration = 0.6, delay = 0) => {
  return gsap.fromTo(element,
    { x: -100, opacity: 0 },
    { x: 0, opacity: 1, duration, delay, ease: "power2.out" }
  );
};

// Slide in from right
export const slideInRight = (element, duration = 0.6, delay = 0) => {
  return gsap.fromTo(element,
    { x: 100, opacity: 0 },
    { x: 0, opacity: 1, duration, delay, ease: "power2.out" }
  );
};

// Slide in from bottom
export const slideInBottom = (element, duration = 0.6, delay = 0) => {
  return gsap.fromTo(element,
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration, delay, ease: "power2.out" }
  );
};

// Scale in animation
export const scaleIn = (element, duration = 0.6, delay = 0) => {
  return gsap.fromTo(element,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration, delay, ease: "back.out(1.7)" }
  );
};

// Stagger animation for multiple elements
export const staggerFadeIn = (elements, stagger = 0.1, duration = 0.6) => {
  return gsap.fromTo(elements,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration, stagger, ease: "power2.out" }
  );
};

// Text reveal animation (using opacity instead of clipPath for better compatibility)
export const textReveal = (element, duration = 0.8, delay = 0) => {
  return gsap.fromTo(element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration, delay, ease: "power2.out" }
  );
};

// Hover animations
export const hoverScale = (element, scale = 1.05, duration = 0.3) => {
  element.addEventListener('mouseenter', () => {
    gsap.to(element, { scale, duration, ease: "power2.out" });
  });
  
  element.addEventListener('mouseleave', () => {
    gsap.to(element, { scale: 1, duration, ease: "power2.out" });
  });
};

// Hover lift effect
export const hoverLift = (element, y = -10, duration = 0.3) => {
  element.addEventListener('mouseenter', () => {
    gsap.to(element, { y, duration, ease: "power2.out" });
  });
  
  element.addEventListener('mouseleave', () => {
    gsap.to(element, { y: 0, duration, ease: "power2.out" });
  });
};

// Parallax effect
export const parallax = (element, speed = 0.5) => {
  gsap.to(element, {
    yPercent: -50 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
};

// Counter animation
export const animateCounter = (element, endValue, duration = 2, delay = 0) => {
  return gsap.fromTo(element,
    { innerHTML: 0 },
    { 
      innerHTML: endValue, 
      duration, 
      delay, 
      ease: "power2.out",
      snap: { innerHTML: 1 },
      onUpdate: function() {
        element.innerHTML = Math.ceil(this.targets()[0].innerHTML);
      }
    }
  );
};

// Typing effect
export const typeWriter = (element, text, duration = 2, delay = 0) => {
  element.innerHTML = '';
  return gsap.to(element, {
    duration,
    delay,
    ease: "none",
    onUpdate: function() {
      const progress = this.progress();
      const charCount = Math.floor(text.length * progress);
      element.innerHTML = text.substring(0, charCount);
    }
  });
};

// Bounce animation
export const bounce = (element, duration = 0.6, delay = 0) => {
  return gsap.fromTo(element,
    { scale: 0 },
    { 
      scale: 1, 
      duration, 
      delay, 
      ease: "bounce.out",
      onComplete: () => {
        gsap.to(element, { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 });
      }
    }
  );
};

// Shake animation
export const shake = (element, duration = 0.6, delay = 0) => {
  return gsap.fromTo(element,
    { x: 0 },
    { 
      x: 0, 
      duration, 
      delay, 
      ease: "none",
      keyframes: {
        "0%": { x: 0 },
        "25%": { x: -10 },
        "50%": { x: 10 },
        "75%": { x: -10 },
        "100%": { x: 0 }
      }
    }
  );
};

// Pulse animation
export const pulse = (element, duration = 1, delay = 0) => {
  return gsap.to(element, {
    scale: 1.1,
    duration: duration / 2,
    delay,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1
  });
};

// Rotate animation
export const rotate = (element, duration = 2, delay = 0) => {
  return gsap.to(element, {
    rotation: 360,
    duration,
    delay,
    ease: "none",
    repeat: -1
  });
};

// Export all animations as a single object
export const animations = {
  fadeIn,
  slideInLeft,
  slideInRight,
  slideInBottom,
  scaleIn,
  staggerFadeIn,
  textReveal,
  hoverScale,
  hoverLift,
  parallax,
  animateCounter,
  typeWriter,
  bounce,
  shake,
  pulse,
  rotate
};
