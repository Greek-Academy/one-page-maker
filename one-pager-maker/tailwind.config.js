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
    },
  },
  plugins: [],
}

