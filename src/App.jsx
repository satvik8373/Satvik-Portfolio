import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Home from './components/Home'
import ProjectDetail from './components/ProjectDetail'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App