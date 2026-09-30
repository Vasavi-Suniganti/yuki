/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        polar: {
          950: '#020810', 900: '#071D33', 800: '#0B2A44', 500: '#19C8E5', 300: '#74D4F5', 100: '#EAF7FF'
        }
      },
      boxShadow: { glow: '0 0 40px rgba(25,200,229,.18)' }
    }
  },
  plugins: []
}
