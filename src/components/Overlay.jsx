import { useEffect, useRef } from 'react'

const getScrollProgress = (element) => {
  if (!element) return 0
  const rect = element.getBoundingClientRect()
  const scrollableDistance = Math.max(rect.height - window.innerHeight, 1)
  return Math.min(Math.max(-rect.top / scrollableDistance, 0), 1)
}

const lerp = (progress, inputStart, inputEnd, outputStart, outputEnd) => {
  const range = inputEnd - inputStart
  const ratio = range === 0 ? 1 : (progress - inputStart) / range
  const clamped = Math.min(Math.max(ratio, 0), 1)
  return outputStart + (outputEnd - outputStart) * clamped
}

const opacityFromStops = (progress, stops, values) => {
  for (let index = 0; index < stops.length - 1; index += 1) {
    if (progress <= stops[index + 1]) {
      return lerp(progress, stops[index], stops[index + 1], values[index], values[index + 1])
    }
  }
  return values[values.length - 1]
}

const Overlay = ({ containerRef }) => {
  const nameRef = useRef(null)
  const subtitleRef = useRef(null)
  const lineRef = useRef(null)
  const section1Ref = useRef(null)
  const section2Ref = useRef(null)
  const section3Ref = useRef(null)

  // GSAP animation on mount
  useEffect(() => {
    let nameSplit
    let subtitleSplit
    let timeline
    let isCancelled = false
    let idleId
    let introTimeoutId

    const runIntro = async () => {
      const [{ gsap }, { SplitText }] = await Promise.all([
        import('gsap'),
        import('gsap/SplitText'),
        document.fonts?.ready || Promise.resolve(),
      ])

      if (isCancelled || !nameRef.current || !subtitleRef.current) return

      gsap.registerPlugin(SplitText)

      nameSplit = new SplitText(nameRef.current, { type: 'chars' })
      subtitleSplit = new SplitText(subtitleRef.current, { type: 'chars' })

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

      timeline = gsap.timeline({ delay: 0.5 })

      timeline
        .to(nameSplit.chars, {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1,
          stagger: 0.03,
          ease: 'power3.out'
        })
        .to(lineRef.current, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.5')
        .to(subtitleSplit.chars, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.out'
        }, '-=0.4')
    }

    const scheduleIntro = () => {
      const scheduleIdle = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 1600))
      introTimeoutId = window.setTimeout(() => {
        idleId = scheduleIdle(runIntro, { timeout: 2500 })
      }, 3500)
    }

    if (document.readyState === 'complete') {
      scheduleIntro()
    } else {
      window.addEventListener('load', scheduleIntro, { once: true })
    }

    return () => {
      isCancelled = true
      window.removeEventListener('load', scheduleIntro)
      clearTimeout(introTimeoutId)
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId)
      if (timeline) timeline.kill()
      if (nameSplit) nameSplit.revert()
      if (subtitleSplit) subtitleSplit.revert()
    }
  }, [])

  useEffect(() => {
    let animationFrameId = null

    const updateProgress = () => {
      animationFrameId = null
      const progress = getScrollProgress(containerRef.current)
      const section1Opacity = opacityFromStops(progress, [0, 0.15, 0.25], [1, 1, 0])
      const section1Y = lerp(progress, 0, 0.25, 0, -100)
      const section2Opacity = opacityFromStops(progress, [0.25, 0.3, 0.5, 0.55], [0, 1, 1, 0])
      const section2X = lerp(progress, 0.25, 0.3, 100, 0)
      const section3Opacity = opacityFromStops(progress, [0.55, 0.6, 0.75, 0.78], [0, 1, 1, 0])
      const section3X = lerp(progress, 0.55, 0.6, -100, 0)

      if (section1Ref.current) {
        section1Ref.current.style.opacity = String(section1Opacity)
        section1Ref.current.style.transform = `translate3d(0, ${section1Y}px, 0)`
      }

      if (section2Ref.current) {
        section2Ref.current.style.opacity = String(section2Opacity)
        section2Ref.current.style.transform = `translate3d(${section2X}px, 0, 0)`
      }

      if (section3Ref.current) {
        section3Ref.current.style.opacity = String(section3Opacity)
        section3Ref.current.style.transform = `translate3d(${section3X}px, 0, 0)`
      }
    }

    const scheduleProgressUpdate = () => {
      if (animationFrameId) return
      animationFrameId = requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', scheduleProgressUpdate, { passive: true })
    window.addEventListener('resize', scheduleProgressUpdate, { passive: true })

    return () => {
      window.removeEventListener('scroll', scheduleProgressUpdate)
      window.removeEventListener('resize', scheduleProgressUpdate)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [containerRef])

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Section 1: Left-aligned with special typography */}
      <div
        ref={section1Ref}
        style={{ opacity: 1, transform: 'translate3d(0, 0px, 0)' }}
        className="absolute inset-0 flex items-center justify-start will-change-transform"
      >
        <div className="ml-8 md:ml-20 lg:ml-32 px-4 max-w-4xl">
          <h1 
            ref={nameRef}
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-2 leading-none tracking-tight" 
            style={{ 
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
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
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)',
                letterSpacing: '0.05em'
              }}
            >
              WEB & APP DEVELOPER
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Left */}
      <div
        ref={section2Ref}
        style={{ opacity: 0, transform: 'translate3d(100px, 0, 0)' }}
        className="absolute inset-0 flex items-center will-change-transform"
      >
        <div className="ml-8 md:ml-16 max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.9)' }}>
            MERN DEVELOPMENT
          </h2>
          <p className="text-xl md:text-2xl text-white/80" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)' }}>
            React, Node.js, MongoDB, REST APIs
          </p>
        </div>
      </div>

      {/* Section 3: Right */}
      <div
        ref={section3Ref}
        style={{ opacity: 0, transform: 'translate3d(-100px, 0, 0)' }}
        className="absolute inset-0 flex items-center justify-end will-change-transform"
      >
        <div className="mr-8 md:mr-16 max-w-2xl text-right">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.9)' }}>
            AI-Assisted Builds
          </h2>
          <p className="text-xl md:text-2xl text-white/80" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)' }}>
            Clean UI, APIs, mobile-ready workflows
          </p>
        </div>
      </div>
    </div>
  )
}

export default Overlay
