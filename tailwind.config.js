/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,scss}'],
  jit: true,
  theme: {
    fontFamily: {
      sans: ['"Open Sans", sans-serif'],
    },
    extend: {
      spacing: {
        5.5: '1.375rem',
      },
    },
  },
};
