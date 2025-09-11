import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Mail } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import LiquidEther from './LiquidEther'

const Hero = () => {
  const { isDarkMode } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center pt-24 px-6 relative overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LiquidEther Hover Effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isHovered && (
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={false}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
            style={{ width: '100%', height: '100%' }}
            className="opacity-40"
          />
        )}
      </motion.div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Avatar */}
        <motion.div
          className="mb-12"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="w-56 h-56 mx-auto rounded-full bg-avatar-gradient p-1.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
              <img
                src=".\images\satvik.jpg"
                alt="Satvik Patel"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-poppins font-extrabold mb-8 leading-tight tracking-tight">
            <span className="bg-gradient-orange-purple bg-clip-text text-transparent inline-block">
              Satvik Patel
            </span>
            <br />
            <span className="bg-gradient-orange-purple bg-clip-text text-transparent inline-block">
              Full Stack Web Developer
            </span>
          </h1>
        </motion.div>

        {/* About Text */}
        <motion.p
          className="text-secondary font-light text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed theme-transition"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Full Stack Web Developer with hands-on internship experience building MERN stack applications
          and modern user interfaces. Passionate about creating clean, scalable code and intuitive user experiences.
          Strong proficiency in JavaScript frameworks, responsive design principles, and database management.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a 
            href="mailto:satvikpatel8373@gmail.com" 
            className="bg-white text-primary-bg px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 theme-transition flex items-center gap-3 min-w-[195px] justify-center shadow-lg focus-theme"
            style={{ 
              backgroundColor: isDarkMode ? 'white' : 'rgb(var(--color-bg-tertiary))',
              color: isDarkMode ? 'rgb(var(--color-bg-primary))' : 'rgb(var(--color-text-primary))'
            }}
          >
            <Mail size={20} strokeWidth={2.5} />
            Get In Touch
          </a>
          <a 
            href="#" 
            className="border-2 px-8 py-4 rounded-full font-semibold text-lg theme-transition flex items-center gap-3 min-w-[204px] justify-center hover:shadow-lg focus-theme border-primary text-primary hover-bg-secondary"
          >
            <Download size={20} strokeWidth={2.5} />
            Download CV
          </a>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="mt-8 text-secondary text-sm flex flex-wrap justify-center gap-x-6 gap-y-2 theme-transition"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <span>+91-9558268373</span>
          <span>Ahmedabad, Gujarat</span>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero