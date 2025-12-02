import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './pages/SuperAdmin/Dashboard'
import { ContentLibrary } from './pages/SuperAdmin/ContentLibrary'
import { CourseBuilder } from './pages/SuperAdmin/CourseBuilder'
import { SplitScreenCourseBuilder } from './pages/SuperAdmin/SplitScreenCourseBuilder'
import { TopicEditor } from './pages/SuperAdmin/TopicEditor'
import { QuizBuilder } from './pages/SuperAdmin/QuizBuilder'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content-library" element={<ContentLibrary />} />
        {/* Legacy course builder */}
        <Route path="/content-library/builder/legacy/:courseId" element={<CourseBuilder />} />
        <Route path="/content-library/builder/legacy/new" element={<CourseBuilder />} />
        {/* New split-screen course builder */}
        <Route path="/content-library/builder/new" element={<SplitScreenCourseBuilder />} />
        <Route path="/content-library/builder/:courseId" element={<SplitScreenCourseBuilder />} />
        {/* Topic editor */}
        <Route path="/content-library/builder/:courseId/module/:moduleId/topic/:topicId" element={<TopicEditor />} />
        {/* Quiz builder */}
        <Route path="/content-library/builder/:courseId/module/:moduleId/quiz/:quizId" element={<QuizBuilder />} />
        <Route path="/content-library/builder/:courseId/module/:moduleId/quiz/new" element={<QuizBuilder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App