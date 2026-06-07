import employeesData from '../data/employees.json'
import type { Employee } from '../types/employee'

export const employees: Employee[] = employeesData as Employee[]

export function getEmployeePath(name: string): string {
  return `/employee/${encodeURIComponent(name)}`
}

export function getEmployeeByName(name: string): Employee | undefined {
  return employees.find((employee) => employee.name === name)
}
