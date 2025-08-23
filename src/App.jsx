import React, { useState } from 'react'
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
import AnimatedBackground from './AnimatedBackground'
import TrueFocus from './components/TrueFocus'
import GooeyIntro from './components/GooeyIntro'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = () => {
    setIntroComplete(true);
  };

  const PortfolioContent = () => (
    <div className="min-h-screen bg-primary relative overflow-hidden theme-transition">
      {/* Animated Background */}
      <AnimatedBackground />

      <Header />
      <Hero />
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

      {/* Theme Debug Panel - only in development */}
      {process.env.NODE_ENV === 'development' && <ThemeDebugPanel />}
    </div>
  );

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/project/:id" element={<ProjectDetail />} />
                      <Route
              path="/"
              element={
                <ErrorBoundary>
                  <GooeyIntro onIntroComplete={handleIntroComplete}>
                    <PortfolioContent />
                  </GooeyIntro>
                </ErrorBoundary>
              }
            />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App