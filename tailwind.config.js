/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#06030e',
          900: '#0c081d',
          800: '#140c2e',
        },
        twilight: {
          900: '#1c1135',
          800: '#2a164d',
          700: '#3a1f6a',
        },
        sunset: {
          purple: '#5e1c66',
          magenta: '#9b287b',
          rose: '#e05368',
        },
        amber: {
          gold: '#ff934f',
          sun: '#ffc857',
          pale: '#ffe1a0',
        },
        plasma: {
          cyan: '#38bdf8',
          ice: '#a5f3fc',
        }
      },
      fontFamily: {
        display: ['"Creato Display"', 'sans-serif'],
        sans: ['"Isidora Sans"', 'sans-serif'],
        accent: ['"Oceanwide"', 'sans-serif'],
        mono: ['"Babel Sans"', 'sans-serif'],
      },
      letterSpacing: {
        monumental: '0.3em',
      }
    },
  },
  plugins: [],
}
