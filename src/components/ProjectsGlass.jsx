import { motion } from 'framer-motion'

const ProjectsGlass = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Modern shopping experience with real-time inventory',
      tech: ['React', 'Node.js', 'MongoDB'],
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 2,
      title: 'AI Dashboard',
      description: 'Analytics platform with machine learning insights',
      tech: ['Next.js', 'Python', 'TensorFlow'],
      gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 3,
      title: 'Social Media App',
      description: 'Real-time messaging and content sharing',
      tech: ['React Native', 'Firebase', 'WebRTC'],
      gradient: 'from-orange-500/20 to-red-500/20'
    },
    {
      id: 4,
      title: 'Portfolio CMS',
      description: 'Headless CMS for creative professionals',
      tech: ['Next.js', 'Sanity', 'Tailwind'],
      gradient: 'from-green-500/20 to-emerald-500/20'
    }
  ]

  return (
    <div className="relative bg-black">
      {/* Seamless gradient transition from scrolly section */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      
      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold text-white mb-16 text-center"
          >
            Featured Projects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`
                  relative overflow-hidden rounded-2xl p-8
                  backdrop-blur-xl bg-gradient-to-br ${project.gradient}
                  border border-white/10
                  hover:border-white/30 hover:shadow-2xl hover:shadow-white/10
                  transition-all duration-300 cursor-pointer
                  group
                `}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-white/70 mb-6 text-lg">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm border border-white/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsGlass
