import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#fafafa',
          100: '#0f0f0f',
          200: '#1c1c1c',
          300: '#262626',
          400: '#404040',
          500: '#737373',
          600: '#a3a3a3',
          700: '#e5e5e5',
          800: '#f5f5f5',
          900: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: '#e5e5e5',
        dark: '#262626',
      },
    },
  },
  plugins: [],
}
export default config
