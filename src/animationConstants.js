// Unified Animation System - Framer-like Motion Constants

// DURATION CONSTANTS (between 0.6s and 1s)
export const DURATION = {
  FAST: 0.6,    // Quick transitions
  NORMAL: 0.8,  // Standard animations  
  SLOW: 1.0,    // Dramatic reveals
}

// MOBILE-OPTIMIZED DURATION
export const MOBILE_DURATION = {
  FAST: 0.4,    // Quick transitions on mobile
  NORMAL: 0.6,  // Standard animations on mobile
  SLOW: 0.8,    // Dramatic reveals on mobile
}

// UNIFIED EASING FUNCTION
export const EASING = [0.22, 1, 0.36, 1] // Premium cubic-bezier

// STAGGER DELAYS
export const STAGGER = {
  CHILDREN: 0.12,    // Between children
  SECTIONS: 0.3,     // Between sections
  ELEMENTS: 0.15,    // Between elements
}

// ANIMATION VARIANTS
export const ANIMATE_VARIANTS = {
  // Fade and slide up
  fadeUp: {
    hidden: { 
      opacity: 0, 
      y: 40,
      transform: 'translate3d(0, 40px, 0)',
      willChange: 'transform, opacity'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transform: 'translate3d(0, 0, 0)',
      transition: {
        duration: DURATION.NORMAL,
        ease: EASING,
        willChange: 'auto'
      }
    }
  },
  
  // Scale and fade
  scaleFade: {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      transform: 'scale3d(0.95, 0.95, 1)',
      willChange: 'transform, opacity'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transform: 'scale3d(1, 1, 1)',
      transition: {
        duration: DURATION.NORMAL,
        ease: EASING,
        willChange: 'auto'
      }
    }
  },
  
  // Slide from left
  slideLeft: {
    hidden: { 
      opacity: 0, 
      x: -40,
      transform: 'translate3d(-40px, 0, 0)',
      willChange: 'transform, opacity'
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transform: 'translate3d(0, 0, 0)',
      transition: {
        duration: DURATION.NORMAL,
        ease: EASING,
        willChange: 'auto'
      }
    }
  },
  
  // Staggered container
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: STAGGER.CHILDREN,
        delayChildren: STAGGER.ELEMENTS,
        duration: DURATION.SLOW,
        ease: EASING
      }
    }
  }
}

// TRANSITION PROPS
export const TRANSITION_PROPS = {
  duration: DURATION.NORMAL,
  ease: EASING,
  willChange: 'transform, opacity'
}

// VIEWPORT SETTINGS
export const VIEWPORT_SETTINGS = {
  once: true,
  amount: 0.2
}

// HOVER TRANSITIONS
export const HOVER_TRANSITION = {
  duration: 0.35,
  ease: EASING
}

// ACTIVE TRANSITIONS
export const ACTIVE_TRANSITION = {
  duration: 0.15,
  ease: EASING
}
