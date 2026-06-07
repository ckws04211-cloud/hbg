import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Employee } from '../types/employee'
import type { ColorTheme } from '../utils/colorTheme'
import { toRgba } from '../utils/colorTheme'

const CARD_RADIUS = 'rounded-3xl'

interface EmployeeIdCardProps {
  employee: Employee
  theme: ColorTheme
  showGlow?: boolean
  heroGlow?: boolean
  playFlip?: boolean
  scale?: number
  instant?: boolean
}

export function EmployeeIdCard({
  employee,
  theme,
  showGlow = true,
  heroGlow = false,
  playFlip = false,
  scale = 1,
  instant = false,
}: EmployeeIdCardProps) {
  const [imageError, setImageError] = useState(false)

  const cardStyle = useMemo(() => {
    const glow = heroGlow
      ? `0 0 40px ${toRgba(theme.main, 0.45)}, 0 0 100px ${toRgba(theme.main, 0.25)}, inset 0 0 30px ${toRgba(theme.main, 0.08)}`
      : showGlow
        ? theme.cardGlow
        : undefined

    return {
      borderColor: heroGlow ? toRgba(theme.main, 0.65) : theme.cardBorder,
      boxShadow: glow,
    }
  }, [heroGlow, showGlow, theme])

  const rankStyle = {
    backgroundImage: theme.textGradient,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: `drop-shadow(0 0 16px ${toRgba(theme.main, 0.5)})`,
  } as const

  return (
    <motion.div
      animate={{ scale }}
      transition={
        instant ? { duration: 0 } : { type: 'spring', stiffness: heroGlow ? 100 : 120, damping: 18 }
      }
      style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      className="relative w-full"
    >
      {playFlip && (
        <>
          <motion.div
            initial={{ opacity: 0.9, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2.8 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`pointer-events-none absolute inset-0 z-10 ${CARD_RADIUS}`}
            style={{ boxShadow: `0 0 100px 40px ${toRgba(theme.main, 0.55)}` }}
          />
          <motion.div
            initial={{ opacity: 0.6, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className={`pointer-events-none absolute -inset-1 z-0 border-2 ${CARD_RADIUS}`}
            style={{ borderColor: toRgba(theme.light, 0.5) }}
          />
        </>
      )}

      <motion.div
        initial={
          playFlip
            ? { rotateY: 180, scale: 0.15, opacity: 0, y: 50 }
            : false
        }
        animate={{ rotateY: 0, scale: 1, opacity: 1, y: 0 }}
        transition={
          playFlip
            ? {
                rotateY: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.25 },
                y: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              }
            : { duration: 0 }
        }
        style={{ transformStyle: 'preserve-3d', ...cardStyle }}
        className={`relative w-full overflow-hidden border-2 bg-hbg-surface ${CARD_RADIUS}`}
      >
        {heroGlow && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.15, 0.35] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`pointer-events-none absolute inset-0 z-10 ${CARD_RADIUS}`}
            style={{ boxShadow: `inset 0 0 60px ${toRgba(theme.main, 0.12)}` }}
          />
        )}

        <div className="aspect-[3/2] w-full overflow-hidden">
          {!imageError ? (
            <img
              src={employee.image}
              alt={`${employee.name} 사원증`}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950"
              style={{
                backgroundImage: `linear-gradient(to bottom right, rgb(39 39 42), rgb(24 24 27), ${theme.main}22)`,
              }}
            >
              <span className="text-6xl font-black" style={rankStyle}>
                {employee.rank}
              </span>
              <span className="mt-4 text-2xl font-bold text-zinc-300">
                {employee.name}
              </span>
              <span className="mt-1 text-sm text-zinc-500">{employee.arcana}</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
