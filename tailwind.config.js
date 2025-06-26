/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black': '#000000', // Base color, gives strength and elegance
        'yellow': '#FFD700', // Main vibrant and energetic accent color
        'dark-gray': '#2E2E2E', // For intermediate tones, softens contrast
        'white': '#F5F5F5', // For empty spaces or light typography
        'mustard': '#D4AF37', // A more subdued yellow variation
        'steel-gray': '#7A7A7A', // Versatile complement for texture
      },
      transitionProperty: {
        'all': 'all',
      },
      transitionDuration: {
        'fast': '200ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      transitionTimingFunction: {
        'default': 'ease',
      },
    },
  },
  plugins: [],
}
