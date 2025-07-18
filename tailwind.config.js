/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          bg: '#161513',
          card: '#2a2a2a',
          header: '#222222',
          footer: '#191919',
        },
        text: {
          primary: '#ffffff',
          secondary: '#c5c5c5',
          muted: '#8491a0',
        },
        gradient: {
          orange: '#ff8660',
          purple: '#9a33ff',
          blue: '#5badff',
          darkblue: '#1373d1',
        }
      },
      backgroundImage: {
        'gradient-orange-purple': 'linear-gradient(135deg, #ff8660 0%, #9a33ff 100%)',
        'gradient-blue': 'linear-gradient(180deg, #5badff 0%, #1373d1 100%)',
        'gradient-orange-red': 'linear-gradient(180deg, #ff8660 0%, #d5491d 100%)',
        'avatar-gradient': 'linear-gradient(135deg, #ff8660 0%, #8000ff 98.96%)',
      },
      letterSpacing: {
        'widest': '0.2em',
        'wider': '0.1em',
      }
    },
  },
  plugins: [],
}