import { motion } from 'framer-motion'
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
  const segments = Array.from(quote)
  const quoteMarkStyle = { color: theme.accentText }
  const textShadow = `0 0 32px ${toRgba(theme.main, 0.2)}`

  if (!animate) {
    return (
      <p className={className} style={{ textShadow }}>
        <span style={quoteMarkStyle}>&ldquo;</span>
        {quote}
        <span style={quoteMarkStyle}>&rdquo;</span>
      </p>
    )
  }

  return (
    <p className={className} style={{ textShadow }} aria-label={quote}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: LEAD_IN }}
        style={quoteMarkStyle}
      >
        &ldquo;
      </motion.span>
      {segments.map((char, index) => (
        <motion.span
          key={`${index}-${char}`}
          initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: LEAD_IN + index * SEGMENT_DELAY,
            duration: SEGMENT_DURATION,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="inline-block"
          style={char === ' ' ? { minWidth: '0.35em' } : undefined}
          aria-hidden
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.25,
          delay: LEAD_IN + segments.length * SEGMENT_DELAY + 0.08,
        }}
        style={quoteMarkStyle}
      >
        &rdquo;
      </motion.span>
    </p>
  )
}

export function quoteRevealDuration(quote: string): number {
  const segments = Array.from(quote).length
  return (LEAD_IN + segments * SEGMENT_DELAY + SEGMENT_DURATION + 0.45) * 1000
}

export function QuoteReveal({
  quote,
  theme,
  animate = true,
  variant = 'inline',
}: QuoteRevealProps) {
  const isHero = variant === 'hero'
  const className = isHero
    ? 'max-w-lg px-6 text-center text-2xl font-medium leading-relaxed text-zinc-100 sm:text-3xl'
    : 'max-w-md px-6 text-center text-base leading-relaxed text-zinc-400'

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
