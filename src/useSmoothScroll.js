import { useEffect, useRef, useState } from 'react'

// Lerp interpolation function
const lerp = (start, end, amount) => start + (end - start) * amount

// Smooth scroll hook with Framer-like feel
export function useSmoothScroll() {
  const [scrollY, setScrollY] = useState(0)
  const [targetScrollY, setTargetScrollY] = useState(0)
  const rafId = useRef(null)
  const isScrolling = useRef(false)
  const lastWheelTime = useRef(0)
  
  // Lerp factor for smooth interpolation (0.08-0.12 for natural feel)
  const lerpFactor = 0.09
  
  useEffect(() => {
    let currentScrollY = window.pageYOffset
    let velocity = 0
    
    const animate = () => {
      // Apply lerp interpolation for smooth movement
      const deltaY = targetScrollY - currentScrollY
      currentScrollY = lerp(currentScrollY, targetScrollY, lerpFactor)
      
      // Calculate velocity for momentum
      velocity = deltaY * lerpFactor
      
      // Apply transform for hardware acceleration
      document.documentElement.style.transform = `translateY(${-currentScrollY}px)`
      document.body.style.transform = `translateY(${-currentScrollY}px)`
      
      // Set CSS custom property for other animations
      document.documentElement.style.setProperty('--scroll-y', currentScrollY)
      
      setScrollY(currentScrollY)
      
      // Continue animation if there's significant movement
      if (Math.abs(deltaY) > 0.1) {
        rafId.current = requestAnimationFrame(animate)
      } else {
        isScrolling.current = false
      }
    }
    
    const handleWheel = (e) => {
      e.preventDefault()
      
      // Track wheel timing for natural feel
      const now = Date.now()
      const timeDelta = now - lastWheelTime.current
      lastWheelTime.current = now
      
      // Calculate scroll delta with momentum consideration
      let delta = e.deltaY
      
      // Adjust delta based on time between wheel events
      if (timeDelta < 50) {
        delta *= 1.5 // Faster scrolling for rapid wheel movements
      } else if (timeDelta > 100) {
        delta *= 0.8 // Slower for deliberate scrolling
      }
      
      // Update target scroll position
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const newTarget = Math.max(0, Math.min(targetScrollY + delta, maxScroll))
      
      setTargetScrollY(newTarget)
      
      // Start animation if not already running
      if (!isScrolling.current) {
        isScrolling.current = true
        rafId.current = requestAnimationFrame(animate)
      }
    }
    
    const handleTouchStart = () => {
      // Disable smooth scroll for touch interactions
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
        isScrolling.current = false
      }
    }
    
    const handleTouchMove = () => {
      // Let browser handle touch scrolling naturally
      currentScrollY = window.pageYOffset
      setTargetScrollY(currentScrollY)
      setScrollY(currentScrollY)
      document.documentElement.style.transform = ''
      document.body.style.transform = ''
    }
    
    const handleTouchEnd = () => {
      // Re-enable smooth scroll after touch
      currentScrollY = window.pageYOffset
      setTargetScrollY(currentScrollY)
    }
    
    const handleKeyDown = (e) => {
      // Handle keyboard navigation
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault()
        
        let delta = 0
        switch (e.key) {
          case 'ArrowUp':
            delta = -100
            break
          case 'ArrowDown':
            delta = 100
            break
          case 'PageUp':
            delta = -window.innerHeight * 0.8
            break
          case 'PageDown':
            delta = window.innerHeight * 0.8
            break
        }
        
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const newTarget = Math.max(0, Math.min(targetScrollY + delta, maxScroll))
        
        setTargetScrollY(newTarget)
        
        if (!isScrolling.current) {
          isScrolling.current = true
          rafId.current = requestAnimationFrame(animate)
        }
      }
    }
    
    // Initialize scroll position
    setTargetScrollY(window.pageYOffset)
    currentScrollY = window.pageYOffset
    
    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    
    // Handle window resize
    const handleResize = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (targetScrollY > maxScroll) {
        setTargetScrollY(maxScroll)
      }
    }
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      
      // Reset transforms
      document.documentElement.style.transform = ''
      document.body.style.transform = ''
    }
  }, [targetScrollY])
  
  return { scrollY, targetScrollY }
}

// CSS helper for smooth scroll
export const smoothScrollCSS = `
  html {
    scroll-behavior: auto;
    overflow: hidden;
  }
  
  body {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    will-change: transform;
  }
  
  /* Hardware acceleration */
  html, body {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  
  /* Prevent scroll jank */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`
