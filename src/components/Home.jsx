import React, { useRef } from 'react'
import Header from './Header'
import ScrollyCanvas from './ScrollyCanvas'
import Overlay from './Overlay'
import Projects from './Projects'
import About from './About'
import TechStack from './TechStack'
import Experience from './Experience'
import Footer from './Footer'

const Home = () => {
  const scrollyRef = useRef(null)
  
  return (
    <div className="relative bg-primary theme-transition min-h-screen">
      <Header />
      
      {/* Scrollytelling Hero Section */}
      <div id="home" className="relative" ref={scrollyRef}>
        <ScrollyCanvas />
        <Overlay containerRef={scrollyRef} />
      </div>

      {/* Projects Section */}
      <Projects />

      {/* About Section */}
      <About />

      {/* Tech Stack */}
      <TechStack />

      {/* Experience Section */}
      <div id="experience">
        <Experience />
      </div>

      {/* Contact/Footer Section */}
      <div id="contact">
        <Footer />
      </div>
    </div>
  )
}

export default Home
