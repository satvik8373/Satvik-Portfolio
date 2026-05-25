import React from 'react'
import { motion as m } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const ExperienceItem = ({ title, period, description, logo, delay, isEducation }) => {
  const { isDarkMode } = useTheme()
  
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="mb-16 last:mb-0 relative"
    >
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border z-10 theme-transition ${
          isEducation 
            ? 'bg-gradient-orange-purple shadow-gradient-orange/10 border-gradient-orange/20' 
            : 'bg-secondary shadow-gradient-blue/10 border-primary'
        }`}>
          {logo || <span className={`font-bold text-sm theme-transition ${
            isEducation 
              ? 'text-white' 
              : isDarkMode 
                ? 'text-white' 
                : 'text-primary'
          }`}>{isEducation ? '🎓' : title.charAt(0)}</span>}
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
            <h3 className="text-xl md:text-2xl font-bold text-primary tracking-tight theme-transition">{title}</h3>
            <span className={`text-sm md:text-base font-medium px-4 py-1 rounded-full mt-2 md:mt-0 theme-transition ${
              isEducation 
                ? 'bg-gradient-orange-purple/20 text-white' 
                : 'bg-secondary text-secondary'
            }`}>{period}</span>
          </div>
          <p className="text-muted text-base leading-relaxed theme-transition">{description}</p>
        </div>
      </div>
      
      {/* Timeline connector */}
      <div 
        className="absolute left-5 top-10 bottom-0 w-0.5 h-full -z-10 theme-transition"
        style={{
          background: `linear-gradient(to bottom, rgba(var(--color-accent-blue), 0.3), transparent)`
        }}
      ></div>
    </m.div>
  )
}

const Experience = () => {
  const { isDarkMode } = useTheme()
  const experiences = [
    {
      title: 'React.js Trainee at TOPS Technologies',
      period: 'Sep 2025 - Jan 2026',
      description: "Completed a full-time React.js professional training program in Ahmedabad. Developed responsive web applications, reusable frontend components, and practical UI flows using modern React.js patterns.",
      logo: null
    },
    {
      title: 'Full Stack Developer Intern at InnoByte Services',
      period: 'Sep 2025 - Oct 2025',
      description: "Worked remotely on full-stack feature development using JavaScript frameworks and REST APIs. Improved application structure through debugging, optimization, and hands-on integration work.",
      logo: null
    },
    {
      title: 'Web Developer Intern at Spread Me Digital',
      period: 'Jan 2025 - Apr 2025',
      description: "Built responsive web interfaces in Gandhinagar and integrated backend APIs. Worked with MongoDB and MySQL databases while applying responsive UI/UX principles for consistent performance across devices.",
      logo: null
    },
    {
      title: "Master's in Information Technology",
      period: 'Ongoing',
      description: "Ganpat University, Kherva, Gujarat",
      logo: null,
      isEducation: true
    },
    {
      title: 'B.Sc. Information Technology',
      period: 'Completed',
      description: "Ganpat University, Kherva, Gujarat - CGPA: 7.0",
      logo: null,
      isEducation: true
    }
  ]

  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <m.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl font-extrabold mb-20 text-center bg-gradient-blue bg-clip-text text-transparent inline-block mx-auto"
        >
          Experience & Education
        </m.h2>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <ExperienceItem 
              key={`${exp.title}-${exp.period}`}
              title={exp.title}
              period={exp.period}
              description={exp.description}
              logo={exp.logo}
              delay={index * 0.1}
              isEducation={exp.isEducation}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
