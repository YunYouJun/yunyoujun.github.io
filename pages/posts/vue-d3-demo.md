---
title: 从 Vite 与 Vue 开始的 D3 数据可视化之旅
date: 2020-11-21 19:56:09
updated: 2020-11-21 19:56:09
tags:
  - Vite
  - Vue
  - D3
categories:
  - 云游的小教程
---

这是一个极其简单的并尽可能面向未来的新手教程，它将指导你简单地使用 Vite 启动 Vue 的脚手架，并开始 D3 数据可视化的相关开发。而你无需 Vue 相关的前置使用知识，你只需跟随教程简单地使用它。
在课后如果你仍有兴趣，那么你可以继续地深入了解它。

~~「简单」是不是用的太多了~~

<!-- more -->

## 纪念品

- GitHub: [vue-d3-demo](https://github.com/YunYouJun/vue-d3-demo)
- 示例页面: [vue-d3-demo](https://yunyoujun.github.io/vue-d3-demo/)
- Slides(开发环境): [vue-d3-demo](https://www.yunyoujun.cn/slides/vue-d3-demo/)

## 行李清单

首先准备好我们旅行的行李清单。

- [Node.js](https://nodejs.org/): 本教程开发的前置基础环境，尽管你可能已经早已安装好了它，但以防万一，还是再作提醒。
- [npm](https://www.npmjs.com/) or [yarn](https://www.yarnpkg.com/zh-Hans/): 包管理工具，npm 已随 Node.js 默认安装。yarn 可选，但我建议你不妨试一试。后续的内容也将以此为展开，当然你也可以执拗地使用 `npm run` 替代教程中的 `yarn`。
- [D3](https://github.com/d3/d3): Data-Driven Documents 数据可视化最为流行的基础库，没有之一。
- [Vue](https://github.com/vuejs/vue): The Progressive JavaScript Framework 目前最为流行的前端框架之一，不可否认的是它相比 React 的学习曲线要更为平缓。
- [Vite](https://github.com/vitejs/vite): Native-ESM powered web dev build tool. It's fast. 面向未来的前端构建工具。

当然，后续我们会再详细介绍其在旅途中的功用。

## 旅行指南

单纯使用 D3.JS 与原生的 HTML/CSS/JS 便可以实现数据可视化的种种效果，在制作简易的 Demo 时，这是十分方便且愉快的事情。

但是数据可视化的存在本身常常需要与现有的工程项目结合，而这个项目本身便可能是由 Vue/React 写成（Angular: ???），我们便需要将其进行些许改造，以集成进项目中。

此外，简单的 Demo 页面使用原生的 HTML/CSS/JS 并无大碍，但逻辑一旦复杂起来，组件式开发便务必提上日程，否则极易自顾不暇。

D3 本身的宣传标语便是 `Data-Driven Documents`，即数据驱动文档。Vue 则同样以数据流驱动为核心理念。
所谓的数据可视化，自然也是以数据为核心。我们理想的情况是在数据变化的同时，便可以响应式地看到变化的效果，而非手动去操纵 DOM 元素。

前端与后端也应当解除耦合，我们只需要关心返回的 JSON 数据，而无需在意其由何种技术搭建、还是其他任意相关内容。

![fe-vs-be.jpg](https://i.loli.net/2020/11/23/BMjg6K2dzsZpHSo.jpg)

而 Vite 则是 Vue 作者尤雨溪的又一自信之作，旨在通过浏览器原生支持的 ES Module 来解决 Webpack 等打包工具打包加载过慢的问题。社区此前也已经有一个类似概念的工具 [snowpack](https://github.com/snowpackjs/snowpack)。

> 当然 Vite 除了和 Vue 生态更加友好之外，也在 README 中列举了一些不同之处。
> [How is This Different from Snowpack? | Vite](https://github.com/vitejs/vite#how-is-this-different-from-snowpack)

而在摆脱如 IE 般等一些历史兼容包袱后，它很可能成为一个未来的趋势。（尽管 1.0 仍旧处于 RC 阶段，但已基本可以使用。）

一个有趣的互动：

> Evan You: I feel I may never be able to go back to webpack
>
> Sean Thomas Larkin 廖肖恩（正在学习汉语的 Webpack 核心团队成员）: 大哥……

![尤雨溪发推.png](https://i.loli.net/2020/11/23/6jbnHI3kRfdlZXx.png)

既然打算面向未来，Vue 使用释出不久的 v3，D3 则使用 v6，也是毋庸置疑之举。

综上所述，对于目前来说，Vite@1 + Vue@3 + D3@6 是个不错的开始方式。

> 已更新为 Vite@2。

## 出发

### Vite 站

废话不多说，咱们先启动一个脚手架。

Vite 本身已经提供了一个脚手架工具 [create-vite-app](https://github.com/vitejs/create-vite-app)。

可以使用以下的方式来初始化项目。进入月台（终端）。

因为我通常习惯使用 [yarn](https://www.yarnpkg.com/zh-Hans/)。所以后面主要以 yarn 作为示例。
（2020 年末的 npm 与 yarn 并没有显著差异。）

```bash
npm init vite-app <project-name>
# or
yarn create vite-app <project-name>
```

- 初始化项目：`yarn create @vitejs/app vue-d3-demo`
- 进入项目文件夹：`cd vue-d3-demo`（如果你使用了 [VS Code](https://code.visualstudio.com/)，你还可以通过 `code .` 的方式快速打开文件夹）
- 安装依赖：`yarn`
- 启动项目：`yarn dev`

默认地址为 `http://localhost:3000`。（再顺带一提，Vite 底部依赖的是 [koa](https://github.com/koajs/koa)。）

我们应该可以看到这样的效果。

![vite-demo.png](https://i.loli.net/2020/11/23/Ri2lGMXZ1Bubzar.png)

一个简单的由脚手架生成的项目便启动完毕了，此外我们也可以见证到 Vite 到底有多快（相比 Webpack）。

### Vue + D3

~~根据老师的要求~~，作为一个 Demo 示例，我们只需要简单演示一下 D3 直方图是如何与 Vue 相结合的。

![算术入门.jpg](https://i.loli.net/2020/11/23/3vDBhLHZw1CiFW9.jpg)

- 安装 D3 依赖: `yarn add d3`

> 我们可以参考一下 D3 官方给出的 Bar Chart 示例：<https://observablehq.com/@d3/bar-chart>

而我们要做的就是将其改造进我们的 Vite + Vue 的项目。

我们先来参观一下示例项目中的代码。

> 值得一提的是 Vue3 我们也不再须是唯一的根元素了，而可以多个元素并列（如：`<h1></h1>`, `<button></button>`, `<p></p>`）。
> 这被称做 [Fragments | 片段](https://v3.vuejs.org/guide/migration/fragments.html#fragments)。

```html
// HelloWorld.vue
<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>
    Edit <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<script>
  export default {
    name: "HelloWorld",
    props: {
      msg: String,
    },
    data() {
      return {
        count: 0,
      };
    },
  };
</script>
```

#### 准备数据

在开始之前，咱们先准备一下 JSON 数据。（JSON 格式无疑是最佳的选择，而此后我们也可以稍加改造而很方便地对接任意后端的 API。）

> 官方提供的其实是一个 CSV 文件。D3 也支持读取 CSV 格式的数据，当然我们还是可以先将其转换为 JSON 格式，因为它更通用一些。
> 为了方便起见，下载下来后，我们可以直接使用 [CSV to JSON](https://csvjson.com/csv2json) 等一些类似的网站进行转换。
> 最后可以得到 [alphabet.json](https://yunyoujun.github.io/vue-d3-demo/alphabet.json)。

我们可以将其作为一个独立的静态文件，用请求的方式去加载它，而非将其打包在文件中。

我们只需将该 JSON 文件放置于 `public/` 文件夹下，随后启动 Vite（`yarn dev`）。

便可以访问 `http://localhost:3000/alphabet.json` 看到 JSON 文件。

大家可能对 [AJAX](https://zh.wikipedia.org/wiki/AJAX)(Asynchronous JavaScript and XML) 早已有所耳闻。

> AJAX 应用可以仅向服务器发送并取回必须的数据，并在客户端采用 JavaScript 处理来自服务器的回应。因为在服务器和浏览器之间交换的数据大量减少，服务器回应更快了。同时，很多的处理工作可以在发出请求的客户端机器上完成，因此 Web 服务器的负荷也减少了。

在告别了 JQuery 时代，我们可以使用 [axios](https://github.com/axios/axios) 这一目前最为流行（没有之一）的 HTTP 请求库来请求咱们事先准备好的 JSON 数据。

- 安装 axios: `yarn add axios`

在 `src/components` 文件夹下新建 `BarChart.vue` 文件。

```html
<template>
  <h2>咱是直方图📊</h2>
</template>

<script>
  import axios from "axios";
  export default {
    /**
     * 在挂载后即开始执行
     */
    mounted() {
      axios.get("./alphabet.json").then((res) => {
        console.log(res.data);
      });
    },
  };
</script>
```

并在 `src/App.vue` 中加载该组件。（示例的 `HelloWorld.vue` 等已经可以删掉了。）

```html
<!-- App.vue -->
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <BarChart />
</template>

<script>
  import BarChart from "./components/BarChart.vue";

  export default {
    name: "App",
    components: {
      BarChart,
    },
  };
</script>
```

F12 打开浏览器控制台，显然我们已经成功地拿到了这一 JSON 数据。

![alphabet.json.png](https://i.loli.net/2020/11/24/7ubjySWJqBLi8dE.png)

千里之行，我们已经迈出了第一步。

#### 绘制直方图

我们还需先定义一个 `bar-chart-container` 的容器，以供 D3 操作。

```html
<!-- BarChart.vue -->
<template>
  <h2>咱是直方图📊</h2>
  <div id="bar-chart-container"></div>
</template>
```

- 安装 D3 依赖：`yarn add d3`

```html
<script>
  export default {
    data() {
      return {
        color: "steelblue",
        margin: { top: 30, right: 0, bottom: 30, left: 40 },
      };
    },

    mounted(){
      ...
    },

    methods: {
      drawBarChart(data) {
        ...
      },
    },
  };
</script>
```

在 `drawBarChart` 函数中初始化 SVG 元素，并放置于我们定义好的 `bar-chart-container` 容器中。

```js
// 初始化 SVG 元素
const svg = d3
  .select('#bar-chart-container')
  .append('svg')
  .attr('class', 'bar-chart')
  .attr('viewBox', `0 0 ${width} ${height}`)
  .attr('width', width)
  .attr('height', height)
  .append('g')
```

配置比例尺的缩放范围及间距。

> [d3-scaleband](https://observablehq.com/@d3/d3-scaleband)

```js
// x 轴的缩放比例尺
const x = d3
  .scaleBand()
  .domain(d3.range(data.length))
  .range([margin.left, width - margin.right])
  .padding(0.1)

// y 轴的缩放比例尺
const y = d3
  .scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .nice()
  .range([height - margin.bottom, margin.top])
```

定义绘制 X/Y 坐标轴的函数：

- `tickSizeOuter(0)`: 移除 0 处初始的标记
- [tickFormat](https://github.com/d3/d3-scale/blob/master/README.md#tickFormat): 记号格式
- [axisLeft](https://github.com/d3/d3-axis#axisLeft): 绘制左侧坐标轴

```js
// x 坐标轴
function xAxis(g) {
  return g.attr('transform', `translate(0,${height - margin.bottom})`).call(
    d3
      .axisBottom(x)
      .tickFormat(i => data[i].name)
      .tickSizeOuter(0)
  )
}

// y 坐标轴
// data.format: "%"
// data.y: "↑ Frequency"
function yAxis(g) {
  return g
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, data.format))
    // 移除区域间的竖线
    .call(g => g.select('.domain').remove())
    .call(g =>
      g
        .append('text')
        .attr('x', -margin.left)
        .attr('y', 10)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .text(data.y)
    )
}
```

根据数据绘制直方图并添加到 SVG 中：

```js
svg
  .append('g')

  .attr('fill', this.color)
  .selectAll('rect')
  .data(data)
  .join('rect')
  .attr('x', (d, i) => x(i))
  .attr('y', d => y(d.value))
  .attr('height', d => y(0) - y(d.value))
  .attr('width', x.bandwidth())
```

添加坐标轴到 SVG 中：

```js
// 绘制到 SVG
svg.append('g').call(xAxis)
svg.append('g').call(yAxis)
```

我们还可以对此前的数据（这是一个英文字母使用频率的统计）进行简单的格式化：

将 `letter` 与 `frequency` 分别映射到 `name` 与 `value` 字段，并降序排列。

> [Array.prototype.map() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
> [Array.prototype.sort() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

```html
<script>
  export default {
    ...,
    methods: {
      /**
       * 格式化数据
       */
      formatData(data) {
        return data
          .map(({ letter, frequency }) => {
            return { name: letter, value: frequency };
          })
          .sort((a, b) => d3.descending(a.value, b.value));
      },
      drawBarChart(data) {...},
    },
  };
</script>
```

万事具备，只欠东风。

我们只需在 `mounted` 中执行我们定义好的各个函数即可看到我们想要的直方图效果。

```html
<script>
  export default {
    /**
     * 在挂载后即开始执行
     */
    mounted() {
      axios.get("./alphabet.json").then((res) => {
        const barChartData = Object.assign(this.formatData(res.data), {
          format: "%",
          y: "↑ Frequency",
        });
        this.drawBarChart(barChartData);
      });
    },
  };
</script>
```

![直方图.png](https://i.loli.net/2020/11/24/KMaOEJX62khFVqQ.png)

如果你需要的话，可以回去检查一下本次旅行的[纪念品](#纪念品)。

也让我们来回顾一下我们去了哪里吧？

[v0.0.1 第一次的旅途](https://github.com/YunYouJun/vue-d3-demo/tree/v0.0.1)

- 搭建了一个简单的 Vite 项目结构
- 使用 Vue@3 构建了一个简单的页面
- 使用 D3@6 绘制了一个简单的柱状图
- 使用 axios 获取 JSON 数据

## 终点

世间万物终有尽时，天下亦没有不散的宴席。

一个简单的不知所云的小旅途（教程），到此就收工了。~~后续可能（也可能不）会附带上简单的（Node.js/Go/Python）后台 API 搭建。~~

> 还记得「窟嚓嚓」的故事吗？
> 那辆白色的火车头是有目的地的……
> 而你也同样存在一个终点站吧
> —— 李白「[春宵苦短，少女前进吧](https://movie.douban.com/subject/26935251/)」

![LM将近了](https://cos.yunle.fun/images/dawn-is-near.jpg)

我们为了抵达某个终点而开始自己的旅程，也希望它能成为你变成想要成为的人的途间一块不知名的垫脚石。

> 黎明将近了，「少年/少女」前进吧！
> 感谢 [LLM](https://blog.mle.moe) 同学的校稿。

---

## 新的旅程

在此前，我们简单的学习了 Vue + Vite + D3 的基本操作，并搭建了一个基础的页面。

接下来我们来试图为其添加一个表单，并添加更多辅助开发的功能。（让它更有项目级别的感觉。）

比如：

- [Sass](https://sass-lang.com/): CSS 最为流行的预处理器，我们可以借助它来利用嵌套、变量等方式来更加便捷地书写 CSS。
- [element-plus](https://element-plus.org/): Vue2 时期最流行的前端组件库 [element-ui](https://element.eleme.io/) 的 Vue3 版本，[Vuetify](https://vuetifyjs.com/zh-Hans/) 虽然也不错，但是目前还没有实现 Vue3 的升级兼容，因为我们的首选方案是 element-plus。
- [Vuex](https://next.vuex.vuejs.org/): Vue 的全局状态管理工具，等我们用到的时候想必你会明白的。
- [vue-router](https://next.router.vuejs.org/zh/introduction.html): Vue 的路由管理器，因为本质上作为单页面应用时， Vue 的路由是用 hash 模拟出来的。
- [TypeScript](https://www.typescriptlang.org/): JavaScript 的超集，相比其多了优雅的类型，更利于开发大型项目、协作、排查 BUG。

一下子似乎又多了许多新的内容，但是不用担心，我们是自顶向下式的，我们先使用这些可以提高开发效率的工具，对其产生兴趣，然后再去逐一进一步了解它们。

我觉得提前了解到某些东西可以做到什么样的效果且更有效率，是有必要的。而非一直使用刀耕火种的方式，如先人般重新探索一遍。
想必这也是旅行时，「地图」的作用吧！

对了，因为我们使用的是 Vue3 版本，所以我们使用的 Vue 相关全家桶都得是 `next` 版本的。

那让我们开始这次新的征程吧！

在此之前，我们需要先准备一点行李，以备不时之需。

### 新的行李清单

#### vue-router

> [Getting Started | Vue Router](https://next.router.vuejs.org/guide/)

开发一个应用级别的网站，必然存在多个页面。
那么我们应该使用更为优雅的方式来组织页面的 url。

vue-router 本质是一个管理生成路由的工具，我们需要手动去导入 Vue 组件并为其分配路由。
这其实蛮麻烦的，我们每新建一个页面，就要去书写对应的路由。

![这河里吗？](https://cos.yunle.fun/images/in-this-river.jpg)

理想的情况下，我们在 `pages` 文件夹下新建 Vue 组件，它能自动根据组件名，生成对应的路由，这才是最优雅的。

也就是类似 Nuxt pages 自动生成的动态路由 [File System Routing](https://zh.nuxtjs.org/docs/2.x/features/file-system-routing)。

> Nuxt.js automatically generates the vue-router configuration based on your file tree of Vue files inside the pages directory. When you create a .vue file in your pages directory you will have basic routing working with no extra configuration needed.

对于 Vue 来说，Vite 也存在一个类似的插件 [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages/)。

对照 README 配置一遍就是了。

```bash
# vite-plugin-pages 仍然需要使用 vue-router 来创建路由
yarn add vue-router@next
yarn add -D vite-plugin-pages
```

配置 Vite 插件。

```typescript
// vite.config.ts
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'

export default {
  plugins: [Vue(), Pages()],
}
```

`vite-plugin-pages` 只做了根据文件路径生成对应路由数据的事情，我们仍然需要 vue-router 来生成 hash 路由。

```typescript
// src/router/index.ts
import routes from 'virtual:generated-pages'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

记得在 `main.ts` 中引入它。

```typescript
// src/main.ts
// ...
import router from './router'
// ...
const app = createApp(App)
app.use(router)
app.mount('#app')
```

#### Vuex

> [Getting Started | Vuex](https://next.vuex.vuejs.org/guide/)

再整一个全局状态管理。也许我们会遇到需要存储管理全局的状态，~~也可能不需要~~。

```bash
yarn add vuex@next
```

```typescript
// src/store/index.ts
import { createLogger, createStore } from 'vuex'
// import form from "./modules/form";
const debug = false

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    // form,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})
```

在此内部，我们则可以使用 `src/store/modules/xxx.ts` 的方式管理模块数据。（之后用到再说吧！）

#### sass

引入 sass 的流程其实已经被 vite 简化了，我们只需要 `import xxx.scss` 即可。

`scss` 是 `sassy css`，作为 sass 时兼容了 css 的写法。

```bash
yarn add sass
```

```typescript
// src/main.ts
import './index.scss'
// ...
```

#### element-plus

> [快速上手 | Element Plus](https://element-plus.org/#/zh-CN/component/quickstart)

UI 组件库预置了许多常用的组件，我们可以快速使用它们来构建自己想要的功能原型。（当然我们仍然可以自定义它们。）

```bash
yarn add element-plus
```

再加上我们之前引入的东西，最后 `src/main.ts` 看起来应该是这个样子。

```typescript
// src/main.ts
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import scss
import './index.scss'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)
app.use(ElementPlus).use(router).use(store)
app.mount('#app')
```

好了，基础的行李们已经准备完毕了，让我们出发吧！

### 改造为 `setup` 语法

此前我们虽然使用了 Vue3，但基本的语法仍旧是沿用 Vue2 的形式。

但 Vue3 支持了名为 `setup` 的语法糖（它会对脚本进行预编译），我们可以少写许多代码。

譬如原先的代码：

```html
<script>
  export default {
    data() {
      return {
        a: 1,
      };
    },
    methods: {
      printInfo() {
        console.log(this.a);
      },
    },
  };
</script>
```

改造后的代码（是不是简洁了些？）：

```html
<script setup>
  import { ref } from "vue";
  const a = ref(1);
  const printA = () => {
    console.log(a.value);
  };
</script>
```

### 表单

让我们试着借助此前准备好的工具包，构建一个表单功能吧！

---

To Be Continued.
