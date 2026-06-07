import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Employee } from '../types/employee'
import { createColorTheme, toRgba } from '../utils/colorTheme'
import { EmployeeIdCard } from './EmployeeIdCard'
import { EmployeeDetailsReveal } from './EmployeeDetailsReveal'
import { QuoteReveal, quoteRevealDuration } from './QuoteReveal'
import { ParticleBurst } from './ParticleBurst'

type GachaPhase = 'quote' | 'intro' | 'burst' | 'card' | 'details' | 'complete'

const PHASE_DELAYS: Record<Exclude<GachaPhase, 'complete' | 'quote'>, number> = {
  intro: 500,
  burst: 900,
  card: 1400,
  details: 800,
}

const LIFT_EASE = [0.25, 0.1, 0.25, 1] as const
const LIFT_DURATION = 0.85

const LIFTED_Y = -72
const LIFTED_SCALE = 0.94

const SKIP_GRACE_MS = 450

interface GachaStageProps {
  employee: Employee
}

export function GachaStage({ employee }: GachaStageProps) {
  const theme = useMemo(() => createColorTheme(employee.color), [employee.color])
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [phase, setPhase] = useState<GachaPhase>(reducedMotion ? 'complete' : 'quote')
  const [skipped, setSkipped] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)
  const skipEnabledRef = useRef(false)

  useEffect(() => {
    skipEnabledRef.current = false
    const timeoutId = setTimeout(() => {
      skipEnabledRef.current = true
    }, SKIP_GRACE_MS)

    return () => clearTimeout(timeoutId)
  }, [animationKey, employee.name])

  const skip = useCallback(() => {
    if (!skipEnabledRef.current || phase === 'complete') return
    setSkipped(true)
    setPhase('complete')
  }, [phase])

  const replay = useCallback(() => {
    if (reducedMotion) {
      setPhase('complete')
      setSkipped(false)
      return
    }
    setSkipped(false)
    setPhase('quote')
    setAnimationKey((key) => key + 1)
    setBurstKey((key) => key + 1)
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return

    const sequence: Exclude<GachaPhase, 'complete'>[] = [
      'quote',
      'intro',
      'burst',
      'card',
      'details',
    ]
    let index = 0
    let timeoutId: ReturnType<typeof setTimeout>

    const scheduleNext = () => {
      index++
      if (index >= sequence.length) {
        setPhase('complete')
        return
      }
      const nextPhase = sequence[index]
      setPhase(nextPhase)
      const delay =
        nextPhase === 'quote'
          ? quoteRevealDuration(employee.quote) + 600
          : PHASE_DELAYS[nextPhase]
      timeoutId = setTimeout(scheduleNext, delay)
    }

    timeoutId = setTimeout(
      scheduleNext,
      quoteRevealDuration(employee.quote) + 600,
    )

    return () => clearTimeout(timeoutId)
  }, [reducedMotion, animationKey, employee.quote])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        skip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [skip])

  const isAnimating = phase !== 'complete' && !skipped
  const showBurst = !skipped && !reducedMotion && ['burst', 'card'].includes(phase)
  const showHeroQuote = phase === 'quote' && !skipped
  const showCard = ['card', 'details', 'complete'].includes(phase)
  const showFooter = ['details', 'complete'].includes(phase)
  const showDetails = ['details', 'complete'].includes(phase)
  const showInfo = phase === 'complete'
  const playFlip = !skipped && !reducedMotion && phase === 'card'
  const showCardFlash = !skipped && !reducedMotion && phase === 'card'
  const isHeroMoment = phase === 'card' || phase === 'burst'
  const isQuoteMoment = phase === 'quote'

  const isLifted = showFooter || (skipped && phase === 'complete')
  const stackY = isLifted ? LIFTED_Y : 0
  const cardScale = isLifted ? LIFTED_SCALE : 1
  const liftTransition = skipped
    ? { duration: 0.15 }
    : { duration: LIFT_DURATION, ease: LIFT_EASE }

  return (
    <div
      className="relative min-h-svh overflow-hidden bg-zinc-950"
      onClick={skip}
      role="presentation"
    >
      <AnimatePresence>
        {isAnimating && phase === 'intro' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.15, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none fixed inset-0 z-10 bg-black"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCardFlash && (
          <motion.div
            key={`card-flash-${animationKey}`}
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="pointer-events-none fixed inset-0 z-[25]"
            style={{ backgroundColor: toRgba(theme.light, 0.65) }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity:
            isQuoteMoment && !skipped
              ? 0.22
              : isHeroMoment && !skipped
                ? [0, 1, 0.5]
                : phase === 'intro' && !skipped
                  ? [0, 0.9, 0.35]
                  : 0.35,
          scale: phase === 'intro' && !skipped ? [0.5, 1.6, 1] : 1,
        }}
        transition={{ duration: isHeroMoment ? 1.1 : isQuoteMoment ? 0.6 : 0.9 }}
        className="pointer-events-none fixed inset-0"
        style={{ background: theme.radialGlow }}
      />

      <ParticleBurst key={burstKey} active={showBurst} theme={theme} intense={phase === 'card'} />

      {isAnimating && (
        <p className="pointer-events-none fixed bottom-8 left-1/2 z-40 -translate-x-1/2 text-xs text-zinc-600">
          클릭 또는 Enter로 연출 스킵
        </p>
      )}

      {showInfo && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: skipped ? 0 : 0.25 }}
          onClick={(event) => {
            event.stopPropagation()
            replay()
          }}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900/90 backdrop-blur transition hover:scale-105 hover:bg-zinc-800"
          style={{
            border: `1px solid ${theme.buttonBorder}`,
            color: theme.buttonText,
            boxShadow: theme.buttonShadow,
          }}
          aria-label="애니메이션 다시 보기"
          title="애니메이션 다시 보기"
        >
          <RotateCcw className="h-6 w-6" strokeWidth={2} />
        </motion.button>
      )}

      <div className="flex min-h-svh items-center justify-center px-4 py-8">
        <motion.div
          animate={{ y: stackY }}
          transition={liftTransition}
          className="relative flex w-full max-w-2xl flex-col items-center overflow-visible"
        >
          {showCard && (
            <div className="relative z-10 w-full shrink-0" key={`card-${animationKey}`}>
              <EmployeeIdCard
                employee={employee}
                theme={theme}
                heroGlow={phase === 'card'}
                showGlow
                playFlip={playFlip}
                scale={cardScale}
              />
            </div>
          )}

          {showFooter && (
            <div
              key={`footer-${animationKey}`}
              className="absolute left-0 right-0 top-[calc(100%+1.25rem)] flex w-full flex-col items-center"
            >
              <div className="flex min-h-[10.5rem] w-full items-start justify-center">
                {showDetails ? (
                  <EmployeeDetailsReveal
                    employee={employee}
                    theme={theme}
                    animate={!skipped && !reducedMotion && phase === 'details'}
                    showButton={showInfo}
                  />
                ) : (
                  <div className="invisible w-full" aria-hidden>
                    <EmployeeDetailsReveal employee={employee} theme={theme} showButton={false} />
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showHeroQuote && (
          <motion.div
            key={`hero-quote-${animationKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-4"
          >
            <QuoteReveal
              quote={employee.quote}
              theme={theme}
              variant="hero"
              animate={!reducedMotion}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
