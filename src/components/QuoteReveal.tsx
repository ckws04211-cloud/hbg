import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import type { ColorTheme } from '../utils/colorTheme'
import { toRgba } from '../utils/colorTheme'

type QuoteVariant = 'hero' | 'inline'

interface QuoteRevealProps {
  quote: string
  theme: ColorTheme
  animate?: boolean
  variant?: QuoteVariant
}

const SEGMENT_DELAY = 0.042
const SEGMENT_DURATION = 0.26
const LEAD_IN = 0.2

type QuoteSegment =
  | { type: 'char'; value: string; accent?: boolean }
  | { type: 'line-break' }

function buildSegments(quote: string): QuoteSegment[] {
  const segments: QuoteSegment[] = [{ type: 'char', value: '\u201C', accent: true }]
  const lines = quote.split('\n')

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      segments.push({ type: 'line-break' })
    }
    for (const char of line) {
      segments.push({ type: 'char', value: char })
    }
  })

  segments.push({ type: 'char', value: '\u201D', accent: true })
  return segments
}

function countAnimatedSegments(quote: string): number {
  return buildSegments(quote).filter((segment) => segment.type === 'char').length
}

function AnimatedChar({
  char,
  delayIndex,
  animate,
  style,
}: {
  char: string
  delayIndex: number
  animate: boolean
  style?: CSSProperties
}) {
  const content = char === ' ' ? '\u00A0' : char

  if (!animate) {
    return <span style={style}>{content}</span>
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        delay: LEAD_IN + delayIndex * SEGMENT_DELAY,
        duration: SEGMENT_DURATION,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="inline-block"
      style={char === ' ' ? { minWidth: '0.35em', ...style } : style}
      aria-hidden
    >
      {content}
    </motion.span>
  )
}

function QuoteText({
  quote,
  theme,
  animate,
  className,
}: {
  quote: string
  theme: ColorTheme
  animate: boolean
  className: string
}) {
  const quoteMarkStyle = { color: theme.accentText }
  const textShadow = `0 0 32px ${toRgba(theme.main, 0.2)}`
  const segments = buildSegments(quote)
  let delayIndex = 0

  const nodes: ReactNode[] = []

  segments.forEach((segment, index) => {
    if (segment.type === 'line-break') {
      nodes.push(<span key={`break-${index}`} className="mt-3 block" aria-hidden />)
      return
    }

    nodes.push(
      <AnimatedChar
        key={`char-${index}-${segment.value}`}
        char={segment.value}
        delayIndex={delayIndex}
        animate={animate}
        style={segment.accent ? quoteMarkStyle : undefined}
      />,
    )
    delayIndex++
  })

  return (
    <p className={className} style={{ textShadow }} aria-label={quote}>
      {nodes}
    </p>
  )
}

export function quoteRevealDuration(quote: string): number {
  const segmentCount = countAnimatedSegments(quote)
  return (LEAD_IN + segmentCount * SEGMENT_DELAY + SEGMENT_DURATION + 0.45) * 1000
}

export function QuoteReveal({
  quote,
  theme,
  animate = true,
  variant = 'inline',
}: QuoteRevealProps) {
  const isHero = variant === 'hero'
  const isMultiline = quote.includes('\n')
  const className = isHero
    ? isMultiline
      ? 'max-w-3xl px-4 text-center font-display text-xl font-medium leading-relaxed text-hbg-cream sm:px-6 sm:text-2xl'
      : 'max-w-2xl px-4 text-center font-display text-2xl font-medium leading-relaxed text-hbg-cream sm:px-6 sm:text-3xl'
    : 'max-w-xl px-6 text-center text-base leading-relaxed text-hbg-cream/70 whitespace-pre-line'

  const text = (
    <QuoteText quote={quote} theme={theme} animate={animate} className={className} />
  )

  if (!animate) {
    return <div className={isHero ? 'opacity-95' : 'opacity-80'}>{text}</div>
  }

  if (isHero) {
    return text
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.85, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.div>
  )
}
