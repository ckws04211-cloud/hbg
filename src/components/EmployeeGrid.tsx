import type { Employee } from '../types/employee'
import { EmployeeListCard } from './EmployeeListCard'

interface EmployeeGridProps {
  employees: Employee[]
}

export function EmployeeGrid({ employees }: EmployeeGridProps) {
  if (employees.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hbg-gold/20 bg-hbg-surface/40 py-20 text-center">
        <p className="font-display text-lg text-hbg-cream/70">검색 결과가 없습니다.</p>
        <p className="mt-2 text-sm text-hbg-cream/40">다른 이름으로 검색해 보세요.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {employees.map((employee) => (
        <EmployeeListCard key={employee.name} employee={employee} />
      ))}
    </div>
  )
}
