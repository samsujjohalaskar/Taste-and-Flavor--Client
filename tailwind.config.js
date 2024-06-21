/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        theme: "#FF5757",
        hover: "#fc0404",
        text: "#5c5757",
        border: "#bcbcbc",
        bg: "#f3f3f3",
        discount: "#54BD8A",
      },
      boxShadow: {
        cities: "0 4px 8px rgba(0, 0, 0, 0.1)",
        offers: "4px 8px 8px 0 rgba(0, 0, 0, 0.25)",
        restaurant: "0px 0px 10px 0px rgba(0, 0, 0, 0.2)",
      },
      scale: {
        101: "1.01",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};
