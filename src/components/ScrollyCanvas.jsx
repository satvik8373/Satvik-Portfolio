import { useEffect, useRef, useState } from 'react'

const frameCount = 192
const framePath = (index) => {
  const frameNumber = String(index).padStart(3, '0')
  return `/ezgif-split/frame_${frameNumber}_delay-0.041s.webp`
}

const clampFrameIndex = (index) => Math.min(Math.max(index, 0), frameCount - 1)

const getScrollProgress = (element) => {
  if (!element) return 0
  const rect = element.getBoundingClientRect()
  const scrollableDistance = Math.max(rect.height - window.innerHeight, 1)
  return Math.min(Math.max(-rect.top / scrollableDistance, 0), 1)
}

const ScrollyCanvas = () => {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [isDarkTheme, setIsDarkTheme] = useState(() => document.documentElement.getAttribute('data-theme') !== 'light')
  const [gradientOpacity, setGradientOpacity] = useState(0)

  // Detect theme changes
  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDarkTheme(theme !== 'light')
    }
    
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    return () => observer.disconnect()
  }, [])

  // Control gradient opacity based on scroll progress
  useEffect(() => {
    let animationFrameId = null

    const updateGradient = () => {
      animationFrameId = null
      const progress = getScrollProgress(containerRef.current)

      // Start showing gradient at 85% scroll, fully visible at 95%
      if (progress < 0.85) {
        setGradientOpacity(0)
      } else if (progress >= 0.85 && progress < 0.95) {
        const fadeProgress = (progress - 0.85) / 0.1
        setGradientOpacity(fadeProgress)
      } else {
        setGradientOpacity(1)
      }
    }

    const scheduleGradientUpdate = () => {
      if (animationFrameId) return
      animationFrameId = requestAnimationFrame(updateGradient)
    }

    updateGradient()
    window.addEventListener('scroll', scheduleGradientUpdate, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', scheduleGradientUpdate)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Preload images and render frames directly to canvas.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const loadedImages = new Array(frameCount)
    let animationFrameId = null
    let smoothingFrameId = null
    let lastFrameIndex = -1
    let lastRenderedIndex = -1
    let lastRenderedImage = null
    let currentFrame = 0
    let targetFrame = 0
    let isResizing = false
    let resizeTimeout
    let isCancelled = false
    let idlePreloadId = null
    let canPreloadAhead = false
    let preloadDelayId = null
    const loadingFrames = new Set()

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    })

    const findNearestLoadedFrame = (targetIndex) => {
      if (loadedImages[targetIndex]) return targetIndex

      for (let distance = 1; distance <= 12; distance += 1) {
        const previousIndex = targetIndex - distance
        const nextIndex = targetIndex + distance

        if (previousIndex >= 0 && loadedImages[previousIndex]) return previousIndex
        if (nextIndex < frameCount && loadedImages[nextIndex]) return nextIndex
      }

      return lastRenderedImage ? lastRenderedIndex : 0
    }

    const loadFrame = (index, fetchPriority = 'auto') => {
      const nextIndex = clampFrameIndex(index)
      if (loadedImages[nextIndex] || loadingFrames.has(nextIndex)) return

      loadingFrames.add(nextIndex)
      const img = new Image()
      img.decoding = 'async'
      img.fetchPriority = fetchPriority
      img.src = framePath(nextIndex)

      img.onload = () => {
        loadingFrames.delete(nextIndex)
        if (isCancelled) return
        loadedImages[nextIndex] = img
        scheduleRender()
      }

      img.onerror = () => {
        loadingFrames.delete(nextIndex)
      }
    }

    const preloadAroundFrame = (frameIndex) => {
      const direction = frameIndex >= lastFrameIndex ? 1 : -1
      loadFrame(frameIndex)

      if (!canPreloadAhead) return

      const priorityFrames = [
        frameIndex + direction,
        frameIndex + direction * 2,
        frameIndex - direction,
        frameIndex + direction * 3,
        frameIndex - direction * 2,
      ]

      priorityFrames.forEach((index) => loadFrame(index))

      const scheduleIdle = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 250))
      if (idlePreloadId) return

      idlePreloadId = scheduleIdle(() => {
        idlePreloadId = null
        if (isCancelled) return

        for (let offset = 4; offset <= 18; offset += 1) {
          loadFrame(frameIndex + direction * offset, 'low')
        }

        for (let offset = 3; offset <= 8; offset += 1) {
          loadFrame(frameIndex - direction * offset, 'low')
        }
      }, { timeout: 700 })
    }

    const drawFrame = (frameIndex) => {
      const roundedFrameIndex = clampFrameIndex(Math.round(frameIndex))
      const scrollProgress = getScrollProgress(containerRef.current)
      targetFrame = scrollProgress * (frameCount - 1)

      preloadAroundFrame(roundedFrameIndex)

      const drawableIndex = findNearestLoadedFrame(roundedFrameIndex)
      if (roundedFrameIndex === lastFrameIndex && drawableIndex === lastRenderedIndex && !isResizing) return
      lastFrameIndex = roundedFrameIndex

      const img = loadedImages[drawableIndex] || lastRenderedImage
      if (!img || !img.complete) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const displayWidth = window.innerWidth
      const displayHeight = window.innerHeight

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr
        canvas.height = displayHeight * dpr
        canvas.style.width = `${displayWidth}px`
        canvas.style.height = `${displayHeight}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
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
      lastRenderedIndex = drawableIndex
      lastRenderedImage = img
      isResizing = false
    }

    const tickSmoothing = () => {
      const distance = targetFrame - currentFrame
      const step = Math.abs(distance) < 0.12 ? distance : distance * 0.28

      currentFrame += step
      drawFrame(currentFrame)

      if (Math.abs(targetFrame - currentFrame) > 0.12 && !isCancelled) {
        smoothingFrameId = requestAnimationFrame(tickSmoothing)
      } else {
        currentFrame = targetFrame
        drawFrame(currentFrame)
        smoothingFrameId = null
      }
    }

    const render = () => {
      const scrollProgress = getScrollProgress(containerRef.current)
      targetFrame = scrollProgress * (frameCount - 1)

      if (!smoothingFrameId) {
        smoothingFrameId = requestAnimationFrame(tickSmoothing)
      }
    }

    const scheduleRender = () => {
      if (animationFrameId) return
      animationFrameId = requestAnimationFrame(() => {
        render()
        animationFrameId = null
      })
    }

    loadFrame(0, 'high')
    preloadDelayId = window.setTimeout(() => {
      canPreloadAhead = true
      for (let index = 1; index <= 8; index += 1) {
        loadFrame(index, 'low')
      }
    }, 2500)

    const handleScroll = () => {
      canPreloadAhead = true
      scheduleRender()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial render
    render()

    // Optimized resize
    const handleResize = () => {
      isResizing = true
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(scheduleRender, 150)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      isCancelled = true
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      clearTimeout(preloadDelayId)
      clearTimeout(resizeTimeout)
      if (idlePreloadId && window.cancelIdleCallback) window.cancelIdleCallback(idlePreloadId)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (smoothingFrameId) cancelAnimationFrame(smoothingFrameId)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-primary theme-transition">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ 
            objectFit: 'cover',
            imageRendering: 'auto',
            backgroundImage: `url(${framePath(0)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
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
