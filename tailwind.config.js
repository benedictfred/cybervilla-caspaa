/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0A2540",
      },
      fontFamily: {
        figtree: ["Figtree_400Regular", "sans-serif"],
        "figtree-medium": ["Figtree_500Medium", "sans-serif"],
        "figtree-semibold": ["Figtree_600SemiBold", "sans-serif"],
        "figtree-bold": ["Figtree_700Bold", "sans-serif"],
        "figtree-extrabold": ["Figtree_800ExtraBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
