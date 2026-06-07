import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEmployeePath } from '../data/employees'
import type { Employee } from '../types/employee'
import { createColorTheme, toRgba } from '../utils/colorTheme'

interface EmployeeListCardProps {
  employee: Employee
}

export function EmployeeListCard({ employee }: EmployeeListCardProps) {
  const [imageError, setImageError] = useState(false)
  const theme = useMemo(() => createColorTheme(employee.color), [employee.color])

  const hoverStyle = {
    '--hover-border': toRgba(theme.main, 0.5),
    '--hover-glow': `0 0 28px ${toRgba(theme.main, 0.22)}, 0 0 56px ${toRgba(theme.main, 0.08)}`,
    '--hover-text': theme.light,
    '--rank-border': toRgba(theme.main, 0.55),
    '--rank-bg': toRgba(theme.main, 0.16),
    '--rank-text': theme.light,
  } as React.CSSProperties

  return (
    <Link
      to={getEmployeePath(employee.name)}
      style={hoverStyle}
      className="group block overflow-hidden rounded-3xl border border-hbg-gold/12 bg-hbg-surface/75 transition duration-300 hover:scale-[1.02] hover:[border-color:var(--hover-border)] hover:[box-shadow:var(--hover-glow)]"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-hbg-bg">
        {!imageError ? (
          <img
            src={employee.image}
            alt={`${employee.name} 사원증`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-hbg-elevated via-hbg-surface to-hbg-bg"
            style={{
              backgroundImage: `linear-gradient(to bottom right, rgb(28 25 22), rgb(20 18 16), ${toRgba(theme.main, 0.12)})`,
            }}
          >
            <span className="text-4xl font-bold" style={{ color: toRgba(theme.main, 0.35) }}>
              {employee.rank}
            </span>
            <span className="mt-2 text-sm text-hbg-cream/35">이미지 없음</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-hbg-bg/70 via-transparent to-transparent opacity-50" />
        <span
          className="absolute right-3 top-3 rounded-md border px-2 py-0.5 text-xs font-semibold backdrop-blur-sm transition-colors duration-300 group-hover:[background-color:var(--rank-bg)] group-hover:[border-color:var(--rank-border)] group-hover:[color:var(--rank-text)]"
          style={{
            borderColor: 'rgba(201, 169, 98, 0.25)',
            backgroundColor: 'rgba(10, 9, 8, 0.72)',
            color: 'rgba(232, 213, 163, 0.9)',
          }}
        >
          {employee.rank}
        </span>
      </div>
      <div className="border-t border-hbg-gold/8 p-4 text-left">
        <p className="text-xs tracking-wide text-hbg-gold/45">{employee.employeeNumber}</p>
        <h3 className="mt-1 text-lg font-semibold text-hbg-cream transition-colors duration-300 group-hover:[color:var(--hover-text)]">
          {employee.name}
        </h3>
        <p className="mt-1 text-sm text-hbg-cream/45">{employee.arcana}</p>
      </div>
    </Link>
  )
}
