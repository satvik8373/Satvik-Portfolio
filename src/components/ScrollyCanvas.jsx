import { useEffect, useRef, useState } from 'react'
import { useScroll } from 'framer-motion'

const ScrollyCanvas = () => {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [images, setImages] = useState([])
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [gradientOpacity, setGradientOpacity] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // Detect theme changes
  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDarkTheme(theme !== 'light')
    }
    
    updateTheme()
    
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    return () => observer.disconnect()
  }, [])

  // Control gradient opacity based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      // Start showing gradient at 85% scroll, fully visible at 95%
      if (progress < 0.85) {
        setGradientOpacity(0)
      } else if (progress >= 0.85 && progress < 0.95) {
        // Fade in from 85% to 95%
        const fadeProgress = (progress - 0.85) / 0.1
        setGradientOpacity(fadeProgress)
      } else {
        setGradientOpacity(1)
      }
    })
    
    return () => unsubscribe()
  }, [scrollYProgress])

  // Preload all images
  useEffect(() => {
    const frameCount = 192
    const loadedImages = []
    let loadedCount = 0
    const handleFrameReady = () => {
      loadedCount++
      const progress = Math.round((loadedCount / frameCount) * 100)
      setLoadProgress(progress)
      if (loadedCount === frameCount) {
        setImagesLoaded(true)
      }
    }

    const preloadImages = () => {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image()
        const frameNumber = String(i).padStart(3, '0')
        img.src = `/ezgif-split/frame_${frameNumber}_delay-0.041s.webp`
        
        img.onload = handleFrameReady
        img.onerror = handleFrameReady
        
        loadedImages.push(img)
      }
      setImages(loadedImages)
    }

    preloadImages()
  }, [])

  // Render canvas based on scroll
  useEffect(() => {
    if (!imagesLoaded || images.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })

    const render = () => {
      const scrollProgress = scrollYProgress.get()
      const frameIndex = Math.min(
        Math.floor(scrollProgress * images.length),
        images.length - 1
      )

      const img = images[frameIndex]
      if (!img || !img.complete) return

      // Get device pixel ratio for high-DPI displays
      const dpr = window.devicePixelRatio || 1
      
      // Set canvas size with device pixel ratio for sharp rendering
      const displayWidth = window.innerWidth
      const displayHeight = window.innerHeight
      
      canvas.width = displayWidth * dpr
      canvas.height = displayHeight * dpr
      
      // Scale context to match device pixel ratio
      ctx.scale(dpr, dpr)
      
      // Set canvas display size (CSS pixels)
      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`

      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // Calculate dimensions for object-fit: cover (fill entire viewport)
      const canvasAspect = displayWidth / displayHeight
      const imgAspect = img.width / img.height

      let drawWidth, drawHeight, offsetX, offsetY

      if (canvasAspect > imgAspect) {
        // Canvas is wider - fit to width
        drawWidth = displayWidth
        drawHeight = displayWidth / imgAspect
        offsetX = 0
        // Center vertically to avoid any top gap
        offsetY = (displayHeight - drawHeight) / 2
      } else {
        // Canvas is taller - fit to height
        drawHeight = displayHeight
        drawWidth = displayHeight * imgAspect
        offsetX = (displayWidth - drawWidth) / 2
        // No vertical offset when heights match
        offsetY = 0
      }

      ctx.clearRect(0, 0, displayWidth, displayHeight)
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }

    const unsubscribe = scrollYProgress.on('change', render)
    
    // Render first frame immediately when images are loaded
    setTimeout(render, 0)

    // Handle resize with debounce for performance
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(render, 100)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      unsubscribe()
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [images, imagesLoaded, scrollYProgress])

  return (
    <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-primary theme-transition">
        {/* High-quality first frame as background - shows immediately */}
        {!imagesLoaded && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(/ezgif-split/frame_000_delay-0.041s.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 10%'
            }}
          />
        )}
        
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ 
            objectFit: 'cover',
            imageRendering: 'high-quality',
            opacity: imagesLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
        />
        
        {/* Loading indicator - shows progress until all frames are ready */}
        {!imagesLoaded && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="text-white/60 text-sm font-medium backdrop-blur-sm bg-black/30 px-4 py-2 rounded-full">
              Loading experience... {loadProgress}%
            </div>
          </div>
        )}
        
        {/* Gradient overlay at bottom for seamless transition - only shows near end of scroll */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-20 transition-opacity duration-500" 
          style={{
            opacity: gradientOpacity,
            background: isDarkTheme 
              ? 'linear-gradient(to top, rgb(22, 21, 19) 0%, rgb(22, 21, 19) 15%, rgba(22, 21, 19, 0.95) 30%, rgba(22, 21, 19, 0.7) 50%, rgba(22, 21, 19, 0.3) 70%, transparent 100%)'
              : 'linear-gradient(to top, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 15%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.3) 70%, transparent 100%)'
          }}
        />
      </div>
    </div>
  )
}

export default ScrollyCanvas
