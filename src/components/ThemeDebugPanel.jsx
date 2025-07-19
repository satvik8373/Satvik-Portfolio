import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeDebugPanel = () => {
  const { 
    theme, 
    contrastMode, 
    toggleContrastMode, 
    validatePageContrast, 
    autoFixContrast 
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [contrastIssues, setContrastIssues] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeContrast = async () => {
    setIsAnalyzing(true);
    // Small delay to show loading state
    setTimeout(() => {
      const issues = validatePageContrast();
      setContrastIssues(issues);
      setIsAnalyzing(false);
    }, 500);
  };

  const fixContrast = () => {
    const remainingIssues = autoFixContrast();
    setContrastIssues(remainingIssues);
  };

  useEffect(() => {
    if (isOpen) {
      analyzeContrast();
    }
  }, [isOpen, theme]);

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-secondary border-primary border-2 text-primary hover-bg-tertiary theme-transition focus-theme shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle theme debug panel"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto"
        >
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6"/>
          <path d="m21 12-6 0m-6 0-6 0"/>
          <path d="m16.24 7.76-4.24 4.24m-4.24 0L3.52 7.76"/>
          <path d="m16.24 16.24-4.24-4.24m-4.24 0L3.52 16.24"/>
        </svg>
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 w-80 max-h-96 bg-secondary border-primary border rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="bg-tertiary p-4 border-b border-primary">
              <div className="flex items-center justify-between">
                <h3 className="text-primary font-semibold">Theme Debug</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-secondary hover-text-primary theme-transition"
                  aria-label="Close debug panel"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
              {/* Theme Info */}
              <div>
                <h4 className="text-primary font-medium mb-2">Current Theme</h4>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-tertiary text-secondary rounded text-sm">
                    {theme}
                  </span>
                  <span className="px-2 py-1 bg-tertiary text-secondary rounded text-sm">
                    Contrast: {contrastMode}
                  </span>
                </div>
              </div>

              {/* Contrast Mode Toggle */}
              <div>
                <button
                  onClick={toggleContrastMode}
                  className="w-full px-3 py-2 bg-tertiary hover-bg-secondary text-primary rounded theme-transition focus-theme"
                >
                  Toggle Contrast Mode
                </button>
              </div>

              {/* Contrast Analysis */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-primary font-medium">Contrast Analysis</h4>
                  <button
                    onClick={analyzeContrast}
                    disabled={isAnalyzing}
                    className="px-2 py-1 bg-accent-blue text-white rounded text-sm hover:bg-accent-blue-dark theme-transition disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>

                {contrastIssues.length === 0 && !isAnalyzing && (
                  <p className="text-secondary text-sm">
                    ✅ No contrast issues found
                  </p>
                )}

                {contrastIssues.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-secondary text-sm">
                        ⚠️ {contrastIssues.length} issues found
                      </p>
                      <button
                        onClick={fixContrast}
                        className="px-2 py-1 bg-accent-orange text-white rounded text-sm hover:bg-accent-purple theme-transition"
                      >
                        Auto Fix
                      </button>
                    </div>
                    
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {contrastIssues.slice(0, 5).map((issue, index) => (
                        <div key={index} className="text-xs text-muted bg-tertiary p-2 rounded">
                          <div className="font-medium">{issue.element}</div>
                          <div>Ratio: {issue.ratio} (needs {issue.required})</div>
                          <div className="truncate">{issue.text}</div>
                        </div>
                      ))}
                      {contrastIssues.length > 5 && (
                        <div className="text-xs text-muted text-center">
                          +{contrastIssues.length - 5} more issues
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-secondary text-sm">
                    <motion.div
                      className="w-4 h-4 border-2 border-accent-blue border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Analyzing contrast ratios...
                  </div>
                )}
              </div>

              {/* Color Palette Preview */}
              <div>
                <h4 className="text-primary font-medium mb-2">Color Palette</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'Primary', var: '--color-bg-primary' },
                    { name: 'Secondary', var: '--color-bg-secondary' },
                    { name: 'Text', var: '--color-text-primary' },
                    { name: 'Accent', var: '--color-accent-blue' },
                  ].map((color) => (
                    <div key={color.name} className="text-center">
                      <div
                        className="w-full h-8 rounded border border-primary mb-1"
                        style={{ backgroundColor: `rgb(var(${color.var}))` }}
                      />
                      <span className="text-xs text-muted">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeDebugPanel;