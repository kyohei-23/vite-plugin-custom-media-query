# vite-plugin-custom-media

<p align="center">
 <a href="./README.md">English</a> &nbsp;| &nbsp;<span>日本語</span>
</p>

## このプラグインについて
Viteの [`css.preprocessoroptions.[extension].additionaldata`](https://ja.vite.dev/config/shared-options#css-preprocessoroptions-extension-additionaldata) が利用できないケースで、全てのCSSファイルに Custom Media Query の設定を追加するプラグインです。
具体的には以下のケースを想定しています。

- 複数ファイルに分割しての通常のCSS開発
- Vue SFC
- CSS modules

## インストール
パッケージ本体のインストール

```sh
npm i -D vite-plugin-custom-media
```

単体ではCSSをブラウザで利用できる形に変換できないため、以下のうちどれかをプロジェクトに合わせてインストール。

- [postcss-preset-env](https://www.npmjs.com/package/postcss-preset-env)
- [postcss-custom-media](https://www.npmjs.com/package/postcss-custom-media)
- [lightningcss](https://www.npmjs.com/package/lightningcss)

NOTE: lightningcssを利用する場合は[Viteのドキュメント](https://ja.vite.dev/guide/features#lightning-css)を参照。


## クイックスタート
Viteの設定ファイルにこのプラグインをインポートし、引数にキーと値のセットをオブジェクト形式で渡します。
```vite.config.js
import CustomMediaPlugin from "vite-plugin-custom-media";

/**@type { import('vite').UserConfig } */
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

CSSファイルでは、Custom Media Query の提案された仕様に則り、以下のように参照します。
変数名は設定ファイルのキーの先頭に2つのハイフン (`--`) をつけて呼び出せます。
```style.css
.foo {
    background-color: red;

    @media (--laptop) {
        background-color: green;
    }
}
```

## Nuxt モジュール
Nuxt3以降で使用する場合は専用のモジュールを利用できます。

```nuxt.config.ts
export default defineNuxtConfig({
  modules: ["vite-plugin-custom-media/nuxt"],
  devtools: { enabled: true },

  postcss: {
    plugins: {
      "postcss-preset-env": {
        brwosers: ["baseline 2023"],
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
Vite plugin と同様にCSSファイルで利用できるほか、Vue SFC の `<template>` ブロックなどでも利用できます。
Nuxt向けの型定義も同梱しているため、`nuxt.config` の設定に応じた入力補完もサポートしています。

```sample.vue
<template>
    <picture>
        <source :media="$mq.LAPTOP" srcset="..." />
        <img src="..." />
    </picture>
</template>
````

jsの処理で参照する必要がある場合は、`useNuxtApp` コンポーザブルから取り出すこともできます。
```sample.vue
<script setup>
const { $mq } = useNuxtApp()
</script>
```
