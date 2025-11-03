import type { Plugin } from "vite";

type PluginOption = Record<string, string>;

const customMediaPlugin = (options: PluginOption): Plugin => {
  const additionalLine = Object.entries(options)
    .map(([key, value]) => `@custom-media --${key} ${value};`)
    .join("");

  return {
    name: "vite-plugin-custom-media-query",
    enforce: "pre",
    transform(code, id) {
      if (id.includes(".css")) {
        return {
          code: [additionalLine, code].join(""),
        };
      }
    },
  };
};

export default customMediaPlugin;
