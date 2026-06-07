import { useEmployeeSearch } from '../hooks/useEmployeeSearch'
import { EmployeeGrid } from '../components/EmployeeGrid'
import { SearchBar } from '../components/SearchBar'

export function EmployeeListPage() {
  const { query, setQuery, filteredEmployees } = useEmployeeSearch()

  return (
    <div className="min-h-svh">
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <p className="font-display mb-2 text-xs font-medium uppercase tracking-[0.35em] text-hbg-gold/75 sm:text-sm">
            Hambuga Global Holdings
          </p>
          <h1 className="font-display text-3xl font-semibold text-hbg-gradient sm:text-4xl">
            사원증 도감
          </h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-hbg-gold/45">
            Innovate · Connect · Elevate
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-hbg-cream/45">
            사원을 선택하면 가챠 등장 연출과 함께 사원증이 공개됩니다.
          </p>
        </header>

        <div className="sticky top-0 z-40 -mx-4 mb-10 border-b border-hbg-gold/10 bg-hbg-bg/88 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
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
