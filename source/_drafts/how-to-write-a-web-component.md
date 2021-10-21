---
title: 从零开始写一个 Web Component - GitHub Corners
date: 2021-09-25 18:27:37
updated: 2021-09-25 18:27:37
tags:
  - Web Components
  - lit
categories:
  - 云游的小教程
---

## Web Components

什么是 Web Components?

> [Web Components | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)

我这个人向来讨厌**通篇**理论，热衷实践。

[![满口大道理，写十行代码九个报错，一个警告](https://upyun.yunyoujun.cn/images/full-of-reason-but-code-is-error.jpg)](https://upyun.yunyoujun.cn/images/full-of-reason-but-code-is-error.jpg)

**相关导航**：

- [WEBCOMPONENTS.ORG](https://www.webcomponents.org/): 有很多 Web Components 例子，可以粘贴自己的 npm 包链接到这里[发布](https://www.webcomponents.org/publish)。

Web Components 框架有那些？

- [skatejs](https://github.com/skatejs/skatejs): 最后一次 Release 是 2017，最后一次更新是 2019，不做考虑。
- [slim.js](https://github.com/slimjs/slim.js): 看起来还在活跃，但知名度（Star）似乎并不高。
- [omi](https://github.com/Tencent/omi/): 腾讯旗下，实际上暑假我也参与了腾讯的开源活动 [腾讯犀牛鸟开源人才培养计划](https://opensource.tencent.com/summer-of-code) 并顺利结业务，对其也贡献了些代码。作者[当耐特](https://github.com/dntzhang)是微信支付团队成员，也是此次参与项目活动的导师。
- [Polymer](https://github.com/polymer/polymer): Google 早期的 Web Components 框架，Since 2013。
- [lit](https://github.com/lit/lit): 依旧是 Google 出品，但谷歌对于 Polymer 不是很满意，于是另起炉灶地造了 [lit-element](https://github.com/lit/lit-element)，最终合并到 lit，Since Google I/O 2018。

简而言之，Polymer -> lit-element -> lit。

而大部分 Web Components 相关的框架其实很多要么年久失修，要么其实并没有多少人用（意味着很容易遇到问题而无法依靠前人经验），可选项似乎只剩下 omi 与 lit。

尽管我也算是 omi 的贡献者，不过项目本身我觉得并不算腾讯主力在做的事情，与参与 W3C 标准制定的谷歌相比，lit 是一个公司层面上支撑团队在做的事情，而 omi 则是员工的业余开源作品。

因此在生产环境我更倾向于使用 lit 而非 omi。(omi 当作一个实验学习的地方，而 lit 则作为生产实践。)
而恰好 vite 也提供了 lit 的模板。

<!-- more -->

## 过程

### github-corners

我们这次的目标就是实现一个 github-corners 组件。

#### 是什么？

[github-corners](https://github.com/tholman/github-corners) 是一个右上角的图标，链接至你的 GitHub 项目。同时当鼠标悬停于上时，它的尾巴还会发生轻微的抖动。

![GitHub Corners Preview](https://upyun.yunyoujun.cn/images/github-corners-preview.jpg)

#### 为什么要写 github-corners?

看起来是一件重复造轮子的事情，为什么我们要重复做这件事情？

首先是用于练手学习，其次的话，这个仓库的 GitHub Corners 实际上是原生的 HTML 与 CSS 的结合体，也就是说我们使用它还需要粘贴它的代码，配置各种参数才能使用。（这很明显是很麻烦的）

所以我们的第二个目标是将其封装为一个 npm 包，用户只需要安装这个包，就可以简单地一行代码引入，而且可以通过配置参数实现其不同的效果。

实际上，这件事也有不少人做了。（~~所以为什么要重复造轮子？~~）

但是，我们可以查一下大致有哪些组件。（以 github corners 为例）

我们可以发现其实大部分已有的包，要么是 Vue 组件，要么是 React 组件，这意味着我们只能在对应的框架中使用，而这一简单的功能完全可以使用 Web Components 来实现，从而解决跨框架的问题。（无论你喜欢 Vue 还是 React 抑或是 Angular/Svelte，都可以将其作为 HTML 标签来使用。）

还有一个原因则是，GitHub Corners 已有的 Vue 组件还不支持 Vue3，我早在数月前提了个 [[Feature Request] Support vue3 | Issue](https://github.com/gluons/vue-gh-corners/issues/55)，但是作者打了 `enhancement` 标签后就鸽了。尽管我打算提 PR 重构，作者似乎还没有回应，所以我决定重新写一个更为通用的组件。

> 以及在 [webcomponents.org](https://www.webcomponents.org/) 上搜索 github-corners，目前的确还没有这个组件。

### 具体步骤

![废话少说，上号](https://upyun.yunyoujun.cn/images/stop-talking-and-open-vscode.jpg)

那么，首先建立一个 lit 模板。

```bash
yarn create wc-github-corners
```

选择 `lit-ts`。（前几天打算给 Vite 提 PR，结果被抢先了。）

lit 2.0 将 `lit-element` 合并进了 `lit`。

---

开发完毕后，补充好 API 文档，构建后发布到 NPM 包即可。

```bash
# 构建
npm run build
# 生成 dist/index.es.js

npm publish
# 将当前文件夹下 dist 和 types 相关文件发布到 npm 包
```

完成。

[wc-github-corners](https://github.com/YunYouJun/wc-github-corners)

用自己的东西叫做 dogfooding, (Eating your own dog food - [吃自己的狗粮](https://zh.wikipedia.org/wiki/%E5%90%83%E8%87%AA%E5%B7%B1%E7%9A%84%E7%8B%97%E7%B2%AE))

因为我们尽量想要独立使用，所以不将 lit 排除

```ts
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
    },
    // Because we try to use it independently, we don’t exclude lit.
    // rollupOptions: {
    //   external: /^lit/,
    // },
  },
});
```

在参考 [lit-element-starter-ts](https://github.com/lit/lit-element-starter-ts) 想要自动生成文档时，我发现了 [@custom-elements-manifest/analyzer](https://www.npmjs.com/package/@custom-elements-manifest/analyzer) 这个包。
可以自动解析 class 生成相关参数的信息。

再看了 repo 后，我又发发现了 [@custom-elements-manifest/to-markdown](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/to-markdown) 这个包，可以直接利用其结合注释生成文档，而这正是我需要的。

但这还不够，我需要将其直接插入我的 README.md（这样更直观方便），而不是生成一个新的 markdown。

此前我将其封装成了一个 npm 包，所以我现在可以直接安装使用。

```bash
pnpm add @yunyoujun/utils
```

```ts
import { markdown } from "@yunyoujun/utils";
```

`blank` 为什么默认只能是 false

HTML 标签布尔值只能省略不写

发布到 [webcomponents.org](https://www.webcomponents.org/element/wc-github-corners)，通过已发布的 npm 包名来发布。

---

还有个问题，lit 的属性是响应式的， repo 与 url 之间的关系并非是响应式的。
因为 url 一开始使用了 repo 的初始值进行初始化，所以我们需要修改下代码。

对了，lit 的 dom 是响应的，但你可能有时候需要 property 控制的 style 也是，这时需要给其设置 `reflect: true`

见 https://lit.dev/docs/components/properties/

---

To Be Continued.

<!-- Q.E.D. -->

```

```
