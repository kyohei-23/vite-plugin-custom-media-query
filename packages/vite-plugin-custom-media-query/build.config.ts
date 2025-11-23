import { defineBuildConfig } from "unbuild";
export default defineBuildConfig({
  entries: ["./src/index", "./src/nuxt/index"],
  declaration: "node16",
  clean: true,
  externals: ["vite", "@nuxt/kit", "@nuxt/schema"],
});
