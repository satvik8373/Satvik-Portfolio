import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProjectCard = ({ title, subtitle, tech, description, type, id, image, externalLink }) => {
  // Get CSS classes based on project type
  const getCardClasses = () => {
    switch(type) {
      case 'design':
        return 'bg-gradient-design';
      case 'art':
        return 'bg-gradient-art';
      case 'photo':
        return 'bg-gradient-photo';
      default:
        return 'bg-gradient-design';
    }
  };

  const cardBgClass = getCardClasses();

  // Handle external link click
  const handleExternalLinkClick = (e, link) => {
    if (link) {
      e.preventDefault();
      e.stopPropagation();
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Link to={`/project/${id}`} className="block h-full">
      <div className="h-full w-full relative group cursor-pointer transition-transform hover:scale-[1.02] duration-300">
        <div className={`w-full h-full overflow-hidden rounded-3xl border border-white/10 relative`}>
          {/* Background image with overlay */}
          <img 
            src={image} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className={`absolute inset-0 z-10 opacity-70 ${cardBgClass}`}></div>
          
          {/* Title only (always visible) */}
          <div className="absolute bottom-0 left-0 right-0 z-20 glass-card-dark p-5 rounded-b-3xl transition-all duration-300 group-hover:pb-24">
            <h3 className="text-xl font-bold text-white leading-tight text-shadow-sm">
              {title}
            </h3>
            
            {/* Details (visible on hover) */}
            <div className="absolute left-0 right-0 px-5 pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              <p className="text-xs text-white/90 text-shadow-sm mt-2 mb-3">
                {subtitle}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  {externalLink && (
                    <div 
                      onClick={(e) => handleExternalLinkClick(e, externalLink)}
                      className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-2 hover:bg-white/40 transition-all duration-300 cursor-pointer"
                    >
                      <ExternalLink size={10} className="text-white/90" />
                    </div>
                  )}
                  <p className="text-xs font-medium text-white/90 text-shadow-sm">{tech}</p>
                </div>
                <p className="text-xs text-white/80 text-shadow-sm">{description}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl z-20 pointer-events-none border border-white/20 group-hover:border-white/30"></div>
      </div>
    </Link>
  )
}

const Projects = () => {
  const projects = [
    {
      id: 'spotify-clone',
      title: 'MAVRIXFY',
      subtitle: 'MUSIC STREAMING APP',
      image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3',
      tech: 'React.js',
      description: 'Music streaming interface',
      type: 'design',
      externalLink: 'https://mavrixfilms.live'
    },
    {
      id: 'multiplast-website',
      title: 'MULTIPLAST WEBSITE',
      subtitle: 'COMPANY WEBSITE WITH CMS',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=3538&auto=format&fit=crop&ixlib=rb-4.0.3',
      tech: 'Client Project',
      description: 'Corporate web platform',
      type: 'art'
    },
    {
      id: 'cafe-store',
      title: 'CAFE STORE E-COMMERCE',
      subtitle: 'WITH ADMIN PANEL',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3',
      tech: 'MERN Stack',
      description: 'Coffee shop online store',
      type: 'photo'
    },
    {
      id: 'video-meeting',
      title: 'VIDEO MEETING WEB',
      subtitle: 'REAL-TIME CONFERENCING',
      image: 'https://images.unsplash.com/photo-1609921141835-710b7fa6e438?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
      tech: 'WebRTC',
      description: 'Video conferencing app',
      type: 'design'
    }
  ]

  // Split projects into rows
  const firstRow = projects.slice(0, 3);
  const secondRow = projects.slice(3);

  return (
    <section id="projects" className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl font-semibold mb-6 text-white"
        >
          Projects
        </motion.h2>

        {/* First row - 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {firstRow.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-[280px]"
            >
              <ProjectCard 
                id={project.id}
                title={project.title}
                subtitle={project.subtitle}
                tech={project.tech}
                description={project.description}
                type={project.type}
                image={project.image}
                externalLink={project.externalLink}
              />
            </motion.div>
          ))}
        </div>

        {/* Second row - remaining cards */}
        {secondRow.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {secondRow.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-[280px]"
              >
                <ProjectCard 
                  id={project.id}
                  title={project.title}
                  subtitle={project.subtitle}
                  tech={project.tech}
                  description={project.description}
                  type={project.type}
                  image={project.image}
                  externalLink={project.externalLink}
                />
              </motion.div>
            ))}
            {/* Add empty divs to maintain grid layout if needed */}
            {secondRow.length < 3 && [...Array(3 - secondRow.length)].map((_, i) => (
              <div key={`empty-${i}`} className="h-[280px] hidden md:block"></div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Projects