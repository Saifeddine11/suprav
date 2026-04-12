import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'motion/react'

// Hook for subtle parallax effects
export function useParallax(ref, options = {}) {
  const {
    backgroundSpeed = 0.9,
    foregroundSpeed = 1,
    offset = ['start end', 'end start']
  } = options
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset
  })
  
  // Background moves slower (0.9) for depth effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100 * (1 - backgroundSpeed)])
  
  // Foreground moves at normal speed (1.0)
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, 100 * (1 - foregroundSpeed)])
  
  return { backgroundY, foregroundY }
}

// Component for parallax background elements
export function ParallaxBackground({ children, className, speed = 0.9, ...props }) {
  const ref = useRef(null)
  const { backgroundY } = useParallax(ref, { backgroundSpeed: speed })
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: backgroundY,
        willChange: 'transform'
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Component for parallax foreground elements  
export function ParallaxForeground({ children, className, speed = 1, ...props }) {
  const ref = useRef(null)
  const { foregroundY } = useParallax(ref, { foregroundSpeed: speed })
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: foregroundY,
        willChange: 'transform'
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Enhanced section with parallax background
export function ParallaxSection({ children, className, backgroundSpeed = 0.9, ...props }) {
  return (
    <section className={`parallax-section ${className || ''}`} {...props}>
      <ParallaxBackground 
        className="parallax-section__background"
        speed={backgroundSpeed}
      >
        {children}
      </ParallaxBackground>
    </section>
  )
}
