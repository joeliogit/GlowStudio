/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF0F5',
          100: '#FFD6E8',
          200: '#FFB6C1',
          300: '#FF8DAA',
          400: '#FF6B9D',
          500: '#E91E8C',
          600: '#C4177A',
          700: '#9E1062',
          800: '#780A4A',
          900: '#520633',
        },
        primary: '#E91E8C',
        'primary-light': '#FFB6C1',
        'primary-pale': '#FFF0F5',
        secondary: '#FFB6C1',
        cream: '#FFF8FC',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      boxShadow: {
        glow: '0 0 20px rgba(233, 30, 140, 0.15)',
        'glow-lg': '0 0 40px rgba(233, 30, 140, 0.2)',
        card: '0 4px 24px rgba(233, 30, 140, 0.08)',
        'card-hover': '0 8px 40px rgba(233, 30, 140, 0.16)',
        'card-purple': '0 4px 24px rgba(109, 40, 217, 0.08)',
        'card-purple-hover': '0 8px 40px rgba(109, 40, 217, 0.16)',
        'glow-purple': '0 0 20px rgba(109, 40, 217, 0.18)',
        'card-blue': '0 4px 24px rgba(29, 78, 216, 0.08)',
        'card-blue-hover': '0 8px 40px rgba(29, 78, 216, 0.16)',
        'glow-blue': '0 0 20px rgba(29, 78, 216, 0.18)',
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #E91E8C 0%, #FFB6C1 100%)',
        'gradient-pale': 'linear-gradient(135deg, #FFF0F5 0%, #FFFFFF 100%)',
        'gradient-hero': 'linear-gradient(135deg, #FFF0F5 0%, #FFD6E8 50%, #FFB6C1 100%)',
        'gradient-hero-purple': 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7C3AED 0%, #C4B5FD 100%)',
        'gradient-hero-blue': 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
        'gradient-blue': 'linear-gradient(135deg, #1D4ED8 0%, #93C5FD 100%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
