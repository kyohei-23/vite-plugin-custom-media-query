# vite-plugin-custom-media

<p align="center">
 <span>English</span> &nbsp;|&nbsp;<a href="./README-JA.md">日本語</a>
</p>

## About this Plugin
This is a Vite plugin that adds Custom Media Query definitions to all CSS files, for cases where [`css.preprocessoroptions.[extension].additionaldata`](https://vitejs.dev/config/shared-options#css-preprocessoroptions-extension-additionaldata) cannot be used. Typical use cases include:

- Regular CSS development split across multiple files
- Vue SFC (Single File Components)
- CSS Modules

## Installation
Install the main package:

```sh
npm i -D vite-plugin-custom-media
```

This plugin alone does not convert CSS into a browser-usable format. Please install one of the following according to your project:

- [postcss-preset-env](https://www.npmjs.com/package/postcss-preset-env)
- [postcss-custom-media](https://www.npmjs.com/package/postcss-custom-media)
- [lightningcss](https://www.npmjs.com/package/lightningcss)

NOTE: If you use lightningcss, refer to the [Vite documentation](https://vitejs.dev/guide/features#lightning-css).

## Quick Start
Import this plugin in your Vite config file and pass an object with key-value pairs as arguments.

```js
import customMediaPlugin from "vite-plugin-custom-media";

/** @type { import('vite').UserConfig } */
const config = {
	plugins: [
		customMediaPlugin({
			laptop: "(width > 1024px)",
			mobile: "(width <= 1024px)",
			hover: "(hover: any-hover)",
		}),
	],
}

export default config
```

In your CSS files, refer to the custom media queries according to the proposed spec. Prefix the key with two hyphens (`--`) to use it as a variable:

```css
.foo {
		background-color: red;

		@media (--laptop) {
				background-color: green;
		}
}
```

## Nuxt Module
For Nuxt 3 and later, a dedicated module is available.

```ts
export default defineNuxtConfig({
	modules: ["vite-plugin-custom-media/nuxt"],
	devtools: { enabled: true },

	postcss: {
		plugins: {
			"postcss-preset-env": {
				browsers: ["baseline 2023"],
			},
		},
	},

	customMedia: {
		laptop: "(width > 1024px)",
		mobile: "(width <= 1024px)",
		hover: "(hover: hover)",
		nohover: "(hover: none)",
	},
})
```
You can use custom media queries in CSS files as with the Vite plugin, and also in Vue SFC `<template>` blocks. Type definitions for Nuxt are included, so you get input completion in `nuxt.config` as well.

```vue
<template>
		<picture>
				<source :media="$mq.LAPTOP" srcset="..." />
				<img src="..." />
		</picture>
</template>
```

If you need to reference them in JavaScript, you can also access them from the `useNuxtApp` composable:

```vue
<script setup>
const { $mq } = useNuxtApp()
</script>
```
