---
title: 从零开始写一个 Web Component - GitHub Corners
date: 2021-09-25 18:27:37
updated: 2021-11-11 18:27:37
tags:
  - Web Components
  - lit
  - GitHub
categories:
  - 云游的小教程
---

## Web Components

什么是 Web Components?

> Web Components 是一套不同的技术，允许您创建可重用的定制元素（它们的功能封装在您的代码之外）并且在您的 web 应用中使用它们。

Web Components 实际上和现在 React/Vue 等前端框架的组件概念十分相似，或者倒不如说 Vue 的 SFC（单文件组件）其实正是借鉴自 Web Components 的概念。
它本身 Shadow DOM 的方案做了 CSS 隔离，很好地解决了 CSS 命名污染等问题，但 Web Components 除了规范推进缓慢，也还有很多开发（效率、生态、兼容等）上的不足。

简单来说 Web Components 其实就好比给予你一些浏览器的 API 权限，去定义一个 HTML 标签来自己使用。
更多的介绍其实看 MDN 的介绍即可，也无需在这听我这二手的长篇大论。

> [Web Components | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)

我自己本身也向来讨厌**通篇**理论，而热衷实践，所以我们不妨动手一试，写一个**真正实用**的 Web Component - `github-corners`。（成果请到文章末尾取用）

<!-- more -->

