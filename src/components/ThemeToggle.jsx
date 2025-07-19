import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ 
  size = 'md', 
  showLabel = false, 
  showContrastToggle = false,
  className = '' 
}) => {
  const { 
    theme, 
    isDarkMode, 
    isTransitioning, 
    contrastMode,
    toggleTheme, 
    toggleContrastMode 
  } = useTheme();
  
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  };

  const handleToggle = () => {
    toggleTheme();
    // Announce theme change for screen readers
    const announcement = `Switched to ${isDarkMode ? 'light' : 'dark'} mode`;
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.className = 'sr-only';
    ariaLive.textContent = announcement;
    document.body.appendChild(ariaLive);
    setTimeout(() => document.body.removeChild(ariaLive), 1000);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Main Theme Toggle */}
      <div className="relative">
        <motion.button
          onClick={handleToggle}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`
            ${sizeClasses[size]} 
            rounded-full relative overflow-hidden backdrop-blur-md border
            bg-secondary border-primary hover-bg-secondary
            focus-theme theme-transition
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isTransitioning}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          aria-pressed={isDarkMode}
          role="switch"
        >
          {/* Background gradient animation */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgb(42, 42, 42) 0%, rgb(34, 34, 34) 100%)'
                : 'linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)'
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Icon container */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {/* Sun Icon */}
            <motion.div
              className="absolute"
              animate={{
                scale: isDarkMode ? 0 : 1,
                rotate: isDarkMode ? 180 : 0,
                opacity: isDarkMode ? 0 : 1
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <svg
                width={iconSizes[size]}
                height={iconSizes[size]}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary drop-shadow-sm"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            </motion.div>
            
            {/* Moon Icon */}
            <motion.div
              className="absolute"
              animate={{
                scale: isDarkMode ? 1 : 0,
                rotate: isDarkMode ? 0 : -180,
                opacity: isDarkMode ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <svg
                width={iconSizes[size]}
                height={iconSizes[size]}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary drop-shadow-sm"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </motion.div>
            
            {/* Loading spinner during transition */}
            <AnimatePresence>
              {isTransitioning && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Ripple effect on click */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, transparent 70%)'
            }}
          />
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-secondary border-primary border rounded-lg px-3 py-1 text-sm text-primary whitespace-nowrap shadow-lg">
                Switch to {isDarkMode ? 'light' : 'dark'} mode
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Theme Label */}
      {showLabel && (
        <motion.span 
          className="text-sm font-medium text-secondary theme-transition"
          animate={{ opacity: isTransitioning ? 0.5 : 1 }}
        >
          {theme === 'dark' ? 'Dark' : 'Light'} Mode
        </motion.span>
      )}

      {/* Contrast Mode Toggle */}
      {showContrastToggle && (
        <motion.button
          onClick={toggleContrastMode}
          className="text-xs px-2 py-1 rounded bg-tertiary text-secondary hover-bg-secondary theme-transition focus-theme"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Contrast mode: ${contrastMode}`}
        >
          {contrastMode === 'normal' && 'A'}
          {contrastMode === 'high' && 'A+'}
          {contrastMode === 'auto' && 'A*'}
        </motion.button>
      )}
    </div>
  );
};

export default ThemeToggle;