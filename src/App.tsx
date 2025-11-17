import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './pages/SuperAdmin/Dashboard'
import { ContentLibrary } from './pages/SuperAdmin/ContentLibrary'
import { CourseBuilder } from './pages/SuperAdmin/CourseBuilder'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content-library" element={<ContentLibrary />} />
        <Route path="/content-library/builder/:courseId" element={<CourseBuilder />} />
        <Route path="/content-library/builder/new" element={<CourseBuilder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App