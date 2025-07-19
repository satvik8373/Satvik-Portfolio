/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        // Theme-aware colors using CSS custom properties
        primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        tertiary: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
        footer: 'rgb(var(--color-bg-footer) / <alpha-value>)',
        
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        
        'accent-orange': 'rgb(var(--color-accent-orange) / <alpha-value>)',
        'accent-purple': 'rgb(var(--color-accent-purple) / <alpha-value>)',
        'accent-blue': 'rgb(var(--color-accent-blue) / <alpha-value>)',
        'accent-blue-dark': 'rgb(var(--color-accent-blue-dark) / <alpha-value>)',
        
        'border-primary': 'rgba(var(--color-border-primary))',
        'border-secondary': 'rgba(var(--color-border-secondary))',
        
        // Legacy colors for backward compatibility
        'primary-bg': 'rgb(var(--color-bg-primary))',
        'primary-card': 'rgb(var(--color-bg-secondary))',
        'primary-header': 'rgb(var(--color-bg-tertiary))',
        'primary-footer': 'rgb(var(--color-bg-footer))',
        
        'gradient-orange': 'rgb(var(--color-accent-orange))',
        'gradient-purple': 'rgb(var(--color-accent-purple))',
        'gradient-blue': 'rgb(var(--color-accent-blue))',
        'gradient-darkblue': 'rgb(var(--color-accent-blue-dark))',
      },
      backgroundImage: {
        'gradient-orange-purple': 'linear-gradient(135deg, rgb(var(--color-accent-orange)) 0%, rgb(var(--color-accent-purple)) 100%)',
        'gradient-blue': 'linear-gradient(180deg, rgb(var(--color-accent-blue)) 0%, rgb(var(--color-accent-blue-dark)) 100%)',
        'gradient-orange-red': 'linear-gradient(180deg, rgb(var(--color-accent-orange)) 0%, #d5491d 100%)',
        'avatar-gradient': 'linear-gradient(135deg, rgb(var(--color-accent-orange)) 0%, rgb(var(--color-accent-purple)) 98.96%)',
      },
      letterSpacing: {
        'widest': '0.2em',
        'wider': '0.1em',
      },
      transitionDuration: {
        'theme': '300ms',
      },
      animation: {
        'theme-transition': 'theme-transition 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'theme-transition': {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // Custom plugin for theme utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.theme-transition': {
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.bg-primary': {
          backgroundColor: 'rgb(var(--color-bg-primary))',
        },
        '.bg-secondary': {
          backgroundColor: 'rgb(var(--color-bg-secondary))',
        },
        '.bg-tertiary': {
          backgroundColor: 'rgb(var(--color-bg-tertiary))',
        },
        '.text-primary': {
          color: 'rgb(var(--color-text-primary))',
        },
        '.text-secondary': {
          color: 'rgb(var(--color-text-secondary))',
        },
        '.text-muted': {
          color: 'rgb(var(--color-text-muted))',
        },
        '.border-primary': {
          borderColor: 'rgba(var(--color-border-primary))',
        },
        '.border-secondary': {
          borderColor: 'rgba(var(--color-border-secondary))',
        },
        '.hover-bg-secondary:hover': {
          backgroundColor: 'rgb(var(--color-bg-secondary))',
        },
        '.hover-text-primary:hover': {
          color: 'rgb(var(--color-text-primary))',
        },
        '.focus-theme:focus': {
          outline: '2px solid rgb(var(--color-accent-blue))',
          outlineOffset: '2px',
        },
      };
      addUtilities(newUtilities);
    },
  ],
}