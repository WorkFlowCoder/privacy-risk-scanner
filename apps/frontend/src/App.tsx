import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard "
import AnalysisDetailPage from "./pages/AnalysisDetailPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
    </Routes>
  )
}

export default App