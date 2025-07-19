/**
 * Theme Utility Functions with Dynamic Contrast Calculation
 * Ensures optimal contrast ratios for accessibility (WCAG 2.1 AA compliance)
 */

// Convert RGB to relative luminance
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(...color1);
  const lum2 = getLuminance(...color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

// Convert RGB to hex
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Adjust color brightness to meet contrast requirements
function adjustColorForContrast(textColor, backgroundColor, targetRatio = 4.5) {
  let [r, g, b] = textColor;
  const bgLum = getLuminance(...backgroundColor);
  
  // Determine if we need to make text lighter or darker
  const textLum = getLuminance(r, g, b);
  const currentRatio = getContrastRatio(textColor, backgroundColor);
  
  if (currentRatio >= targetRatio) {
    return textColor; // Already meets requirements
  }
  
  // Binary search for optimal brightness
  let low = 0, high = 255;
  let bestColor = textColor;
  let bestRatio = currentRatio;
  
  for (let i = 0; i < 20; i++) { // Max 20 iterations
    const mid = Math.floor((low + high) / 2);
    const factor = mid / 255;
    
    // Adjust brightness while maintaining color hue
    const adjustedColor = textLum < bgLum 
      ? [Math.min(255, r + (255 - r) * factor), Math.min(255, g + (255 - g) * factor), Math.min(255, b + (255 - b) * factor)]
      : [Math.max(0, r * (1 - factor)), Math.max(0, g * (1 - factor)), Math.max(0, b * (1 - factor))];
    
    const ratio = getContrastRatio(adjustedColor, backgroundColor);
    
    if (ratio >= targetRatio) {
      bestColor = adjustedColor;
      bestRatio = ratio;
      if (textLum < bgLum) {
        high = mid;
      } else {
        low = mid;
      }
    } else {
      if (textLum < bgLum) {
        low = mid;
      } else {
        high = mid;
      }
    }
  }
  
  return bestColor;
}

// Theme configuration
const themes = {
  dark: {
    name: 'dark',
    colors: {
      bgPrimary: [22, 21, 19],
      bgSecondary: [42, 42, 42],
      bgTertiary: [34, 34, 34],
      bgFooter: [25, 25, 25],
      textPrimary: [255, 255, 255],
      textSecondary: [197, 197, 197],
      textMuted: [132, 145, 160],
      accentOrange: [255, 134, 96],
      accentPurple: [154, 51, 255],
      accentBlue: [91, 173, 255],
      accentBlueDark: [19, 115, 209],
    }
  },
  light: {
    name: 'light',
    colors: {
      bgPrimary: [255, 255, 255],
      bgSecondary: [248, 250, 252],
      bgTertiary: [241, 245, 249],
      bgFooter: [248, 250, 252],
      textPrimary: [15, 23, 42],
      textSecondary: [51, 65, 85],
      textMuted: [100, 116, 139],
      accentOrange: [255, 134, 96],
      accentPurple: [154, 51, 255],
      accentBlue: [91, 173, 255],
      accentBlueDark: [19, 115, 209],
    }
  }
};

// Apply theme with contrast optimization
function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  
  const root = document.documentElement;
  root.setAttribute('data-theme', themeName);
  
  // Apply base colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, value.join(', '));
  });
  
  // Optimize text colors for contrast
  optimizeTextContrast(theme);
  
  // Store theme preference
  localStorage.setItem('preferred-theme', themeName);
  
  // Dispatch theme change event
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }));
}

// Optimize text contrast across all elements
function optimizeTextContrast(theme) {
  const root = document.documentElement;
  
  // Optimize primary text on primary background
  const optimizedPrimary = adjustColorForContrast(
    theme.colors.textPrimary,
    theme.colors.bgPrimary,
    4.5
  );
  root.style.setProperty('--color-text-primary-optimized', optimizedPrimary.join(', '));
  
  // Optimize secondary text on primary background
  const optimizedSecondary = adjustColorForContrast(
    theme.colors.textSecondary,
    theme.colors.bgPrimary,
    4.5
  );
  root.style.setProperty('--color-text-secondary-optimized', optimizedSecondary.join(', '));
  
  // Optimize muted text on primary background
  const optimizedMuted = adjustColorForContrast(
    theme.colors.textMuted,
    theme.colors.bgPrimary,
    3.0 // Lower requirement for muted text
  );
  root.style.setProperty('--color-text-muted-optimized', optimizedMuted.join(', '));
}

// Get current theme
function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

// Toggle between themes
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  return newTheme;
}

// Initialize theme system
function initializeTheme() {
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('preferred-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  applyTheme(initialTheme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('preferred-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Validate contrast ratio for accessibility
function validateContrast(element) {
  const computedStyle = window.getComputedStyle(element);
  const textColor = computedStyle.color;
  const backgroundColor = computedStyle.backgroundColor;
  
  // Convert CSS colors to RGB arrays (simplified)
  const textRgb = textColor.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const bgRgb = backgroundColor.match(/\d+/g)?.map(Number) || [255, 255, 255];
  
  const ratio = getContrastRatio(textRgb, bgRgb);
  const fontSize = parseFloat(computedStyle.fontSize);
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && computedStyle.fontWeight >= 700);
  
  const requiredRatio = isLargeText ? 3.0 : 4.5;
  
  return {
    ratio,
    requiredRatio,
    passes: ratio >= requiredRatio,
    isLargeText
  };
}

// Auto-fix contrast issues
function autoFixContrast() {
  const elements = document.querySelectorAll('*');
  elements.forEach(element => {
    const validation = validateContrast(element);
    if (!validation.passes) {
      const computedStyle = window.getComputedStyle(element);
      const textRgb = computedStyle.color.match(/\d+/g)?.map(Number) || [0, 0, 0];
      const bgRgb = computedStyle.backgroundColor.match(/\d+/g)?.map(Number) || [255, 255, 255];
      
      const adjustedColor = adjustColorForContrast(textRgb, bgRgb, validation.requiredRatio);
      element.style.color = `rgb(${adjustedColor.join(', ')})`;
    }
  });
}

export {
  applyTheme,
  toggleTheme,
  getCurrentTheme,
  initializeTheme,
  validateContrast,
  autoFixContrast,
  getContrastRatio,
  adjustColorForContrast,
  themes
};