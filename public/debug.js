// Debug script to check for CSS loading issues
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  
  // Check if Tailwind styles are applied
  const body = document.body;
  const computedStyle = window.getComputedStyle(body);
  console.log('Body background color:', computedStyle.backgroundColor);
  
  // Log all loaded stylesheets
  console.log('Loaded stylesheets:');
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      console.log(`Stylesheet ${i}:`, document.styleSheets[i].href);
    } catch (e) {
      console.log(`Stylesheet ${i}: [CORS blocked]`);
    }
  }
});