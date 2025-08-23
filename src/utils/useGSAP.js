import { useEffect, useRef, useCallback } from 'react';
import { gsap } from './gsapConfig';

export const useGSAP = () => {
  const elementRef = useRef(null);
  const animationRef = useRef(null);

  // Cleanup function for animations
  const cleanup = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }
  }, []);

  // Fade in animation
  const fadeIn = useCallback((duration = 0.6, delay = 0) => {
    if (elementRef.current) {
      cleanup();
      animationRef.current = gsap.fromTo(elementRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration, delay, ease: "power2.out" }
      );
    }
  }, [cleanup]);

  // Slide in from left
  const slideInLeft = useCallback((duration = 0.6, delay = 0) => {
    if (elementRef.current) {
      cleanup();
      animationRef.current = gsap.fromTo(elementRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration, delay, ease: "power2.out" }
      );
    }
  }, [cleanup]);

  // Slide in from right
  const slideInRight = useCallback((duration = 0.6, delay = 0) => {
    if (elementRef.current) {
      cleanup();
      animationRef.current = gsap.fromTo(elementRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration, delay, ease: "power2.out" }
      );
    }
  }, [cleanup]);

  // Slide in from bottom
  const slideInBottom = useCallback((duration = 0.6, delay = 0) => {
    if (elementRef.current) {
      cleanup();
      animationRef.current = gsap.fromTo(elementRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration, delay, ease: "power2.out" }
      );
    }
  }, [cleanup]);

  // Scale in animation
  const scaleIn = useCallback((duration = 0.6, delay = 0) => {
    if (elementRef.current) {
      cleanup();
      animationRef.current = gsap.fromTo(elementRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration, delay, ease: "back.out(1.7)" }
      );
    }
  }, [cleanup]);

  // Hover animations
  const addHoverScale = useCallback((scale = 1.05, duration = 0.3) => {
    if (elementRef.current) {
      const element = elementRef.current;
      
      const onMouseEnter = () => {
        gsap.to(element, { scale, duration, ease: "power2.out" });
      };
      
      const onMouseLeave = () => {
        gsap.to(element, { scale: 1, duration, ease: "power2.out" });
      };

      element.addEventListener('mouseenter', onMouseEnter);
      element.addEventListener('mouseleave', onMouseLeave);

      // Return cleanup function
      return () => {
        element.removeEventListener('mouseenter', onMouseEnter);
        element.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, []);

  // Hover lift effect
  const addHoverLift = useCallback((y = -10, duration = 0.3) => {
    if (elementRef.current) {
      const element = elementRef.current;
      
      const onMouseEnter = () => {
        gsap.to(element, { y, duration, ease: "power2.out" });
      };
      
      const onMouseLeave = () => {
        gsap.to(element, { y: 0, duration, ease: "power2.out" });
      };

      element.addEventListener('mouseenter', onMouseEnter);
      element.addEventListener('mouseleave', onMouseLeave);

      // Return cleanup function
      return () => {
        element.removeEventListener('mouseenter', onMouseEnter);
        element.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, []);

  // Parallax effect
  const addParallax = useCallback((speed = 0.5) => {
    if (elementRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      tl.to(elementRef.current, {
        yPercent: -50 * speed,
        ease: "none"
      });

      animationRef.current = tl;
    }
  }, []);

  // Bounce animation
  const bounce = useCallback((duration = 0.6, delay = 0) => {
    if (elementRef.current) {
      cleanup();
      animationRef.current = gsap.fromTo(elementRef.current,
        { scale: 0 },
        { 
          scale: 1, 
          duration, 
          delay, 
          ease: "bounce.out",
          onComplete: () => {
            gsap.to(elementRef.current, { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 });
          }
        }
      );
    }
  }, [cleanup]);

  // Shake animation
  const shake = useCallback((duration = 0.6, delay = 0) => {
    if (elementRef.current) {
      cleanup();
      animationRef.current = gsap.fromTo(elementRef.current,
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
    }
  }, [cleanup]);

  // Pulse animation
  const pulse = useCallback((duration = 1, delay = 0) => {
    if (elementRef.current) {
      cleanup();
      animationRef.current = gsap.to(elementRef.current, {
        scale: 1.1,
        duration: duration / 2,
        delay,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  }, [cleanup]);

  // Rotate animation
  const rotate = useCallback((duration = 2, delay = 0) => {
    if (elementRef.current) {
      cleanup();
      animationRef.current = gsap.to(elementRef.current, {
        rotation: 360,
        duration,
        delay,
        ease: "none",
        repeat: -1
      });
    }
  }, [cleanup]);

  // Stop current animation
  const stop = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Pause current animation
  const pause = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  }, []);

  // Resume current animation
  const resume = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.resume();
    }
  }, []);

  // Reverse current animation
  const reverse = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.reverse();
    }
  }, []);

  // Restart current animation
  const restart = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.restart();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    elementRef,
    fadeIn,
    slideInLeft,
    slideInRight,
    slideInBottom,
    scaleIn,
    addHoverScale,
    addHoverLift,
    addParallax,
    bounce,
    shake,
    pulse,
    rotate,
    stop,
    pause,
    resume,
    reverse,
    restart
  };
};
