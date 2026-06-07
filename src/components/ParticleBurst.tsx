import { useEffect, useRef } from 'react'
import type { ColorTheme } from '../utils/colorTheme'
import { toRgba } from '../utils/colorTheme'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

interface ParticleBurstProps {
  active: boolean
  theme: ColorTheme
  intense?: boolean
  onComplete?: () => void
}

export function ParticleBurst({ active, theme, intense = false, onComplete }: ParticleBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const particles: Particle[] = []

    const count = reducedMotion ? 24 : intense ? 160 : 100
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = reducedMotion ? 2 + Math.random() * 3 : 4 + Math.random() * 8
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: reducedMotion ? 30 : 50 + Math.random() * 30,
        size: 1 + Math.random() * 3,
        color: theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)],
      })
    }

    let frame = 0
    const maxFrames = reducedMotion ? 30 : intense ? 75 : 55

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!reducedMotion) {
        for (let i = 0; i < 12; i++) {
          const rayAngle = (Math.PI * 2 * i) / 12
          const gradient = ctx.createLinearGradient(
            centerX,
            centerY,
            centerX + Math.cos(rayAngle) * canvas.width,
            centerY + Math.sin(rayAngle) * canvas.height,
          )
          const alpha = Math.max(0, (intense ? 0.28 : 0.18) * (1 - frame / maxFrames))
          gradient.addColorStop(0, toRgba(theme.main, alpha))
          gradient.addColorStop(1, toRgba(theme.main, 0))
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.lineTo(
            centerX + Math.cos(rayAngle) * canvas.width * 0.6,
            centerY + Math.sin(rayAngle) * canvas.height * 0.6,
          )
          ctx.strokeStyle = gradient
          ctx.lineWidth = 4
          ctx.stroke()
        }
      }

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.05
        particle.life++

        const alpha = 1 - particle.life / particle.maxLife
        if (alpha <= 0) return

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = alpha
        ctx.fill()
        ctx.globalAlpha = 1
      })

      frame++
      if (frame < maxFrames) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [active, onComplete, theme, intense])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20"
      aria-hidden="true"
    />
  )
}
