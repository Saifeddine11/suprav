import BlurText from './BlurText.jsx'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

function shouldInsertPartSpace(parts, partIndex) {
  if (partIndex === 0) return false

  const previousText = parts[partIndex - 1]?.text || ''
  const currentText = parts[partIndex]?.text || ''

  return Boolean(previousText && currentText && !/\s$/.test(previousText) && !/^\s/.test(currentText))
}

function buildStaticLineUnits(line) {
  return line.flatMap((part, partIndex) => {
    const unit = {
      text: part.text,
      className: part.className || '',
    }

    if (shouldInsertPartSpace(line, partIndex)) {
      return [{ text: ' ', className: '' }, unit]
    }

    return [unit]
  })
}

function renderStaticContent({ text, lines, lineClassName, children }) {
  if (children) return children

  if (lines?.length) {
    return lines.map((line, lineIndex) => (
      <span key={lineIndex} className={lineClassName || undefined}>
        {buildStaticLineUnits(line).map((unit, unitIndex) => (
          <span key={unitIndex} className={unit.className || undefined}>
            {unit.text}
          </span>
        ))}
      </span>
    ))
  }

  return text
}

export default function AnimatedText({
  variant = 'blur',
  as = 'p',
  className,
  text,
  lines,
  lineClassName,
  children,
  instant = false,
  ...blurProps
}) {
  const reduced = usePrefersReducedMotion()
  const Tag = as

  if (reduced || variant !== 'blur') {
    return (
      <Tag className={className}>
        {renderStaticContent({ text, lines, lineClassName, children })}
      </Tag>
    )
  }

  return (
    <BlurText
      as={as}
      className={className}
      text={text}
      lines={lines}
      lineClassName={lineClassName}
      instant={instant}
      {...blurProps}
    />
  )
}
