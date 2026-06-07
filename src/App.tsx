import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { EmployeeListPage } from './pages/EmployeeListPage'
import { EmployeeDetailPage } from './pages/EmployeeDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeListPage />} />
        <Route path="/employee/:name" element={<EmployeeDetailPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
