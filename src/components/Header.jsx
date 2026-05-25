import React, { Suspense, lazy, useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from './ThemeToggle'

const StaggeredMenu = lazy(() => import('./StaggeredMenu'))

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [showHeader, setShowHeader] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      
      // Show header after scrolling past 80% of the scrollytelling section (400vh)
      const scrollytellingHeight = windowHeight * 5 // 500vh
      const showThreshold = scrollytellingHeight * 0.8 // 80% of scrollytelling section
      
      setShowHeader(scrollPosition > showThreshold)
      setIsScrolled(scrollPosition > 50)
      
      // Determine active section based on scroll position
      const sections = ['home', 'projects', 'experience', 'contact']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(sectionId)
  }

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Contact', id: 'contact' }
  ]

  return (
    <>
      <m.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:flex justify-center`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: showHeader ? 0 : -100,
          opacity: showHeader ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <div className={`${isScrolled ? 'max-w-3xl' : 'max-w-7xl'} w-full mx-auto px-4 ${isScrolled ? 'py-2' : 'py-4'} transition-all duration-500`}>
          {/* Glassmorphism navbar with enhanced visibility */}
          <m.div 
            className={`backdrop-blur-xl ${
              isScrolled 
                ? 'glass-card shadow-lg bg-black/60' 
                : 'bg-black/50 border border-white/10'
            } rounded-full px-4 sm:px-6 py-2 flex items-center justify-between theme-transition`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            layout
          >
            {/* Logo with Name */}
            <AnimatePresence>
              <m.div 
                className="flex items-center"
                animate={{ 
                  scale: isScrolled ? 0.8 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="/images/MX_LOGO.png" 
                  alt="MX Logo" 
                  className={`${isScrolled ? 'w-8 h-8' : 'w-10 h-10'} object-contain transition-all duration-300`} 
                />
                <m.div 
                  className={`ml-2 font-jakarta font-bold text-primary theme-transition flex items-center ${
                    isScrolled ? 'text-sm' : 'text-base'
                  }`}
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span className="hidden sm:inline">Satvik Patel</span>
                  <span className="sm:hidden">Satvik</span>
                </m.div>
              </m.div>
            </AnimatePresence>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-x-4 lg:gap-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`font-jakarta font-semibold ${isScrolled ? 'text-sm' : 'text-base'} tracking-wider relative group ${
                    activeSection === item.id ? 'text-accent-blue' : 'text-primary hover-text-primary'
                  } theme-transition focus-theme`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-orange-purple theme-transition ${
                    activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-x-2">
              {/* Theme toggle */}
              <m.div
                animate={{ scale: isScrolled ? 0.9 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <ThemeToggle size={isScrolled ? 'sm' : 'md'} />
              </m.div>
            </div>
          </m.div>
        </div>
      </m.header>

      {showHeader && (
        <Suspense fallback={null}>
          <StaggeredMenu
            className="md:hidden"
            isFixed
            position="right"
            logoUrl="/images/MX_LOGO.png"
            colors={['#ff8660', '#9a33ff']}
            accentColor="#ff8660"
            menuButtonColor="#ffffff"
            openMenuButtonColor={isDarkMode ? '#ffffff' : '#111111'}
            items={navItems.map((item) => ({
              label: item.name,
              ariaLabel: `Go to ${item.name}`,
              link: `#${item.id}`,
              id: item.id,
            }))}
            socialItems={[
              { label: 'GitHub', link: 'https://github.com/satvik8373' },
              { label: 'LinkedIn', link: 'https://www.linkedin.com/in/satvik-patel' },
              { label: 'Email', link: 'mailto:satvikpatel8373@gmail.com' },
            ]}
            displaySocials
            displayItemNumbering
          />
        </Suspense>
      )}
    </>
  )
}

export default Header
