/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  corePlugins: {
    // Disable preflight to avoid conflicts with Chakra UI
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f5f0',
          100: '#efece3',
          200: '#d9d5c7',
          300: '#bfb8a5',
          400: '#a39881',
          500: '#8f8269',
          600: '#7d705a',
          700: '#6a5e4d',
          800: '#5a5042',
          900: '#4d4438',
        },
        accent: {
          50: '#fef7ee',
          100: '#fdedd5',
          200: '#fad5a5',
          300: '#f6b96e',
          400: '#f29533',
          500: '#ee7712',
          600: '#de5d0a',
          700: '#b9460a',
          800: '#953a0e',
          900: '#78310e',
        },
        luxury: {
          gold: '#D4AF37',
          champagne: '#F7E7CE',
          bronze: '#CD7F32',
          charcoal: '#36454F',
          cream: '#FFFDD0',
          navy: '#1B2631',
          emerald: '#046307',
        },
        modern: {
          dark: '#0F172A',
          light: '#F8FAFC',
          gray: '#64748B',
          slate: '#1E293B',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 50%, rgba(51,65,85,0.7) 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(212, 175, 55, 0.3)',
        'glow-lg': '0 0 60px rgba(212, 175, 55, 0.4)',
        'elegant': '0 20px 60px rgba(0,0,0,0.15)',
        'floating': '0 25px 80px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
