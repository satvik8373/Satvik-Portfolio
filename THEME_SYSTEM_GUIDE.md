# Advanced Theme System with Dynamic Contrast Calculation

## Overview

This implementation provides a comprehensive dark/light mode theme system with automatic contrast ratio calculation and accessibility compliance. The system ensures optimal readability across all elements while maintaining design consistency.

## Key Features

### 🎨 **CSS Custom Properties Based**
- All colors defined as CSS custom properties (variables)
- Seamless theme switching without layout shifts
- Consistent color management across components

### 🔍 **Dynamic Contrast Calculation**
- Automatic contrast ratio calculation (WCAG 2.1 AA compliance)
- Real-time contrast validation
- Auto-fix functionality for accessibility issues

### ♿ **Accessibility First**
- WCAG 2.1 AA compliant contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Screen reader announcements for theme changes
- Keyboard navigation support
- Focus indicators with theme-aware colors

### 🎯 **Smart Theme Detection**
- System preference detection
- Local storage persistence
- Automatic theme initialization

### 🔧 **Developer Tools**
- Debug panel for contrast analysis
- Real-time contrast validation
- Color palette preview
- Performance monitoring

## Implementation Details

### CSS Custom Properties Structure

```css
:root {
  /* Background Colors */
  --color-bg-primary: 22, 21, 19;     /* Main background */
  --color-bg-secondary: 42, 42, 42;   /* Card backgrounds */
  --color-bg-tertiary: 34, 34, 34;    /* Header/nav backgrounds */
  --color-bg-footer: 25, 25, 25;      /* Footer background */
  
  /* Text Colors */
  --color-text-primary: 255, 255, 255;   /* Main text */
  --color-text-secondary: 197, 197, 197; /* Secondary text */
  --color-text-muted: 132, 145, 160;     /* Muted text */
  
  /* Accent Colors */
  --color-accent-orange: 255, 134, 96;
  --color-accent-purple: 154, 51, 255;
  --color-accent-blue: 91, 173, 255;
  --color-accent-blue-dark: 19, 115, 209;
  
  /* Border Colors */
  --color-border-primary: 255, 255, 255, 0.1;
  --color-border-secondary: 255, 255, 255, 0.2;
  
  /* Glass Effect Colors */
  --color-glass-bg: 255, 255, 255, 0.05;
  --color-glass-border: 255, 255, 255, 0.1;
  
  /* Theme Transition */
  --theme-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Theme Usage in Components

```jsx
import { useTheme } from '../context/ThemeContext'

const MyComponent = () => {
  const { 
    theme, 
    isDarkMode, 
    toggleTheme, 
    contrastMode,
    validatePageContrast 
  } = useTheme()
  
  return (
    <div className="bg-primary text-primary theme-transition">
      <ThemeToggle showLabel showContrastToggle />
    </div>
  )
}
```

### Utility Classes

```css
/* Theme-aware backgrounds */
.bg-primary { background-color: rgb(var(--color-bg-primary)); }
.bg-secondary { background-color: rgb(var(--color-bg-secondary)); }
.bg-tertiary { background-color: rgb(var(--color-bg-tertiary)); }

/* Theme-aware text colors */
.text-primary { color: rgb(var(--color-text-primary)); }
.text-secondary { color: rgb(var(--color-text-secondary)); }
.text-muted { color: rgb(var(--color-text-muted)); }

/* Theme-aware borders */
.border-primary { border-color: rgba(var(--color-border-primary)); }
.border-secondary { border-color: rgba(var(--color-border-secondary)); }

/* Transitions */
.theme-transition { transition: all var(--theme-transition); }

/* Interactive states */
.hover-bg-secondary:hover { background-color: rgb(var(--color-bg-secondary)); }
.hover-text-primary:hover { color: rgb(var(--color-text-primary)); }
.focus-theme:focus { outline: 2px solid rgb(var(--color-accent-blue)); }
```

## Contrast Calculation Algorithm

### Luminance Calculation
```javascript
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
```

### Contrast Ratio Calculation
```javascript
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(...color1);
  const lum2 = getLuminance(...color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}
