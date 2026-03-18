/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        'cream-dark': '#EDE5D5',
        blue: {
          dusty: '#4A6B8A',
          'dusty-light': '#6B8FAD',
          'dusty-dark': '#3A5570',
        },
        choco: {
          DEFAULT: '#5C3D2E',
          light: '#7A5240',
          dark: '#3E2920',
        },
        blush: {
          DEFAULT: '#E8C4B8',
          light: '#F2D8CE',
          dark: '#D4A898',
        },
        gold: {
          DEFAULT: '#C9A96E',
          light: '#DFC18A',
          dark: '#B08A50',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
