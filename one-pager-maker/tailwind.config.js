/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        '3/4': '3 / 4',
      },
      colors:{
        'google-white': '#FFFFFF',
        'google-nature': '#F2F2F2',
        'google-black': '#1F1F1F',
        'github-black': '#030303',
        'github-glay': '#444',
      },
    },
  },
  plugins: [],
}

