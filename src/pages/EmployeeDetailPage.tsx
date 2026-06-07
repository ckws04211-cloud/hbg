import { Link, useParams } from 'react-router-dom'
import { getEmployeeByName } from '../data/employees'
import { GachaStage } from '../components/GachaStage'

export function EmployeeDetailPage() {
  const { name = '' } = useParams<{ name: string }>()
  const decodedName = decodeURIComponent(name)
  const employee = decodedName ? getEmployeeByName(decodedName) : undefined

  if (!employee) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-4 text-center">
        <p className="text-xl text-zinc-400">사원을 찾을 수 없습니다.</p>
        <Link
          to="/"
          className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-6 py-2.5 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20"
        >
          목록으로
        </Link>
      </div>
    )
  }

  return <GachaStage employee={employee} />
}
