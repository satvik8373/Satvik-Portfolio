import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
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
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
  }



  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Contact', id: 'contact' }
  ]

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`${isScrolled ? 'max-w-3xl' : 'max-w-7xl'} w-full mx-auto px-4 ${isScrolled ? 'py-2' : 'py-4'} transition-all duration-500`}>
          {/* Glassmorphism navbar */}
          <motion.div 
            className={`backdrop-blur-md ${
              isScrolled 
                ? 'glass-card shadow-lg' 
                : 'bg-transparent'
            } rounded-full px-4 sm:px-6 py-2 flex items-center justify-between theme-transition`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            layout
          >
            {/* Logo with Name */}
            <AnimatePresence>
              <motion.div 
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
                <motion.div 
                  className={`ml-2 font-jakarta font-bold text-primary theme-transition flex items-center ${
                    isScrolled ? 'text-sm' : 'text-base'
                  }`}
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span className="hidden sm:inline">Satvik Patel</span>
                  <span className="sm:hidden">Satvik</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
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

            <div className="flex items-center space-x-2">
              {/* Theme toggle */}
              <motion.div
                animate={{ scale: isScrolled ? 0.9 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <ThemeToggle size={isScrolled ? 'sm' : 'md'} />
              </motion.div>

              {/* Mobile menu button - now using Lucide icons */}
              <motion.button 
                className="md:hidden flex items-center justify-center text-primary focus-theme"
                onClick={toggleMobileMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <div className={`${
                  isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                } rounded-full glass-card flex items-center justify-center hover-bg-secondary theme-transition`}>
                  {mobileMenuOpen ? 
                    <X size={isScrolled ? 16 : 18} /> : 
                    <Menu size={isScrolled ? 16 : 18} />
                  }
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 backdrop-blur-md flex items-center justify-center theme-transition"
            style={{ backgroundColor: 'rgba(var(--color-bg-primary), 0.9)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="text-center mb-8">
              <motion.h2 
                className="text-primary text-3xl font-bold mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Satvik Patel
              </motion.h2>
              <motion.p 
                className="text-secondary text-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Full Stack Web Developer
              </motion.p>
            </motion.div>
            
            <motion.nav 
              className="flex flex-col items-center space-y-8 py-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-jakarta font-semibold text-2xl tracking-wider relative group ${
                    activeSection === item.id ? 'text-accent-blue' : 'text-primary'
                  } theme-transition focus-theme`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  <span className={`absolute -bottom-2 left-0 h-1 bg-gradient-orange-purple theme-transition ${
                    activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </motion.button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header