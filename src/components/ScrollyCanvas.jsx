import { useEffect, useRef, useState } from 'react'
import { useScroll } from 'framer-motion'

const ScrollyCanvas = () => {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [images, setImages] = useState([])
  const [imagesLoaded, setImagesLoaded] = useState(false)
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
        const fadeProgress = (progress - 0.85) / 0.1
        setGradientOpacity(fadeProgress)
      } else {
        setGradientOpacity(1)
      }
    })
    
    return () => unsubscribe()
  }, [scrollYProgress])

  // Preload images with priority loading
  useEffect(() => {
    const frameCount = 192
    const loadedImages = new Array(frameCount)
    let loadedCount = 0

    const preloadImages = () => {
      // Load first frame immediately
      const firstImg = new Image()
      firstImg.src = `/ezgif-split/frame_000_delay-0.041s.webp`
      firstImg.onload = () => {
        loadedImages[0] = firstImg
        setImages([...loadedImages])
        setImagesLoaded(true) // Show canvas immediately with first frame
      }
      
      // Load remaining frames in background
      for (let i = 1; i < frameCount; i++) {
        const img = new Image()
        const frameNumber = String(i).padStart(3, '0')
        img.src = `/ezgif-split/frame_${frameNumber}_delay-0.041s.webp`
        
        img.onload = () => {
          loadedCount++
          loadedImages[i] = img
          if (loadedCount % 10 === 0 || loadedCount === frameCount - 1) {
            setImages([...loadedImages])
          }
        }
      }
    }

    preloadImages()
  }, [])

  // Optimized canvas rendering
  useEffect(() => {
    if (!imagesLoaded || images.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d', { 
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    })

    let animationFrameId = null
    let lastFrameIndex = -1
    let isResizing = false

    const render = () => {
      const scrollProgress = scrollYProgress.get()
      const frameIndex = Math.min(
        Math.floor(scrollProgress * (images.length - 1)),
        images.length - 1
      )

      // Skip if same frame and not resizing
      if (frameIndex === lastFrameIndex && !isResizing) return
      lastFrameIndex = frameIndex

      const img = images[frameIndex]
      if (!img || !img.complete) return

      // Cap DPR at 2 for performance
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      
      const displayWidth = window.innerWidth
      const displayHeight = window.innerHeight
      
      // Only resize if dimensions changed
      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr
        canvas.height = displayHeight * dpr
        canvas.style.width = `${displayWidth}px`
        canvas.style.height = `${displayHeight}px`
        ctx.scale(dpr, dpr)
      }

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'medium'

      const canvasAspect = displayWidth / displayHeight
      const imgAspect = img.width / img.height

      let drawWidth, drawHeight, offsetX, offsetY

      if (canvasAspect > imgAspect) {
        drawWidth = displayWidth
        drawHeight = displayWidth / imgAspect
        offsetX = 0
        offsetY = (displayHeight - drawHeight) / 2
      } else {
        drawHeight = displayHeight
        drawWidth = displayHeight * imgAspect
        offsetX = (displayWidth - drawWidth) / 2
        offsetY = 0
      }

      ctx.clearRect(0, 0, displayWidth, displayHeight)
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
      
      isResizing = false
    }

    // Use RAF for smooth rendering
    const scheduleRender = () => {
      if (animationFrameId) return
      animationFrameId = requestAnimationFrame(() => {
        render()
        animationFrameId = null
      })
    }

    const unsubscribe = scrollYProgress.on('change', scheduleRender)
    
    // Initial render
    render()

    // Optimized resize
    let resizeTimeout
    const handleResize = () => {
      isResizing = true
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(scheduleRender, 150)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      unsubscribe()
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [images, imagesLoaded, scrollYProgress])

  return (
    <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-primary theme-transition">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ 
            objectFit: 'cover',
            imageRendering: 'auto',
            willChange: 'contents'
          }}
        />
        
        {/* Gradient overlay - only shows near end */}
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
