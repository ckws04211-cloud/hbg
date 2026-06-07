import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
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
      <SpeedInsights />
    </BrowserRouter>
  )
}

export default App
