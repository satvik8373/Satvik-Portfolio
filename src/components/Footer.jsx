import React from 'react'
import { motion as m } from 'framer-motion'
import { Mail, Github, Linkedin, MapPin, Phone } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const COPYRIGHT_YEAR = 2026

const Footer = () => {
  const { isDarkMode } = useTheme()

  return (
    <footer id="contact" className="py-24 px-6 theme-transition" style={{ backgroundColor: 'rgb(var(--color-bg-footer))' }}>
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-orange-purple bg-clip-text text-transparent inline-block">Contact</h2>

          <p className="text-secondary mb-10 leading-relaxed text-lg theme-transition">
            Full Stack MERN Developer building modern web and mobile applications with React.js, Node.js,
            Express.js, MongoDB, and AI-assisted development workflows.
          </p>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center theme-transition">
              <Mail size={18} className="text-accent-orange" />
            </div>
            <a href="mailto:satvikpatel8373@gmail.com" className="text-secondary font-semibold hover-text-primary theme-transition">
              satvikpatel8373@gmail.com
            </a>
          </div>

          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center theme-transition">
              <Phone size={18} className="text-accent-orange" />
            </div>
            <span className="text-secondary font-semibold theme-transition">
              +91-9558268373
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center theme-transition">
              <MapPin size={18} className="text-accent-orange" />
            </div>
            <span className="text-secondary font-semibold theme-transition">
              Ahmedabad, Gujarat
            </span>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a href="https://github.com/satvik8373" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-gradient-orange-purple theme-transition group">
              <Github size={22} className="text-primary group-hover:text-white theme-transition" />
            </a>
            <a href="https://www.linkedin.com/in/satvik-patel" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-gradient-orange-purple theme-transition group">
              <Linkedin size={22} className="text-primary group-hover:text-white theme-transition" />
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-primary theme-transition">
            <p className="text-muted text-sm theme-transition">
              © {COPYRIGHT_YEAR} Satvik Patel | Full Stack MERN Developer. All rights reserved.
            </p>
          </div>
        </m.div>
      </div>
    </footer>
  )
}

export default Footer
