import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer id="contact" className="bg-primary-footer py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-orange-purple bg-clip-text text-transparent inline-block">Contact</h2>
          
          <p className="text-text-secondary mb-10 leading-relaxed text-lg">
            Full Stack Web Developer with hands-on internship experience building MERN stack applications 
            and modern user interfaces. Passionate about creating clean, scalable code and intuitive user experiences.
          </p>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-card flex items-center justify-center">
              <Mail size={18} className="text-gradient-orange" />
            </div>
            <a href="mailto:satvikpatel8373@gmail.com" className="text-text-secondary font-semibold hover:text-white transition-colors">
              satvikpatel8373@gmail.com
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-primary-card flex items-center justify-center">
              <span className="text-gradient-orange font-bold">📱</span>
            </div>
            <span className="text-text-secondary font-semibold">
              +91-9558268373
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-6">
            <a href="#" className="w-12 h-12 rounded-full bg-primary-card flex items-center justify-center hover:bg-gradient-orange-purple transition-all duration-300 group">
              <Github size={22} className="text-white group-hover:text-white" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-primary-card flex items-center justify-center hover:bg-gradient-orange-purple transition-all duration-300 group">
              <Linkedin size={22} className="text-white group-hover:text-white" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-primary-card flex items-center justify-center hover:bg-gradient-orange-purple transition-all duration-300 group">
              <Twitter size={22} className="text-white group-hover:text-white" />
            </a>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-800">
            <p className="text-text-muted text-sm">
              © {new Date().getFullYear()} Satvik Patel | Full Stack Web Developer. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer