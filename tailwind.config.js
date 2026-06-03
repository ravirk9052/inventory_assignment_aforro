/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#17202A',
        line: '#E7EAEE',
        mist: '#F6F8FA',
        brand: '#2F6BFF',
      },
      boxShadow: {
        soft: '0 14px 40px rgba(28, 39, 60, 0.08)',
      },
    },
  },
  plugins: [],
};
