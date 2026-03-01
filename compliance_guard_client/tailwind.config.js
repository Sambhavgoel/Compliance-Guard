/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This scans all your React files
  ],
  theme: {
    extend: {
      colors: {
        // Adding a custom "Brand" color makes your resume project look more "SaaS"
        brand: {
          dark: "#0f172a", // Slate-900
          primary: "#2563eb", // Blue-600
        }
      }
    },
  },
  plugins: [],
}