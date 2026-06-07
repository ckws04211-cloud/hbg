import { Link, useParams } from 'react-router-dom'
import { getEmployeeByName } from '../data/employees'
import { GachaStage } from '../components/GachaStage'

export function EmployeeDetailPage() {
  const { name = '' } = useParams<{ name: string }>()
  const decodedName = decodeURIComponent(name)
  const employee = decodedName ? getEmployeeByName(decodedName) : undefined

  if (!employee) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-xl text-hbg-cream/70">사원을 찾을 수 없습니다.</p>
        <Link
          to="/"
          className="mt-6 rounded-xl border border-hbg-gold/30 bg-hbg-gold/10 px-6 py-2.5 text-sm font-medium text-hbg-gold-light transition hover:border-hbg-gold/50 hover:bg-hbg-gold/15"
        >
          목록으로
        </Link>
      </div>
    )
  }

  return <GachaStage key={employee.name} employee={employee} />
}
