export default defineNuxtConfig({
  modules: ["vite-plugin-custom-media-query/nuxt"],
  devtools: { enabled: true },

  customMedia: {
    pc: "(width > 1200px)",
    sp: "(width <= 1200px)",
    hover: "(hover: hover)",
    nohover: "(hover: none)",
  },

  postcss: {
    plugins: {
      "postcss-preset-env": {
        brwosers: ["baseline 2023"],
      },
    },
  },
});