[![满口大道理，写十行代码九个报错，一个警告](https://r2.yunyoujun.cn/images/full-of-reason-but-code-is-error.jpg)](https://r2.yunyoujun.cn/images/full-of-reason-but-code-is-error.jpg)

## 血脉传承

且慢，正所谓磨刀不误砍柴工。在真正动手之前，我们还是了解一下当前 Web Components 的发展状况，找一个趁手又可靠的工具。

### Web Components 框架有哪些？

- [skatejs](https://github.com/skatejs/skatejs): 最后一次 Release 是 2017，最后一次更新是 2019，不做考虑。
- [slim.js](https://github.com/slimjs/slim.js): 看起来还在活跃，但知名度（Star）似乎并不高。
- [omi](https://github.com/Tencent/omi/): 腾讯旗下，实际上暑假我也参与了腾讯的开源活动 [腾讯犀牛鸟开源人才培养计划](https://opensource.tencent.com/summer-of-code) 并顺利结业，对其也贡献了些代码。作者[当耐特](https://github.com/dntzhang)是微信支付团队成员，也是此次参与项目活动的导师。
- [Polymer](https://github.com/polymer/polymer): Google 早期的 Web Components 框架，Since 2013。
- [lit](https://github.com/lit/lit): 依旧是 Google 出品，但谷歌对于 Polymer 不是很满意，于是另起炉灶地造了 [lit-element](https://github.com/lit/lit-element)，最终合并到 lit，Since Google I/O 2018。

简而言之，Polymer -> lit-element -> lit。

而大部分 Web Components 相关的框架其实很多要么年久失修，要么其实并没有多少人用（意味着很容易遇到问题而无法依靠前人经验），可选项似乎只剩下 omi 与 lit。

尽管我也算是 omi 的贡献者，不过项目本身我觉得并不算腾讯主力在做的事情，与参与 W3C 标准制定的谷歌相比，lit 是一个公司层面上支撑团队在做的事情，而 omi 则是员工的业余开源作品。

因此在生产环境我更倾向于使用 lit 而非 omi。(omi 当作一个实验学习的地方，而 lit 则作为生产实践。)
而恰好 vite 也提供了 lit 的模板。

**相关导航**：

- [WEBCOMPONENTS.ORG](https://www.webcomponents.org/): 有很多 Web Components 例子，可以粘贴自己的 npm 包链接到这里[发布](https://www.webcomponents.org/publish)。

## 过程

### github-corners

我们这次的目标就是实现一个 github-corners 组件。

Web Components 的现况似乎还并不适合大型项目的开发，而 GitHub Corners 恰好是一个极小的实现，同时其功能目的，又能完美发挥 Web Components 独有的优势——跨框架。

先来三段论。

#### 是什么？

[github-corners](https://github.com/tholman/github-corners) 是一个右上角的图标，链接至你的 GitHub 项目。同时当鼠标悬停于上时，它的尾巴还会发生轻微的抖动。

预览: [wc-github-corners](https://www.yunyoujun.cn/wc-github-corners/)

![GitHub Corners Preview](https://r2.yunyoujun.cn/images/github-corners-preview.jpg)

#### 为什么?

这件事似乎已经有人做了，我们为什么还要重复造轮子？

首先是用于练手学习，其次的话，这个仓库的 GitHub Corners 实际上是原生的 HTML 与 CSS 的结合体，也就是说我们使用它还需要粘贴它的代码，配置各种参数才能使用。（这明显是很麻烦的）

所以我们的第二个目标是将其封装为一个 npm 包，用户只需要安装这个包，就可以简单地一行代码引入，而且可以通过配置参数实现其不同的效果。

说白了，并不是重新造轮子，而是在轮子上进一步优化封装。

我们可以查一下大致有哪些组件。（以 github corners 为例）

我们可以发现其实大部分已有的包，要么是 Vue 组件，要么是 React 组件，这意味着我们只能在对应的框架中使用，而这一简单的功能完全可以使用 Web Components 来实现（这也正是它的优势），从而解决跨框架的问题。（无论你喜欢 Vue 还是 React 抑或是 Angular/Svelte，都可以将其作为 HTML 标签来使用。）

还有一个原因则是，GitHub Corners 已有的 Vue 组件还不支持 Vue3，我早在数月前提了个 [[Feature Request] Support vue3 | Issue](https://github.com/gluons/vue-gh-corners/issues/55)，但是作者打了 `enhancement` 标签后就鸽了。尽管我打算提 PR 重构，作者似乎还没有回应，所以我决定重新写一个更为通用的组件。（其实这也是本篇文章诞生的原因）

> 以及在 [webcomponents.org](https://www.webcomponents.org/) 上搜索 github-corners，目前的确还没有这个组件。

#### 怎么做？

![废话少说，上号](https://r2.yunyoujun.cn/images/stop-talking-and-open-vscode.jpg)_废话少说，上号_

正如前文所述，在 Google 的血脉压制下，我们决定使用 lit 框架。

那么，首先建立一个 vite + lit 模板。（wc 不是厕所，是 Web Components 的首字母缩写！）

```bash
yarn create vite wc-github-corners
# pnpm create vite wc-github-corners
```

选择 `lit-ts`。（前几天打算给 Vite 提 PR，结果刚好那几天有人提了。）

lit 2.0 将 `lit-element` 合并进了 `lit`。

---

开始开发！

建立仓库 [YunYouJun/wc-github-corners | GitHub](https://github.com/YunYouJun/wc-github-corners)。（开源精神，当然是 MIT 协议啦！）

我们主要在 `src/index.ts` 编辑即可，就如同一个普通的 Class，设置我们需要暴露给用户的属性，并根据属性渲染对应的 DOM 结构。

> [src/index.ts | wc-github-corners](https://github.com/YunYouJun/wc-github-corners/blob/main/src/index.ts)

我抽取了几个我认为比较重要的属性。

- `blank`: boolean，是否打开新的标签页
- `color`: string，字体色彩，即 GitHub Logo 颜色
- `fill`: string，填充背景色
- `repo`: string，你的项目链接，默认为 GitHub 仓库，因此可以简略地写为 `YunYouJun/wc-github-corners`
- `url`: string，链接，可以覆盖自动生成的 GitHub 仓库链接
- `label`: string，标签，鼠标悬浮时的标题
- `reverse`: boolean，反转，将 GitHub Logo 色彩与背景色进行交换
- `position`: string，位置，位于左上角还是右上角

> 更多可参见 [fields | wc-github-corners](https://github.com/YunYouJun/wc-github-corners#fields)。

更具体的过程其实是件很无聊的事情，无非是查 [lit 文档](https://lit.dev/)，写模板、写参数。
以至于我自己懒得在此一一道来，而想起那天恰好无聊开了直播，朋友帮忙录了下来……（咳，有闪过什么羞耻的东西还请忽略）

[录制-822719-20210930-200614-500-从零开始的 Web Component | bilibili](https://www.bilibili.com/video/BV1q44y147eW)

<iframe src="//player.bilibili.com/player.html?aid=975762282&bvid=BV1q44y147eW&cid=417146522&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" height="380"> </iframe>

所以更具体的开发过程介绍，就用这个糊弄一下吧，随便拖拽进度条了解思路即可。看仓库代码可能反而更快。

#### 细节

当然在此过程中也有一些细节问题。

##### `blank` 属性为什么默认是 false？

```ts
/**
 * A github corner.
 */
@customElement('github-corners')
export class GitHubCorners extends LitElement {
  // ...
  /**
   * target="_blank" for link
   */
  @property({ type: Boolean })
  blank = false
  // ...
}
```

如上，我们添加了 `blank` 作为链接的 `target='_blank'` 的缩写属性。

因为在 HTML 标签上想要实现布尔值只能省略不写，普通地给 HTML 标签属性传值都会被当作字符串解析。

譬如 `blank="false"` 其实等价于传入了 'false' 这一字符串，仍然会被当作 `true`。
只有当我们不写 blank 这个属性时，blank 属性数值才会是 `false`。

```html
<!-- 而我们需要其为 true 时，只需要这样写 -->
<github-corners blank></github-corners>
```

##### lit 的响应式属性

lit 的 dom 和属性是响应式的，即你修改组件的属性，它渲染出来的 dom 也会响应式变化。

但是 style 并没有，所以如果你有时候需要 property 控制的 style 也是，这时需要给其设置 `reflect: true`。

> 见 [Reactive properties | Lit](https://lit.dev/docs/components/properties/)

#### 打包

因为我们尽量想要独立使用，所以需要配置一下 vite，以便在打包时不会将 lit 代码排除。

```ts
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: format => `index.${format}.js`,
    },
    // Because we try to use it independently, we don’t exclude lit.
    // rollupOptions: {
    //   external: /^lit/,
    // },
  },
})
```

#### 完善

一个成功的项目，开发是一部分，而文档和维护也是非常重要的点。

开发完毕后，我们还应当补充好 API 文档，构建后发布到 NPM 包。

```bash
# 构建
npm run build
# 生成 dist/index.es.js

npm publish
# 将当前文件夹下 dist 和 types 相关文件发布到 npm 包
```

好，完成。

组件中有着一些属性和对应注释，我需要将这些参数和注释说明转换为文档来给用户阅读。（虽然直接读代码也行，hhh）

手写文档倒不是什么难事，但是以后一旦修改属性、或者描述，我就要再改一遍文档，这合理吗？（~~合理！~~）

手动修改难免同步会有疏漏，最优雅的方案应当是根据代码自动生成文档。（就像 [TypeDoc](https://typedoc.org/) 做的事那样）
因为代码本身便是用 TypeScript 写的，所以这倒不是什么难事。
当然 lit 本身也已经给我们提供了一些方案。

在参考 [lit-element-starter-ts](https://github.com/lit/lit-element-starter-ts) 想要自动生成文档时，我发现了 [@custom-elements-manifest/analyzer](https://www.npmjs.com/package/@custom-elements-manifest/analyzer) 这个包。
可以自动解析 class 生成相关参数的信息。

在看了 repo 后，我又发现了 [@custom-elements-manifest/to-markdown](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/to-markdown) 这个包，可以直接利用其结合注释生成文档，而这正是我需要的。

但这还不够，我需要将其直接插入我的 README.md（这样更直观方便），而不是生成一个新的 markdown。

我在其他项目其实也有过类似的需求，所以此前我将其封装成了一个 npm 包，我现在可以直接安装使用。（~~什么叫沉淀输出，战术后仰~~）

```bash
pnpm add @yunyoujun/utils
```

```typescript
import { markdown } from '@yunyoujun/utils'
```

生成文档部分代码可见 [scripts/gen-docs.ts](https://github.com/YunYouJun/wc-github-corners/blob/main/scripts/gen-docs.ts)。

#### 发布

终于到了发布阶段。我们发布的内容主要包括 `dist` 与 `types`，`dist` 是我们编译后直接就可以拿来用的代码，`types` 则是辅助的类型提示。

`package.json` 中可以如下设置。

```json
{
  "name": "wc-github-corners",
  "version": "0.1.3",
  "main": "dist/index.es.js",
  "exports": {
    ".": "./dist/index.es.js"
  },
  "types": "types/index.d.ts",
  "files": ["dist", "types"],
  "scripts": {
    "analyze": "custom-elements-manifest analyze --globs 'src/index.ts' --outdir dist",
    "dev": "vite",
    "build": "tsc && vite build && npm run copy:demo && npm run docs:gen",
    "copy:demo": "cp demo/* dist/",
    "preview": "vite preview",
    "docs:gen": "npm run analyze && esmo scripts/gen-docs.ts",
    "prepublishOnly": "npm run build"
  }
  // 。。。
}
```

```bash
# 发布，确保处于 npm 官方源下
npm publish
```

执行发布包的命令，同时会自动触发我们写在脚本里的 `prepublishOnly` 进行构建，确保每次发布时，都是构建后没问题的。

除了 [NPM 包](https://www.npmjs.com/package/wc-github-corners)，我们还可以发布到 [webcomponents.org](https://www.webcomponents.org/publish)，通过已发布的 npm 包名来发布即可。

> [wc-github-corners | webcomponents.org](https://www.webcomponents.org/element/wc-github-corners)

## 实装

总之先展示一下最后成果。

- GitHub: [wc-github-corners](https://github.com/YunYouJun/wc-github-corners)
- Demo: <https://yunyoujun.github.io/wc-github-corners/>
- Demo 代码: [wc-github-corners/demo/index.html](https://github.com/YunYouJun/wc-github-corners/blob/main/demo/index.html)

软件界用自己的东西叫做 dogfooding, (Eating your own dog food - [吃自己的狗粮](https://zh.wikipedia.org/wiki/%E5%90%83%E8%87%AA%E5%B7%B1%E7%9A%84%E7%8B%97%E7%B2%AE))

所以我打算先好好品尝一下，在自己的各个项目里开始使用起来。

Web Components 的原理，使得它可以在任意框架里被使用，比如我可以在我的 Vue 项目中使用，也可以 React，甚至原生 CDN 引入使用。

我在我的 [char-dust](https://yunyoujun.github.io/char-dust/) 中尝试引用了它，只需要在 `head` 和 `body` 标签中对应引入 CDN 和 `github-corners` 标签即可，So Easy!

```html
<head>
  <script
    type="module"
    src="https://cdn.jsdelivr.net/npm/wc-github-corners@latest"
  ></script>
  <!-- ... -->
</head>
<body>
  <github-corners blank repo="YunYouJun/char-dust"></github-corners>
  <!-- ... -->
</body>
```

> [demo/index.html | char-dust](https://github.com/YunYouJun/char-dust/blob/master/demo/index.html)
> 不使用 CDN 的话，也可以在 [`main.ts`](https://github.com/YunYouJun/char-dust/blob/master/demo/src/main.ts) 中 `import "wc-github-corners";` 来直接使用。

就此，一个基于 Web Components 技术的小组件就实现完毕了。除了 Demo 本身的示例作用，我想它本身也是足够实用的。
也欢迎大家将其用于展示自己的项目。✌️

## 后话

实质上这个小项目本在国庆就已经完成了，但却一直拖到现在才介绍。
最近终于下定决心做了一个可能决定自己未来走向的选择，希望能在下次和大家好好说道说道。

---

Q.E.D.
