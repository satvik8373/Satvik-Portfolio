import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initializeTheme, 
  toggleTheme as toggleThemeUtil, 
  getCurrentTheme,
  applyTheme,
  validateContrast,
  autoFixContrast
} from '../utils/themeUtils';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contrastMode, setContrastMode] = useState('normal'); // normal, high, auto

  useEffect(() => {
    // Initialize theme system
    initializeTheme();
    setTheme(getCurrentTheme());

    // Listen for theme changes
    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    setIsTransitioning(true);
    const newTheme = toggleThemeUtil();
    setTheme(newTheme);
    
    // Auto-fix contrast if in auto mode
    if (contrastMode === 'auto') {
      setTimeout(() => {
        autoFixContrast();
      }, 100);
    }
    
    // Reset transition state
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const setThemeMode = (themeName) => {
    if (themeName !== theme) {
      setIsTransitioning(true);
      applyTheme(themeName);
      setTheme(themeName);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  const toggleContrastMode = () => {
    const modes = ['normal', 'high', 'auto'];
    const currentIndex = modes.indexOf(contrastMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setContrastMode(nextMode);
    
    // Apply contrast adjustments
    const root = document.documentElement;
    switch (nextMode) {
      case 'high':
        root.style.setProperty('--contrast-multiplier', '1.5');
        break;
      case 'auto':
        root.style.setProperty('--contrast-multiplier', '1.2');
        autoFixContrast();
        break;
      default:
        root.style.setProperty('--contrast-multiplier', '1');
    }
  };

  const validatePageContrast = () => {
    const results = [];
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, input, textarea');
    
    elements.forEach((element, index) => {
      const validation = validateContrast(element);
      if (!validation.passes) {
        results.push({
          element: element.tagName.toLowerCase(),
          index,
          ratio: validation.ratio.toFixed(2),
          required: validation.requiredRatio,
          text: element.textContent?.substring(0, 50) + '...'
        });
      }
    });
    
    return results;
  };

  const value = {
    theme,
    isDarkMode: theme === 'dark',
    isLightMode: theme === 'light',
    isTransitioning,
    contrastMode,
    toggleTheme,
    setThemeMode,
    toggleContrastMode,
    validatePageContrast,
    autoFixContrast: () => {
      autoFixContrast();
      return validatePageContrast();
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};