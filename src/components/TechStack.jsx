import React from 'react'
import { motion as m } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const TechStack = () => {
  const { isDarkMode } = useTheme()
  // This component could be merged with About, but keeping it separate as per App.jsx structure
  const techCategories = [
    {
      title: "Certificates",
      techs: ["React.js Full-Time Professional Course - TOPS Technologies", "Responsive Web Design - freeCodeCamp", "JavaScript Mastery - Udemy / Coursera"]
    },
    {
      title: "Tools & Technologies",
      techs: ["Git", "GitHub", "Vercel", "Render", "Postman", "WordPress", "Firebase", "Tailwind CSS"]
    },
    {
      title: "Languages",
      techs: ["English (Professional)", "Hindi (Native)", "Gujarati (Native)"]
    },
    {
      title: "AI Development",
      techs: ["ChatGPT Codex", "Claude", "Cursor AI", "Kiro", "Antigravity", "Emergent AI", "GitHub Copilot"]
    }
  ];
  
  return (
    <section className="py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {techCategories.map((category, idx) => (
              <m.div 
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="bg-secondary/50 p-6 rounded-xl border-primary border theme-transition"
              >
                <h3 className="text-xl font-semibold mb-4 bg-gradient-orange-purple bg-clip-text text-transparent inline-block">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {category.techs.map(tech => (
                    <span key={tech} className="px-4 py-2 bg-primary rounded-full text-sm text-secondary theme-transition border-primary border">
                      {tech}
                    </span>
                  ))}
                </div>
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  )
}

export default TechStack