```

### Auto-Adjustment Algorithm
```javascript
function adjustColorForContrast(textColor, backgroundColor, targetRatio = 4.5) {
  // Binary search algorithm to find optimal color adjustment
  // Maintains color hue while adjusting brightness
  // Returns color that meets WCAG contrast requirements
}
```

## Theme System API

### ThemeContext Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `toggleTheme()` | Switch between dark/light modes | None |
| `setThemeMode(theme)` | Set specific theme | `'dark' \| 'light'` |
| `toggleContrastMode()` | Cycle through contrast modes | None |
| `validatePageContrast()` | Analyze page contrast issues | None |
| `autoFixContrast()` | Auto-fix contrast problems | None |

### Theme Properties

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `string` | Current theme name |
| `isDarkMode` | `boolean` | Is dark mode active |
| `isLightMode` | `boolean` | Is light mode active |
| `isTransitioning` | `boolean` | Is theme switching |
| `contrastMode` | `string` | Current contrast mode |

### Contrast Modes

- **Normal**: Standard contrast ratios
- **High**: Enhanced contrast (1.5x multiplier)
- **Auto**: Automatic contrast adjustment

## Component Examples

### Basic Theme Toggle
```jsx
<ThemeToggle size="md" />
```

### Advanced Theme Toggle
```jsx
<ThemeToggle 
  size="lg" 
  showLabel={true} 
  showContrastToggle={true} 
/>
```

### Theme-Aware Component
```jsx
const Card = ({ children }) => (
  <div className="bg-secondary border-primary border rounded-lg p-4 theme-transition">
    <div className="text-primary">
      {children}
    </div>
  </div>
)
```

## Performance Considerations

### CSS Custom Properties Benefits
- **No JavaScript required** for color updates
- **Hardware accelerated** transitions
- **Minimal repaints** during theme switches
- **Consistent performance** across devices

### Optimization Techniques
- Debounced contrast calculations
- Cached luminance values
- Efficient DOM queries
- Minimal re-renders

## Browser Support

- **Modern browsers**: Full support with CSS custom properties
- **Legacy browsers**: Graceful degradation to default theme
- **Accessibility tools**: Full compatibility with screen readers

## Development Tools

### Debug Panel Features
- Real-time contrast analysis
- Color palette preview
- Accessibility issue detection
- Performance metrics
- Auto-fix suggestions

### Usage
```jsx
// Only shown in development
{process.env.NODE_ENV === 'development' && <ThemeDebugPanel />}
```

## Best Practices

### Color Definition
```css
/* ✅ Good: Use RGB values for flexibility */
--color-primary: 255, 255, 255;

/* ❌ Avoid: Hex values limit alpha channel usage */
--color-primary: #ffffff;
```

### Component Implementation
```jsx
// ✅ Good: Use utility classes
<div className="bg-primary text-primary theme-transition">

// ❌ Avoid: Inline styles for theme colors
<div style={{ backgroundColor: '#161513' }}>
```

### Accessibility
```jsx
// ✅ Good: Include focus indicators
<button className="focus-theme">

// ✅ Good: Announce theme changes
const announcement = `Switched to ${isDarkMode ? 'light' : 'dark'} mode`;
```

## Testing

### Contrast Validation
```javascript
// Test contrast ratios
const validation = validateContrast(element);
console.log(`Contrast ratio: ${validation.ratio}`);
console.log(`Passes WCAG: ${validation.passes}`);
```

### Theme Switching
```javascript
// Test theme persistence
toggleTheme();
expect(localStorage.getItem('preferred-theme')).toBe('light');
```

## Migration Guide

### From Existing Theme System
1. Replace hardcoded colors with CSS custom properties
2. Update component classes to use utility classes
3. Add theme context to component tree
4. Test contrast ratios and adjust as needed

### Gradual Implementation
1. Start with core components (Header, Footer)
2. Add theme toggle functionality
3. Implement contrast validation
4. Extend to all components
5. Add debug tools and optimization

This theme system provides a robust foundation for accessible, performant, and maintainable dark/light mode implementation with automatic contrast optimization.