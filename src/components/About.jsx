import React from 'react'
import { motion as m } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import MagicBento from './MagicBento'

const BENTO_FEATURES = {
  stars: true,
  spotlight: true,
  borderGlow: true,
  animations: true,
  tilt: true,
  clickEffect: true,
  magnetism: true,
}

const About = () => {
  const { isDarkMode } = useTheme()
  
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-secondary uppercase tracking-widest mb-16 letter-spacing-2 theme-transition">
            Technical Skills
          </h2>
          
          {/* Magic Bento Grid */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <MagicBento 
              textAutoHide={true}
              features={BENTO_FEATURES}
              spotlightRadius={300}
              particleCount={12}
              glowColor="132, 0, 255"
            />
          </m.div>
        </m.div>
      </div>
    </section>
  )
}

export default About
