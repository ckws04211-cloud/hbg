import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EmployeeListPage } from './pages/EmployeeListPage'
import { EmployeeDetailPage } from './pages/EmployeeDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeListPage />} />
        <Route path="/employee/:name" element={<EmployeeDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
