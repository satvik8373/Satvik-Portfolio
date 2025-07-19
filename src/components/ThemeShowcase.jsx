import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const ThemeShowcase = () => {
  const { theme, contrastMode, validatePageContrast } = useTheme();

  const showcaseItems = [
    {
      title: 'Primary Text',
      className: 'text-primary',
      description: 'Main content text with optimal contrast'
    },
    {
      title: 'Secondary Text',
      className: 'text-secondary',
      description: 'Supporting text with good readability'
    },
    {
      title: 'Muted Text',
      className: 'text-muted',
      description: 'Less prominent text for subtle information'
    },
    {
      title: 'Primary Background',
      className: 'bg-primary text-primary p-4 rounded',
      description: 'Main background color'
    },
    {
      title: 'Secondary Background',
      className: 'bg-secondary text-primary p-4 rounded',
      description: 'Card and component backgrounds'
    },
    {
      title: 'Tertiary Background',
      className: 'bg-tertiary text-primary p-4 rounded',
      description: 'Header and navigation backgrounds'
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">
            Advanced Theme System
          </h2>
          <p className="text-secondary text-lg mb-8">
            Responsive design with automatic contrast calculation and accessibility compliance
          </p>
          
          {/* Theme Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <ThemeToggle size="lg" showLabel />
            <ThemeToggle size="md" showContrastToggle />
            <div className="px-4 py-2 bg-secondary rounded-lg">
              <span className="text-primary font-medium">
                Current: {theme} mode, {contrastMode} contrast
              </span>
            </div>
          </div>
        </motion.div>

        {/* Color Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-primary border rounded-lg p-6 theme-transition hover-bg-secondary"
            >
              <h3 className="text-primary font-semibold mb-2">{item.title}</h3>
              <div className={`${item.className} mb-3`}>
                Sample text content
              </div>
              <p className="text-muted text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-secondary rounded-lg p-8 border-primary border"
        >
          <h3 className="text-primary font-semibold text-xl mb-6">Interactive Elements</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons */}
            <div>
              <h4 className="text-primary font-medium mb-4">Buttons</h4>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-accent-blue text-white rounded hover:bg-accent-blue-dark theme-transition focus-theme">
                  Primary Button
                </button>
                <button className="w-full px-4 py-2 border-primary border text-primary rounded hover-bg-tertiary theme-transition focus-theme">
                  Secondary Button
                </button>
                <button className="w-full px-4 py-2 bg-gradient-orange-purple text-white rounded theme-transition focus-theme">
                  Gradient Button
                </button>
              </div>
            </div>

            {/* Form Elements */}
            <div>
              <h4 className="text-primary font-medium mb-4">Form Elements</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Text input"
                  className="w-full px-3 py-2 bg-tertiary border-primary border rounded text-primary placeholder-text-muted focus-theme theme-transition"
                />
                <select className="w-full px-3 py-2 bg-tertiary border-primary border rounded text-primary focus-theme theme-transition">
                  <option>Select option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <textarea
                  placeholder="Textarea"
                  rows="3"
                  className="w-full px-3 py-2 bg-tertiary border-primary border rounded text-primary placeholder-text-muted focus-theme theme-transition resize-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Accessibility Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8 bg-tertiary rounded-lg p-6 border-primary border"
        >
          <h3 className="text-primary font-semibold text-lg mb-4">Accessibility Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-secondary">
              ✅ WCAG 2.1 AA compliant contrast ratios<br/>
              ✅ Automatic contrast calculation<br/>
              ✅ Screen reader announcements<br/>
              ✅ Keyboard navigation support
            </div>
            <div className="text-secondary">
              ✅ System preference detection<br/>
              ✅ Local storage persistence<br/>
              ✅ Smooth theme transitions<br/>
              ✅ Focus indicators
            </div>
          </div>
          
          <button
            onClick={() => {
              const issues = validatePageContrast();
              alert(`Found ${issues.length} contrast issues. Check console for details.`);
              console.log('Contrast issues:', issues);
            }}
            className="mt-4 px-4 py-2 bg-accent-orange text-white rounded hover:bg-accent-purple theme-transition focus-theme"
          >
            Validate Page Contrast
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ThemeShowcase;