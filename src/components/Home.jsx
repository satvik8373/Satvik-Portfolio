import React, { Suspense, lazy, useRef, useSyncExternalStore } from 'react'
import ScrollyCanvas from './ScrollyCanvas'
import Overlay from './Overlay'

const Header = lazy(() => import('./Header'))
const About = lazy(() => import('./About'))
const TechStack = lazy(() => import('./TechStack'))
const Projects = lazy(() => import('./Projects'))
const Experience = lazy(() => import('./Experience'))
const Footer = lazy(() => import('./Footer'))

let sectionsReady = false
let sectionsScheduled = false
let idleId = null
const sectionSubscribers = new Set()

const notifySectionSubscribers = () => {
  sectionSubscribers.forEach((notify) => notify())
}

const setSectionsReady = () => {
  sectionsReady = true
  notifySectionSubscribers()
}

const scheduleSectionReveal = () => {
  if (sectionsScheduled || sectionsReady || typeof window === 'undefined') return

  sectionsScheduled = true
  const revealSections = () => {
    const scheduleIdle = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 1200))
    idleId = scheduleIdle(setSectionsReady, { timeout: 2500 })
  }

  if (document.readyState === 'complete') {
    revealSections()
  } else {
    window.addEventListener('load', revealSections, { once: true })
  }
}

const subscribeToSectionsReady = (notify) => {
  sectionSubscribers.add(notify)
  scheduleSectionReveal()

  return () => {
    sectionSubscribers.delete(notify)
    if (sectionSubscribers.size === 0 && idleId && window.cancelIdleCallback) {
      window.cancelIdleCallback(idleId)
      idleId = null
      sectionsScheduled = false
    }
  }
}

const getSectionsReady = () => sectionsReady

const Home = () => {
  const scrollyRef = useRef(null)
  const showSections = useSyncExternalStore(subscribeToSectionsReady, getSectionsReady, () => false)
  
  return (
    <div className="relative bg-primary theme-transition min-h-screen">
      {showSections && (
        <Suspense fallback={null}>
          <Header />
        </Suspense>
      )}
      
      {/* Scrollytelling Hero Section */}
      <div id="home" className="relative" ref={scrollyRef}>
        <ScrollyCanvas />
        <Overlay containerRef={scrollyRef} />
      </div>

      {showSections && (
        <Suspense fallback={null}>
          {/* About Section */}
          <About />

          {/* Tech Stack */}
          <TechStack />

          {/* Projects Section */}
          <Projects />

          {/* Experience Section */}
          <div id="experience">
            <Experience />
          </div>

          {/* Contact/Footer Section */}
          <div id="contact">
            <Footer />
          </div>
        </Suspense>
      )}
    </div>
  )
}

export default Home
