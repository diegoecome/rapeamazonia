/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0B120D',
          900: '#101B12',
          800: '#182A1B',
          700: '#213A26',
          600: '#2E4E34',
        },
        moss: {
          500: '#4B6B44',
          400: '#6C8A5F',
        },
        wood: {
          900: '#2A1D14',
          700: '#4A3324',
          500: '#6B4A32',
        },
        sand: {
          100: '#F1E9D6',
          200: '#E8DFC8',
          300: '#D8C9A6',
        },
        gold: {
          400: '#D8AE5C',
          500: '#C9922C',
          600: '#A8741F',
        },
        clay: {
          500: '#A85D3B',
          600: '#8C4A2E',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-manrope)', 'sans-serif'],
        mono: ['var(--font-plex)', 'monospace'],
      },
      backgroundImage: {
        grain: "url('/textures/grain.svg')",
      },
      boxShadow: {
        lift: '0 20px 60px -20px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
