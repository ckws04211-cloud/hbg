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
    '--hover-border': toRgba(theme.main, 0.45),
    '--hover-glow': `0 0 30px ${toRgba(theme.main, 0.2)}, 0 0 60px ${toRgba(theme.main, 0.08)}`,
    '--hover-text': theme.light,
    '--rank-bg': toRgba(theme.main, 0.9),
  } as React.CSSProperties

  return (
    <Link
      to={getEmployeePath(employee.name)}
      style={hoverStyle}
      className="group block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition duration-300 hover:scale-[1.02] hover:[border-color:var(--hover-border)] hover:[box-shadow:var(--hover-glow)]"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-zinc-800">
        {!imageError ? (
          <img
            src={employee.image}
            alt={`${employee.name} 사원증`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950"
            style={{
              backgroundImage: `linear-gradient(to bottom right, rgb(39 39 42), rgb(24 24 27), ${toRgba(theme.main, 0.15)})`,
            }}
          >
            <span className="text-4xl font-bold" style={{ color: toRgba(theme.main, 0.35) }}>
              {employee.rank}
            </span>
            <span className="mt-2 text-sm text-zinc-500">이미지 없음</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
        <span
          className="absolute right-3 top-3 rounded-md px-2 py-0.5 text-xs font-bold text-zinc-950 transition-colors duration-300 group-hover:[background-color:var(--rank-bg)]"
          style={{ backgroundColor: toRgba(theme.main, 0.75) }}
        >
          {employee.rank}
        </span>
      </div>
      <div className="p-4 text-left">
        <p className="text-xs text-zinc-600">{employee.employeeNumber}</p>
        <h3 className="mt-1 text-lg font-semibold text-zinc-100 transition-colors duration-300 group-hover:[color:var(--hover-text)]">
          {employee.name}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">{employee.arcana}</p>
      </div>
    </Link>
  )
}
