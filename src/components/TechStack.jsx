import React from 'react'
import { motion } from 'framer-motion'

const TechStack = () => {
  // This component could be merged with About, but keeping it separate as per App.jsx structure
  const techCategories = [
    {
      title: "Certificates",
      techs: ["JavaScript Mastery – Udemy/Coursera", "Responsive Web Design – freeCodeCamp", "MERN Stack Bootcamp"]
    },
    {
      title: "Tools & Technologies",
      techs: ["Git", "GitHub", "VS Code", "Vercel", "Netlify", "Firebase", "Tailwind CSS"]
    },
    {
      title: "Languages",
      techs: ["English", "Hindi", "Gujarati"]
    },
    {
      title: "Hobbies & Interests",
      techs: ["Gaming", "Indoor Games", "Learning new tech tools"]
    }
  ];
  
  return (
    <section className="py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {techCategories.map((category, idx) => (
              <motion.div 
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="bg-primary-card/50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-semibold mb-4 text-gradient-orange bg-clip-text text-transparent inline-block">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {category.techs.map(tech => (
                    <span key={tech} className="px-4 py-2 bg-primary-bg rounded-full text-sm text-text-secondary">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TechStack