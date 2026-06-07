import { useEmployeeSearch } from '../hooks/useEmployeeSearch'
import { EmployeeGrid } from '../components/EmployeeGrid'
import { SearchBar } from '../components/SearchBar'

export function EmployeeListPage() {
  const { query, setQuery, filteredEmployees } = useEmployeeSearch()

  return (
    <div className="min-h-svh bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,215,0,0.06)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-amber-500/80">
            Employee Archive
          </p>
          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            사원증 도감
          </h1>
          <p className="mx-auto mt-3 max-w-md text-zinc-500">
            사원을 선택하면 가챠 등장 연출과 함께 사원증이 공개됩니다.
          </p>
        </header>

        <div className="sticky top-0 z-40 -mx-4 mb-10 border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            resultCount={filteredEmployees.length}
          />
        </div>

        <EmployeeGrid employees={filteredEmployees} />
      </div>
    </div>
  )
}
