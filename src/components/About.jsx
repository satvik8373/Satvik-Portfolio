import React from 'react'
import { motion } from 'framer-motion'

const About = () => {
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-text-secondary uppercase tracking-widest mb-16 letter-spacing-2">
            Technical Skills
          </h2>
          
          {/* Tech logos */}
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 mb-20">
            {['React.js', 'Node.js', 'JavaScript', 'HTML5', 'CSS3', 'MongoDB', 'MySQL', 'Tailwind'].map((tech, index) => (
              <motion.div 
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-20 h-20 bg-primary-card rounded-full flex items-center justify-center shadow-lg shadow-black/20 hover:shadow-gradient-orange/20 transition-all duration-300 hover:-translate-y-1 group"
              >
                <span className="text-white font-bold text-sm group-hover:text-gradient-orange transition-colors duration-300">{tech}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About