import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import TechStack from './components/TechStack'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Footer from './components/Footer'
import ProjectDetail from './components/ProjectDetail'
import ThemeDebugPanel from './components/ThemeDebugPanel'

function App() {
  return (
    <ThemeProvider>
      <Router>
      <Routes>
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/" element={
          <div className="min-h-screen bg-primary relative overflow-hidden theme-transition">
            {/* Background elements with theme support */}
            <div className="absolute top-40 -left-64 w-96 h-96 rounded-full blur-[100px] -z-10 theme-transition" 
                 style={{ backgroundColor: 'rgba(var(--color-accent-purple), 0.1)' }}></div>
            <div className="absolute top-[30%] -right-64 w-96 h-96 rounded-full blur-[100px] -z-10 theme-transition" 
                 style={{ backgroundColor: 'rgba(var(--color-accent-orange), 0.1)' }}></div>
            <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px] -z-10 theme-transition" 
                 style={{ backgroundColor: 'rgba(var(--color-accent-blue), 0.1)' }}></div>
            
            <Header />
            <Hero />
            <About />
            <TechStack />
            <Projects />
            <Experience />
            <Footer />
            
            {/* Theme Debug Panel - only in development */}
            {process.env.NODE_ENV === 'development' && <ThemeDebugPanel />}
          </div>
        } />
      </Routes>
    </Router>
    </ThemeProvider>
  )
}

export default App