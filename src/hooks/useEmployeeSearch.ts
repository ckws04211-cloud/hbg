import { useMemo, useState } from 'react'
import { employees } from '../data/employees'
import type { Employee } from '../types/employee'

export function useEmployeeSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery)

  const filteredEmployees = useMemo<Employee[]>(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return employees

    return employees.filter((employee) =>
      employee.name.toLowerCase().includes(normalized),
    )
  }, [query])

  return { query, setQuery, filteredEmployees }
}
