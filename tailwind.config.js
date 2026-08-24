/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F9F5',
          100: '#E1F2E8',
          200: '#C2E5D2',
          300: '#94CFB2',
          400: '#5FB28D',
          500: '#38946E',
          600: '#14513C', // Signature Deep Emerald
          700: '#0E402F',
          800: '#0B3326',
          900: '#07241B',
          950: '#03140F',
        },
        gold: {
          50: '#FDFBF7',
          100: '#FAF4E8',
          200: '#F3E5C8',
          300: '#E9D09C',
          400: '#DDB66B',
          500: '#B98527', // Signature Brass/Gold accent
          600: '#9E6A1B',
          700: '#7B4F15',
          800: '#5D3B14',
          900: '#452A12',
        },
        slateDark: {
          800: '#131C24',
          900: '#0E171E',
          950: '#0A0F14',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        'open-sans': ['"Open Sans"', 'sans-serif'],
        openSans: ['"Open Sans"', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(14, 81, 60, 0.08)',
        'glow': '0 0 20px rgba(185, 133, 39, 0.25)',
      }
    },
  },
  plugins: [],
}
