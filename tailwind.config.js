import scrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        main: 'var(--main)'
      }
    },
  },
  plugins: [
    scrollbar,
  ],
}