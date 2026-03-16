import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap } from '../../gsap-public/esm/index.js'
import { SplitText } from '../../gsap-public/esm/SplitText.js'

gsap.registerPlugin(SplitText)

const Overlay = ({ containerRef }) => {
  const nameRef = useRef(null)
  const subtitleRef = useRef(null)
  const lineRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // GSAP animation on mount
  useEffect(() => {
    if (!nameRef.current || !subtitleRef.current) return

    // Split text into characters
    const nameSplit = new SplitText(nameRef.current, { type: 'chars' })
    const subtitleSplit = new SplitText(subtitleRef.current, { type: 'chars' })

    // Set initial state
    gsap.set(nameSplit.chars, { 
      opacity: 0, 
      x: -100,
      rotationY: -90,
      transformOrigin: 'left center'
    })
    gsap.set(subtitleSplit.chars, { 
      opacity: 0, 
      y: 30
    })
    gsap.set(lineRef.current, { 
      scaleX: 0, 
      transformOrigin: 'left center' 
    })

    // Create timeline
    const tl = gsap.timeline({ delay: 0.5 })

    // Animate name with stagger
    tl.to(nameSplit.chars, {
      opacity: 1,
      x: 0,
      rotationY: 0,
      duration: 1,
      stagger: 0.03,
      ease: 'power3.out'
    })
    
    // Animate line
    .to(lineRef.current, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5')
    
    // Animate subtitle
    .to(subtitleSplit.chars, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.02,
      ease: 'power2.out'
    }, '-=0.4')

    return () => {
      nameSplit.revert()
      subtitleSplit.revert()
    }
  }, [])

  // Section 1: 0% - Center
  const section1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0])
  const section1Y = useTransform(scrollYProgress, [0, 0.25], [0, -100])

  // Section 2: 30% - Left
  const section2Opacity = useTransform(scrollYProgress, [0.25, 0.3, 0.5, 0.55], [0, 1, 1, 0])
  const section2X = useTransform(scrollYProgress, [0.25, 0.3], [100, 0])

  // Section 3: 60% - Right
  const section3Opacity = useTransform(scrollYProgress, [0.55, 0.6, 0.75, 0.78], [0, 1, 1, 0])
  const section3X = useTransform(scrollYProgress, [0.55, 0.6], [-100, 0])

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Section 1: Left-aligned with special typography */}
      <motion.div
        style={{ opacity: section1Opacity, y: section1Y }}
        className="absolute inset-0 flex items-center justify-start"
      >
        <div className="ml-8 md:ml-20 lg:ml-32 px-4 max-w-4xl">
          <h1 
            ref={nameRef}
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-2 leading-none tracking-tight" 
            style={{ 
              fontFamily: "'Inter', sans-serif",
              textShadow: '0 8px 32px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.7)',
              letterSpacing: '-0.04em'
            }}
          >
            SATVIK<br/>PATEL
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <div 
              ref={lineRef}
              className="h-1 w-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full"
            ></div>
            <p 
              ref={subtitleRef}
              className="text-xl md:text-3xl lg:text-4xl text-white/95 font-semibold tracking-wide" 
              style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)',
                letterSpacing: '0.05em'
              }}
            >
              WEB & APP DEVELOPER
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section 2: Left */}
      <motion.div
        style={{ opacity: section2Opacity, x: section2X }}
        className="absolute inset-0 flex items-center"
      >
        <div className="ml-8 md:ml-16 max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.9)' }}>
            PROJECT HIGHLIGHTS
          </h2>
          <p className="text-xl md:text-2xl text-white/80" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)' }}>
            Mavrixfy, Pranshi Multiplast, Cafe Store
          </p>
        </div>
      </motion.div>

      {/* Section 3: Right */}
      <motion.div
        style={{ opacity: section3Opacity, x: section3X }}
        className="absolute inset-0 flex items-center justify-end"
      >
        <div className="mr-8 md:mr-16 max-w-2xl text-right">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.9)' }}>
            Coming Up
          </h2>
          <p className="text-xl md:text-2xl text-white/80" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)' }}>
            Instagram Automation
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Overlay
