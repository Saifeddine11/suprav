import { createElement, useMemo, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

const EASE = [0.22, 1, 0.36, 1]
const MotionSpan = motion.span

const DIRECTION_OFFSET = {
  top: { y: 12 },
  bottom: { y: -12 },
  left: { x: 12 },
  right: { x: -12 },
}

function tokenize(value, animateBy) {
  if (animateBy === 'letters') {
    return value.split('')
  }
  return value.split(/(\s+)/).filter(Boolean)
}

function shouldInsertPartSpace(parts, partIndex) {
  if (partIndex === 0) return false

  const previousText = parts[partIndex - 1]?.text || ''
  const currentText = parts[partIndex]?.text || ''

  return Boolean(previousText && currentText && !/\s$/.test(previousText) && !/^\s/.test(currentText))
}

function buildLineUnits(lineParts, animateBy) {
  return lineParts.flatMap((part, partIndex) => {
    const units = tokenize(part.text, animateBy).map((token) => ({
      text: token,
      className: part.className || '',
    }))

    if (shouldInsertPartSpace(lineParts, partIndex)) {
      return [{ text: ' ', className: '' }, ...units]
    }

    return units
  })
}

function buildStructure({ text, lines, animateBy }) {
  if (lines?.length) {
    return {
      type: 'lines',
      lines: lines.map((lineParts) => buildLineUnits(lineParts, animateBy)),
    }
  }

  if (text) {
    return {
      type: 'flat',
      items: tokenize(text, animateBy).map((token) => ({
        text: token,
        className: '',
      })),
    }
  }

  return { type: 'flat', items: [] }
}

function isWhitespaceUnit(unit) {
  return unit.text.trim() === '' && /\s/.test(unit.text)
}

function withAnimationSteps(structure) {
  let step = 0

  const addStep = (unit) => {
    const isWhitespace = isWhitespaceUnit(unit)
    const animationStep = step

    if (!isWhitespace) step += 1

    return {
      ...unit,
      animationStep,
      isWhitespace,
    }
  }

  if (structure.type === 'lines') {
    return {
      ...structure,
      lines: structure.lines.map((line) => line.map(addStep)),
    }
  }

  return {
    ...structure,
    items: structure.items.map(addStep),
  }
}

function renderStatic(structure, lineClassName) {
  if (structure.type === 'lines') {
    return structure.lines.map((line, lineIndex) => (
      <span key={lineIndex} className={lineClassName || undefined}>
        {line.map((unit, unitIndex) => (
          <span key={unitIndex} className={unit.className || undefined}>
            {unit.text}
          </span>
        ))}
      </span>
    ))
  }

  return structure.items.map((unit, index) => (
    <span key={index} className={unit.className || undefined}>
      {unit.text}
    </span>
  ))
}

export default function BlurText({
  as = 'p',
  className,
  text,
  lines,
  lineClassName = '',
  animateBy = 'words',
  direction = 'top',
  delay = 100,
  stepDuration = 0.35,
  threshold = 0.15,
  rootMargin = '-50px',
  instant = false,
  id,
  ...rest
}) {
  const Tag = as
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
    margin: rootMargin,
  })

  const structure = useMemo(
    () => buildStructure({ text, lines, animateBy }),
    [text, lines, animateBy],
  )
  const timedStructure = useMemo(() => withAnimationSteps(structure), [structure])

  const offset = DIRECTION_OFFSET[direction] || DIRECTION_OFFSET.top
  const hidden = { opacity: 0, filter: 'blur(8px)', x: 0, y: 0, ...offset }
  const visible = { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 }
  const shouldAnimate = !reduced && (instant || isInView)

  if (reduced) {
    return (
      <Tag ref={ref} className={className} id={id} {...rest}>
        {renderStatic(structure, lineClassName)}
      </Tag>
    )
  }

  const renderUnit = (unit, key) => {
    return createElement(
      MotionSpan,
      {
        key,
        className: unit.className || undefined,
        initial: hidden,
        animate: shouldAnimate ? visible : hidden,
        transition: {
          duration: stepDuration,
          delay: (unit.animationStep * delay) / 1000,
          ease: EASE,
        },
        style: {
          display: 'inline-block',
          whiteSpace: unit.isWhitespace ? 'pre' : undefined,
        },
      },
      unit.text,
    )
  }

  if (timedStructure.type === 'lines') {
    return (
      <Tag ref={ref} className={className} id={id} {...rest}>
        {timedStructure.lines.map((line, lineIndex) => (
          <span key={lineIndex} className={lineClassName || undefined}>
            {line.map((unit, unitIndex) => renderUnit(unit, `${lineIndex}-${unitIndex}`))}
          </span>
        ))}
      </Tag>
    )
  }

  return (
    <Tag ref={ref} className={className} id={id} {...rest}>
      {timedStructure.items.map((unit, index) => renderUnit(unit, index))}
    </Tag>
  )
}
