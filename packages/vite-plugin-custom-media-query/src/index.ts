import type { Plugin } from "vite";
import { PluginOption } from "./options";

/** 
 * If there is an @import statement, avoid inserting the custom media at the top.
 * CSS @import at rule's specs are...
 * @\import url;
 * @\import url layer;
 * @\import url layer(layer-name);
 * @\import url layer(layer-name) supports(supports-condition);
 * @\import url layer(layer-name) supports(supports-condition) list-of-media-queries;
 * @\import url layer(layer-name) list-of-media-queries;
 * @\import url supports(supports-condition);
 * @\import url supports(supports-condition) list-of-media-queries;
 * @\import url list-of-media-queries;
 * 
 * ja: 逆説的に考えると、`@import` で始まらない文の前のセミコロンに続く行に挿入すれば良いので、セミコロンの後に改行やスペースが入る可能性も考慮して、正規表現でマッチさせる。
 * en: Conversely, if it does not start with `@import`, insert it after the semicolon before the line, considering the possibility of newlines and spaces after the semicolon, so match it with a regular expression.
 **/ 

function injectCssLine(code: string, additionalLine: string): string {
  if ( code.includes("@import") ){
    const importRegex = /@import.+[^\d]+;/gm;
    const match = [...code.matchAll(importRegex)];
    if (!match.length) {
      return [additionalLine, code].join("\n");
    }
    const _code = code.replace(match.at(-1).at(-1), (matched) => matched + "\n" + additionalLine);
    return _code;
  }
  return  [additionalLine, code].join("");
}

if ( import.meta.vitest ){
  const { it, expect } = import.meta.vitest;
  it("injectCssLine inserts at the top if no @import", () => {
    const code = `
body {
  margin: 0;
}`;
    const additionalLine = `@custom-media --pc (width > 1200px);`;
    const result = injectCssLine(code, additionalLine);
    expect(result.startsWith(additionalLine)).toBe(true);
  })

  it("injectCssLine inserts after @import", () => {
    const code = `
@import "modern-normalize";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  margin: 0;
}`;
  const additionalLine = `@custom-media --pc (width > 1200px);`;
  const result = injectCssLine(code, additionalLine);
  const expected = `
@import "modern-normalize";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@custom-media --pc (width > 1200px);

body {
  margin: 0;
}`;
    expect(result).toBe(expected);
  })

  it("injectCssLine works with complex @import", () => {
    const code = `
@import url('fineprint.css') print;
@import url('bluish.css') projection, tv;
@import url('custom.css') screen and (min-width: 900px);

body {
  margin: 0;
}`;
    const additionalLine = `@custom-media --pc (width > 1200px);`;
    const result = injectCssLine(code, additionalLine);
    const expected = `
@import url('fineprint.css') print;
@import url('bluish.css') projection, tv;
@import url('custom.css') screen and (min-width: 900px);
@custom-media --pc (width > 1200px);

body {
  margin: 0;
}`;
    expect(result).toBe(expected);
  })

  it("injectCssLine works within no break css", () => {
    const code = `
@import url('no-semicolon.css');@import url('another.css');body {margin: 0;}`;
    const additionalLine = `@custom-media --pc (width > 1200px);`;
    const result = injectCssLine(code, additionalLine);
    const expected = `
@import url('no-semicolon.css');@import url('another.css');
@custom-media --pc (width > 1200px);body {margin: 0;}`; //\n inserted line break after last @import statement.
    expect(result).toBe(expected);
  })
}

const customMediaPlugin = (options: PluginOption): Plugin => {
  const additionalLine = Object.entries(options)
    .map(([key, value]) => `@custom-media --${key} ${value};`)
    .join("");

  return {
    name: "vite-plugin-custom-media-query",
    enforce: "pre",
    transform: {
      filter: {
        id: /\.css$/
      },
      handler(code, id){
        if (id.includes(".css")) {
          return {
            code: injectCssLine(code, additionalLine),
          }
        }
      },
    },
  };
};

export default customMediaPlugin;
