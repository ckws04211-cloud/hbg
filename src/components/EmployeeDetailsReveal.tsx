import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Employee } from '../types/employee'
import type { ColorTheme } from '../utils/colorTheme'
import { toRgba } from '../utils/colorTheme'

interface EmployeeDetailsRevealProps {
  employee: Employee
  theme: ColorTheme
  animate?: boolean
  showButton?: boolean
}

export function EmployeeDetailsReveal({
  employee,
  theme,
  animate = true,
  showButton = false,
}: EmployeeDetailsRevealProps) {
  const dividerStyle = {
    background: `linear-gradient(90deg, transparent, ${toRgba(theme.main, 0.5)}, transparent)`,
  }

  const content = (
    <>
      <div className="h-px w-24 opacity-40" style={dividerStyle} />

      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-hbg-gold/55">
          직급
        </p>
        <p className="mt-1 text-2xl font-semibold text-hbg-cream/90">{employee.rank}</p>
      </div>

      <p className="text-xs text-hbg-cream/45">{employee.employeeNumber}</p>
      <h2 className="text-lg font-medium text-hbg-cream/85">{employee.name}</h2>
      <p className="text-sm text-hbg-cream/45">{employee.arcana}</p>

      <div className={showButton ? 'mt-1' : 'invisible mt-1 h-[34px]'} aria-hidden={!showButton}>
        <Link
          to="/"
          tabIndex={showButton ? 0 : -1}
          className="inline-block rounded-lg border border-hbg-gold/25 bg-hbg-gold/8 px-5 py-2 text-xs font-medium text-hbg-gold-light transition hover:border-hbg-gold/40 hover:bg-hbg-gold/12 hover:text-hbg-cream"
        >
          목록으로
        </Link>
      </div>
    </>
  )

  if (!animate) {
    return (
      <div
        className="flex flex-col items-center gap-2.5 text-center opacity-70"
        onClick={(event) => event.stopPropagation()}
      >
        {content}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.75, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-2.5 text-center"
      onClick={(event) => event.stopPropagation()}
    >
      {content}
    </motion.div>
  )
}
