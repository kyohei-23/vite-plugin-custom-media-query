import customMediaPlugin from "./packages/vite-plugin-custom-media-query";
import presetEnv from "postcss-preset-env";

/**
 * @type { import("vite").UserConfig }
 */
export default {
  plugins: [
    customMediaPlugin({
      laptop: "(width > 1024px)",
      mobile: "(width <= 1024px)",
      hover: "(hover: any-hover)",
    }),
  ],
  css: {
    postcss: {
      plugins: [
        presetEnv({
          customMediaPlugin: true,
        }),
      ],
    },
  },
};
