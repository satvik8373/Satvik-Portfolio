import { gsap } from "gsap";
    
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Global GSAP defaults
gsap.defaults({
  ease: "power2.out",
  duration: 0.6
});

// ScrollTrigger defaults
ScrollTrigger.defaults({
  markers: false, // Set to true for debugging
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play none none reverse"
});



// Export configured GSAP instance
export { gsap };
export {
  ScrollTrigger,
  ScrollSmoother
};

// Export a default GSAP instance with all plugins
export default gsap;
