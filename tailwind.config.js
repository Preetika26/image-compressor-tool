/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // premium royal purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        darkbg: {
          50: '#1e1b4b',
          100: '#111827',
          200: '#0f172a',
          300: '#030712', // super sleek pitch-black base
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(4px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.97)' },
          to: { opacity: 1, transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
