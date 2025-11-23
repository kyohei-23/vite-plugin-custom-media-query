import {
  addPluginTemplate,
  addTypeTemplate,
  addVitePlugin,
  defineNuxtModule,
  useLogger,
} from "@nuxt/kit";
import type { NuxtModule } from "@nuxt/schema";
import vitePlugin from "../index";
import type { PluginOption } from "../options.d.ts";

function toUpperPascalCase(src: string): string {
  return src.replaceAll("-", "_").toLocaleUpperCase();
}

const nuxtModule: NuxtModule<PluginOption> = defineNuxtModule<PluginOption>({
  meta: {
    name: "nuxt-custom-media",
    configKey: "customMedia",
    compatibility: {
      nuxt: ">=3.0.0",
    },
  },
  setup(opt, nuxt) {
    const logger = useLogger("custom-media-plugin");
    addVitePlugin([vitePlugin(opt)]);
    const transformed = Object.fromEntries(
      Object.entries(opt).map(([key, val]) => [toUpperPascalCase(key), val]),
    );
    addPluginTemplate({
      filename: "nuxt-custom-media-plugin.mjs",
      mode: "all",
      getContents: () => `
        import { defineNuxtPlugin } from '#app'
        export default defineNuxtPlugin(() => {
          return {
            provide: {
              mq: ${JSON.stringify(transformed)}
            }
          }
        })
      `,
    });
    const typeDeclarations = Object.entries(transformed)
      .map(([key, val]) => `readonly ${key}: "${val}",`)
      .join("\n");

    addTypeTemplate(
      {
        filename: "types/custome-media.d.ts",
        getContents: () => `
      declare module '#app' {
        interface NuxtApp {
          $mq: {
            ${typeDeclarations}
          }
        }
      }

      declare module 'vue' {
        interface ComponentCustomProperties {
          $mq: {
            ${typeDeclarations}
          }
        }
      }

      export {}
      `,
      },
      {
        nuxt: true,
      },
    );

    logger.info("these media queries are available!");
    for (const key of Object.keys(transformed)) {
      logger.info(key);
    }
  },
});

export default nuxtModule;
