/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,scss}'],
  jit: true,
  theme: {
    extend: {
      spacing: {
        5.5: '1.375rem',
      },
    },
  },
};
