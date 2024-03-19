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
      textShadow: {
        'default': '2px 2px 4px rgba(0, 0, 0, 0.5)',
      },
      scrollbar: (theme) => ({
        DEFAULT: {
          '&-thumb': {
            backgroundColor: theme('colors.gray.400'), // Adjust thumb color
            borderRadius: '9999px', // Fully rounded corners for the thumb
            borderWidth: '2px',
            borderColor: 'transparent', // Adjust thumb border color if needed
            "&:hover": {
              backgroundColor: theme('colors.gray.500'), // Adjust thumb color on hover
            },
          },
          '&-track': {
            backgroundColor: theme('colors.gray.100'), // Adjust track color
            borderRadius: '9999px', // Fully rounded corners for the track
          },
        },
      }),
    },
  },
  variants: {
    scrollbar: ['rounded'],
  },
  plugins: [
    require('tailwindcss-textshadow'),
    require('tailwind-scrollbar'), // Ensure this plugin is installed via npm or yarn
  ],
}
