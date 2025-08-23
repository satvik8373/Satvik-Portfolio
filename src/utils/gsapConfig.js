import { gsap } from "gsap";
    
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(Draggable, ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText);

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

// ScrollSmoother setup (optional - can be configured per instance)
// export const createScrollSmoother = (smooth = 1) => {
//   return ScrollSmoother.create({
//     smooth: smooth,
//     effects: true
//   });
// };

// Export configured GSAP instance
export { gsap };
export {
  Draggable,
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText
};

// Export a default GSAP instance with all plugins
export default gsap;
