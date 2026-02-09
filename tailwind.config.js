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
        primary: {
          50: '#FFFEF5',
          100: '#FDF5E6',
          200: '#F5E6CC',
          300: '#E8D5A8',
          400: '#D4B872',
          500: '#C49B3C',
          600: '#A07D2A',
          700: '#7D6122',
          800: '#5A451A',
          900: '#3D2F12',
        },
        accent: {
          50: '#FFFEF5',
          100: '#FDF5E6',
          200: '#F5E6CC',
          300: '#E8D5A8',
          400: '#D4B872',
          500: '#C49B3C',
          600: '#A07D2A',
          700: '#7D6122',
          800: '#5A451A',
          900: '#3D2F12',
        },
        dark: {
          50: '#c1c2c5',
          100: '#a6a7ab',
          200: '#909296',
          300: '#5c5f66',
          400: '#373a40',
          500: '#2c2e33',
          600: '#25262b',
          700: '#1a1b1e',
          800: '#141517',
          900: '#101113',
        },
        muted: 'var(--text-muted)',
        body: 'var(--text-color)',
        heading: 'var(--text-color)',
        "card-border": 'var(--card-border)',
        "glass-border": 'var(--glass-border)',
        "section": 'var(--section-bg)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(196, 155, 60, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(196, 155, 60, 0.6)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(240, 100%, 74%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(320, 100%, 74%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(210, 100%, 70%, 0.3) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
