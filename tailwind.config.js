export default {
  content: [
    './src/**/*.{astro,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'subtleBounce': 'subtleBounce 1s infinite',
      },
      keyframes: {
        subtleBounce: {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(150px, 1fr))',
      },
      // add other theme extensions here
      textShadow: {
        'default': '2px 2px 4px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  variants: {},
  plugins: [
    require('tailwindcss-textshadow')
  ],
}