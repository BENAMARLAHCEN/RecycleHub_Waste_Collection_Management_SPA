/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#A7F3D0",
          DEFAULT: "#16A34A",
          dark: "#065F46"
        },
        secondary: {
          light: "#FDE68A",
          DEFAULT: "#F59E0B",
          dark: "#B45309"
        },
        neutral: {
          light: "#F3F4F6",
          DEFAULT: "#6B7280",
          dark: "#1F2937"
        },
        danger: "#EF4444",
        success: "#10B981",
        warning: "#FBBF24",
      },
    },
  },
  plugins: [],
};
