import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  
  // Project data with high-quality images
  const projectData = {
    'spotify-clone': {
      title: 'MAVRIXFY',
      subtitle: 'MUSIC STREAMING APP',
      description: 'A fully functional music streaming application built with React.js, featuring user authentication, playlist management, and real-time music playback. The application utilizes web APIs to fetch music data and implements a responsive design that provides an intuitive and engaging user experience.\n\nThis project demonstrates advanced React concepts including context API for state management, custom hooks for audio playback, and integration with third-party services. The UI is built with a combination of custom CSS and styled components to achieve a sleek, modern look that enhances the music listening experience.',
      type: 'design',
      image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3',
      projectItems: [
        {
          title: 'Seamless Music Streaming Experience',
          content: 'Mavrixfy delivers a premium music streaming experience with a clean, intuitive interface that makes discovering and enjoying music effortless. The application features real-time playback controls, playlist management, and personalized recommendations based on listening history.\n\nThe project utilizes React.js for the frontend, Node.js and Express for the backend API, and integrates with music APIs for comprehensive music data. Authentication is handled securely, allowing users to create accounts and personalize their music experience.',
          link: 'https://mavrixfilms.live',
          linkText: 'Visit Mavrixfy'
        }
      ],
      sections: [
        {
          title: 'Responsive Design: Mobile to Desktop',
          description: 'The application was designed with a mobile-first approach, ensuring a seamless experience across all device sizes. The responsive layout adapts dynamically to different screen dimensions while maintaining usability and visual appeal.',
          alignment: 'center',
          image: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=3276&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
          title: 'Advanced Audio Visualization',
          description: 'One of the standout features is the custom audio visualization that responds to the music being played. Using the Web Audio API, the application creates dynamic visual elements that enhance the listening experience and add a unique touch to the interface.',
          alignment: 'right',
          image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=3274&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
          title: 'Personalized User Experience',
          description: 'The application learns from user behavior to deliver personalized recommendations and create custom playlists. This machine learning integration helps users discover new music while enjoying their favorites.',
          alignment: 'center',
          image: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
          title: 'Takeaway: Scaling Complex Frontend Applications',
          description: 'Building Mavrixfy provided valuable insights into managing state in large-scale applications, optimizing performance for media-heavy interfaces, and implementing secure authentication flows. The project demonstrated the importance of component architecture planning and code organization for maintainable React applications.',
          alignment: 'left',
          image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3'
        }
      ],
      externalLink: 'https://mavrixfilms.live'
    },
    'multiplast-website': {
      title: 'MULTIPLAST WEBSITE',
      subtitle: 'COMPANY WEBSITE WITH CMS',
      description: 'A comprehensive corporate website for Multiplast, a manufacturing company specializing in plastic products. The site features a custom content management system that allows the client to easily update product information, news, and company details without technical knowledge.\n\nBuilt with a modern tech stack including React for the frontend and a headless CMS backend, the website offers excellent performance, SEO optimization, and a responsive design that works flawlessly across all devices. The project included information architecture planning, UX design, development, and client training.',
      type: 'art',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=3538&auto=format&fit=crop&ixlib=rb-4.0.3',
      projectItems: [
        {
          title: 'Enterprise-Grade CMS with Intuitive Interface',
          content: 'The Multiplast website combines sophisticated functionality with an easy-to-use content management system. The client can manage their entire product catalog, update company information, publish news articles, and handle customer inquiries through a custom-built admin dashboard.\n\nThe frontend delivers a polished user experience with optimized page load times and interactive elements that highlight the company\'s products and services. The design reflects the company\'s brand identity while providing clear navigation and information hierarchy.',
          link: 'https://multiplast-industries.example.com',
          linkText: 'Visit Website'
        }
      ],
      sections: [
        {
          title: 'Product Showcase: Interactive Catalog',
          description: 'The product catalog features interactive 3D models that allow customers to examine products from all angles. This innovative approach helps potential clients better understand the products and reduces the need for physical samples.',
          alignment: 'center',
          image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
          title: 'Multilingual Support: Global Reach',
          description: 'To support Multiplast\'s international business, the website includes comprehensive multilingual capabilities with content localization for five languages. The system allows for easy management of translations through the CMS.',
          alignment: 'right',
          image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
          title: 'Analytics Dashboard: Data-Driven Decisions',
          description: 'A custom analytics dashboard provides the client with valuable insights about visitor behavior, popular products, and conversion rates. This data helps inform marketing strategies and product development.',
          alignment: 'center',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3'
        }
      ]
    },
    'cafe-store': {
      title: 'CAFE STORE E-COMMERCE',
      subtitle: 'WITH ADMIN PANEL',
      description: 'A full-featured e-commerce platform for a specialty coffee shop, enabling online ordering, subscription services, and digital gift cards. The application includes a comprehensive admin panel for inventory management, order processing, and customer relationship management.\n\nBuilt using the MERN stack (MongoDB, Express, React, Node.js), the platform integrates secure payment processing, automated order fulfillment, and a loyalty program. The design emphasizes the premium nature of the products while providing an intuitive shopping experience.',
      type: 'photo',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3',
      projectItems: [
        {
          title: 'Artisanal Coffee E-commerce Experience',
          content: 'This specialty coffee e-commerce platform combines beautiful design with powerful functionality to create an engaging shopping experience. Customers can browse coffee varieties with detailed information about origin, flavor profiles, and brewing recommendations.\n\nThe subscription service allows coffee enthusiasts to receive regular deliveries of freshly roasted beans, with flexible options for frequency, quantity, and variety. The system handles recurring billing, delivery scheduling, and customer communication automatically.',
          link: 'https://artisan-coffee-shop.example.com',
          linkText: 'Visit Store'
        }
      ],
      sections: [
        {
          title: 'Product Customization: Personal Touch',
          description: 'Customers can customize their coffee orders with options for grind size, roast level, and packaging. The system calculates pricing dynamically and provides visual feedback on selections.',
          alignment: 'center',
          image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
          title: 'Subscription Management: Flexible Control',
          description: 'The subscription management system gives customers complete control over their coffee deliveries, with options to pause, modify, or cancel at any time. The admin panel provides analytics on subscription performance and customer retention.',
          alignment: 'right',
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
          title: 'Mobile Ordering: Coffee On The Go',
          description: 'The mobile app allows customers to place orders for pickup, saving time and providing a contactless experience. Integration with the store\'s POS system ensures accurate order fulfillment and inventory management.',
          alignment: 'center',
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.0.3'
        }
      ]
    },
    'video-meeting': {
      title: 'VIDEO MEETING WEB',
      subtitle: 'REAL-TIME CONFERENCING',
      description: 'A browser-based video conferencing application that enables secure, high-quality meetings without requiring downloads or plugins. Built using WebRTC technology, the platform supports real-time video and audio communication, screen sharing, and collaborative features like virtual whiteboards and file sharing.\n\nThe application prioritizes privacy and security, with end-to-end encryption for all communications and strict data protection measures. The interface is designed for ease of use, allowing users to join meetings with a single click while providing advanced features for power users.',
      type: 'design',
      image: 'https://images.unsplash.com/photo-1609921141835-710b7fa6e438?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
      projectItems: [
        {
          title: 'Enterprise-Grade Video Conferencing Solution',
          content: 'This WebRTC-based video conferencing platform delivers high-quality, low-latency communication for businesses and educational institutions. The application supports meetings with up to 100 participants while maintaining excellent video and audio quality through adaptive streaming technology.\n\nThe platform includes features essential for productive remote collaboration, including breakout rooms, polls, hand raising, and meeting recordings. The admin dashboard provides detailed analytics on meeting usage, quality metrics, and user engagement.',
          link: 'https://secure-video-meet.example.com',
          linkText: 'Try Demo'
        }
      ],
      sections: [
        {
          title: 'Collaboration Tools: Beyond Video',
          description: 'The platform includes integrated collaboration tools like virtual whiteboards, document editing, and real-time polls. These features transform video meetings into productive work sessions with tangible outcomes.',
          alignment: 'center',
          image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
          title: 'Security First: Enterprise Protection',
          description: 'Security is paramount in the design, with features like waiting rooms, host controls, and end-to-end encryption. The system complies with industry standards for data protection and privacy regulations.',
          alignment: 'right',
          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
          title: 'Accessibility: Inclusive Design',
          description: 'The application was designed with accessibility as a core principle, including features like live captions, keyboard navigation, and screen reader compatibility. These elements ensure that all users can participate fully in meetings.',
          alignment: 'center',
          image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
          title: 'Takeaway: Optimizing WebRTC for Scale',
          description: 'Developing this platform provided valuable insights into scaling WebRTC applications, managing network conditions, and optimizing media processing for different devices. The project highlighted the importance of performance testing and iterative development for real-time applications.',
          alignment: 'left',
          image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3'
        }
      ]
    }
  };

  const project = projectData[id];
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Link to="/" className="text-blue-500 hover:underline">Return to home</Link>
        </div>
      </div>
    );
  }

  // Get gradient class based on project type
  const getHeaderGradientClass = () => {
    switch(project.type) {
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

  const headerGradientClass = getHeaderGradientClass();

  return (
    <div className="bg-[#15161a] min-h-screen">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-white hover:bg-black/50 transition-colors text-sm"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </Link>
      </div>

      {/* External link button (if available) */}
      {project.externalLink && (
        <div className="fixed top-4 right-4 z-50">
          <a 
            href={project.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-white hover:bg-black/50 transition-colors text-sm"
          >
            <span>Visit Website</span>
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Side navigation */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <div className="bg-black/10 backdrop-blur-sm rounded-full py-4 px-2 border border-white/10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"></div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"></div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"></div>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-8">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[48px] font-semibold text-white mb-4 leading-tight text-shadow-sm"
          >
            {project.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[20px] text-white/70 whitespace-pre-line leading-7 text-shadow-sm"
          >
            {project.description}
          </motion.p>
        </div>
      </div>

      {/* Project showcase */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Blue line above the showcase */}
        <div className="w-full h-[2px] bg-blue-500/20 mb-8"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full h-[720px] rounded-[40px] overflow-hidden relative"
        >
          {/* Background image with overlay */}
          <img 
            src={project.image} 
            alt={project.title} 
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className={`absolute inset-0 z-10 opacity-80 ${headerGradientClass}`}></div>
          
          {/* Content */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-[80px] font-black text-white text-shadow-md">{project.title}</h2>
              <p className="text-[32px] text-white/70 mt-2 font-semibold text-shadow-sm">{project.subtitle}</p>
              
              {project.externalLink && (
                <a 
                  href={project.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 bg-black/30 backdrop-blur-sm px-5 py-2 rounded-full text-white hover:bg-black/50 transition-colors border border-white/10"
                >
                  <span>Visit Live Site</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Control buttons */}
        <div className="mt-6 flex gap-2 justify-center bg-[#15161a]/60 backdrop-blur-sm py-4 px-6 rounded-2xl w-fit mx-auto">
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/80 text-sm border border-white/10 transition-colors">
            Overview
          </button>
          <button className="bg-black/10 hover:bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/60 text-sm border border-white/5 transition-colors">
            Features
          </button>
          <button className="bg-black/10 hover:bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/60 text-sm border border-white/5 transition-colors">
            Gallery
          </button>
        </div>

        {/* Project content */}
        {project.projectItems.length > 0 && (
          <div className="mt-32 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="aspect-[4/3] bg-white/10 rounded-3xl overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              {project.sections && project.sections[0] && (
                <div className="aspect-[4/3] bg-white/10 rounded-3xl mt-8 overflow-hidden">
                  <img 
                    src={project.sections[0].image} 
                    alt={project.sections[0].title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="md:col-span-7">
              <h3 className="text-[48px] font-semibold text-white mb-6 leading-tight text-shadow-sm">{project.projectItems[0].title}</h3>
              <p className="text-[24px] text-white/80 whitespace-pre-line mb-6 leading-8 text-shadow-sm">{project.projectItems[0].content}</p>
              
              {project.projectItems[0].link && (
                <a 
                  href={project.projectItems[0].link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-black/10 hover:bg-black/20 px-4 py-1.5 rounded-full text-white/80 text-sm border border-white/10 transition-colors hover:text-white hover:border-white/20"
                >
                  {project.projectItems[0].linkText}
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Content sections */}
        {project.sections.map((section, index) => (
          <div key={index} className="mt-32">
            <div className={`text-${section.alignment} max-w-4xl mx-auto`}>
              <h3 className="text-[48px] font-semibold text-white mb-6 leading-tight text-shadow-sm">{section.title}</h3>
              <p className="text-[24px] text-white/80 leading-8 text-shadow-sm">{section.description}</p>
            </div>
            
            <div className="mt-16">
              <div className="bg-white/10 border border-white/10 rounded-[40px] h-[866px] w-full overflow-hidden">
                {section.image && (
                  <img 
                    src={section.image} 
                    alt={section.title} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Image grid section */}
        <div className="mt-32 relative">
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="grid grid-cols-3 gap-4 h-full">
              {project.sections && project.sections.slice(0, 9).map((section, i) => (
                <div key={i} className="bg-white/10 rounded-3xl overflow-hidden">
                  {section.image && (
                    <img 
                      src={section.image} 
                      alt={section.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center max-w-4xl mx-auto py-16">
            <h3 className="text-[48px] font-semibold text-white mb-6 leading-tight text-shadow-sm">Project Gallery</h3>
            <p className="text-[24px] text-white/80 leading-8 text-shadow-sm">A collection of images showcasing various aspects of the {project.title} project, highlighting key features and design elements.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 py-8 text-center mt-16 border-t border-white/10">
        <p className="text-white/40 text-sm">{project.title} - Portfolio Project</p>
      </div>
    </div>
  );
};

export default ProjectDetail; 