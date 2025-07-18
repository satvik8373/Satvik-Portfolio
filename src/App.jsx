import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import TechStack from './components/TechStack'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Footer from './components/Footer'
import ProjectDetail from './components/ProjectDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/" element={
          <div className="min-h-screen bg-primary-bg relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-40 -left-64 w-96 h-96 rounded-full bg-gradient-purple/10 blur-[100px] -z-10"></div>
            <div className="absolute top-[30%] -right-64 w-96 h-96 rounded-full bg-gradient-orange/10 blur-[100px] -z-10"></div>
            <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-blue/10 blur-[100px] -z-10"></div>
            
            <Header />
            <Hero />
            <About />
            <TechStack />
            <Projects />
            <Experience />
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App