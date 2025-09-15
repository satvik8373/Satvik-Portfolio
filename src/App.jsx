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
import AnimatedBackground from './AnimatedBackground'
import TrueFocus from './components/TrueFocus'
import FlowingMenu from './components/FlowingMenu'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-primary relative overflow-hidden theme-transition">
                {/* Animated Background */}
                <AnimatedBackground />

                <Header />
                <Hero />
                {/* Flowing skills/traits menu */}
                <div className="container mx-auto px-4 py-8">
                  <div style={{ height: '420px', position: 'relative' }}>
                    <FlowingMenu
                      items={[
                        { link: '#skills', text: 'Problem Solving', image: 'https://picsum.photos/600/400?random=11' },
                        { link: '#skills', text: 'System Design', image: 'https://picsum.photos/600/400?random=12' },
                        { link: '#skills', text: 'Performance', image: 'https://picsum.photos/600/400?random=13' },
                        { link: '#skills', text: 'Animations', image: 'https://picsum.photos/600/400?random=14' }
                      ]}
                    />
                  </div>
                </div>
                <div className="container mx-auto px-4 py-8">
                  <TrueFocus
                    sentence="True Focus"
                    manualMode={false}
                    blurAmount={5}
                    borderColor="#E629FF"
                    animationDuration={2}
                    pauseBetweenAnimations={1}
                  />
                </div>
                <About />
                <TechStack />
                <Projects />
                <Experience />
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App