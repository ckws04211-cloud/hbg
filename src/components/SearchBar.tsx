interface SearchBarProps {
  query: string
  onQueryChange: (value: string) => void
  resultCount: number
}

export function SearchBar({ query, onQueryChange, resultCount }: SearchBarProps) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <label htmlFor="employee-search" className="sr-only">
        사원 이름 검색
      </label>
      <div className="relative">
        <input
          id="employee-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="사원 이름을 검색하세요..."
          className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/80 px-5 py-3.5 pl-12 text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
        />
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>
      </div>
      <p className="mt-2 text-center text-sm text-zinc-500">
        {resultCount}명의 사원
      </p>
    </div>
  )
}
