---
title: Vue
date: 2021-04-28 16:27:24
updated: 2021-04-28 16:27:24
layout: slide
slide:
  theme: white
  config:
    history: true
    mouseWheel: true
iconify: true
---

<link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">

<!-- 6-最后一节课讲解数据来源，数据质量，数据清洗过程，实现细节，创意设计，可以准备 PPT，互评打分（给每个同学打分，不给自己和同组的同学打分，60%分值） -->

## Vue 与 Vite 之旅

![logo.png](https://vuejs.org/images/logo.png)

<small>
目前最快速、最流行的前端方案之一
</small>

---

> 为什么不试试神奇的 JavaScript 呢？

<img src="https://upyun.yunyoujun.cn/images/why-not-ask-the-magic-conch.jpg" width="300" alt="为什么不问问神奇海螺呢？" />

~~

<span class="iconify" data-icon="simple-icons:ri-flask-line"></span>

更未来一点的方案

---

## 纪念品

我们要整点啥？

- GitHub: [vue-d3-demo](https://github.com/YunYouJun/vue-d3-demo)
- 示例页面: [vue-d3-demo](https://yunyoujun.github.io/vue-d3-demo/)

~~

<iframe width="1000" height="666" src="https://yunyoujun.github.io/vue-d3-demo/">

---

## 行李清单

首先准备好我们旅行的行李清单

~~

## 闻道有先后

本教程开发的前置基础环境，尽管你可能已经早已安装好了它，但以防万一，还是再作提醒。

~~

- <span class="iconify" data-icon="simple-icons:visualstudiocode"></span> VSCode
- <span class="iconify" data-icon="simple-icons:git"></span> Git
- <span class="iconify" data-icon="simple-icons:node-dot-js"></span> Node.js
- <span class="iconify" data-icon="simple-icons:yarn"></span> Yarn

~~

### VSCode

<span class="iconify" data-icon="simple-icons:visualstudiocode"></span> + <span class="iconify" data-icon="simple-icons:git"></span> + <span class="iconify" data-icon="simple-icons:gnubash"></span>

本教程开发的前置基础环境，尽管你可能已经早已安装好了它，但以防万一，还是再作提醒。

[VSCode](https://code.visualstudio.com/) + [Git](https://git-scm.com/) + Bash

宇宙最强编辑器，没有之一

~~

### <span class="iconify" data-icon="simple-icons:node-dot-js"></span> [Node.js](https://nodejs.org/)

前端必备，请认准 `LTS` 版本。

~~

### <span class="iconify" data-icon="simple-icons:npm"></span> [npm](https://www.npmjs.com/) VS <span class="iconify" data-icon="simple-icons:yarn"></span> [yarn](https://www.yarnpkg.com/zh-Hans/)

他们都是包管理工具，NPM 已随 Node.js 默认安装。

NPM 与 Yarn 的关系，你可以理解为谷歌应用商店和酷安（或其他手机应用商店）的关系。

<!-- Yarn 可选，但我建议你不妨试一试。 -->

<!-- 后续的内容也将以此为展开，当然你也可以执拗地使用 `npm run` 替代教程中的 `yarn`。 -->

~~

### [Vue](https://github.com/vuejs/vue)

<h2><span class="iconify" data-icon="simple-icons:vue-dot-js"></span></h2>

The Progressive JavaScript Framework

目前最为流行的前端框架之一

不可否认的是它相比 <span class="iconify" data-icon="simple-icons:react"></span> React 学习曲线要更为平缓

~~

### [Vite](https://github.com/vitejs/vite)

<span class="iconify" data-icon="vscode-icons:file-type-vite"></span>

Native-ESM powered web dev build tool. It's fast.

面向未来的前端构建工具。

~~

当然，后续我们会再详细介绍其在旅途中的功用。

---

## 旅行指南

<span class="iconify" data-icon="ri:treasure-map-line"></span>

~~

### 前端 VS 后端

分离！！！

后端 --JSON--> 前端

![这个锅我不背](https://upyun.yunyoujun.cn/images/it-is-not-my-pot.jpg)

~~

<img width="450" src="https://i.loli.net/2020/11/23/BMjg6K2dzsZpHSo.jpg" />

~~

<span class="iconify" data-icon="simple-icons:webpack"></span>
VS
<span class="iconify" data-icon="vscode-icons:file-type-vite"></span>

<img width="500" src="https://i.loli.net/2020/11/23/6jbnHI3kRfdlZXx.png" />

~~

`Vite` Yes!

`Apache/Tomcat` No!

开发环境服务器

- 热重载
- Fast
- 优化地构建
- 插件...

~~

> 总之，先出发吧！

---

## 出发

~~

### Vite 站

启动 脚手架

生成预置的快速启动模板

```bash
yarn create @vitejs/app a-test-app
```

~~

```bash
yarn dev
```

> <http://localhost:3000>

<img src="https://i.loli.net/2020/11/23/Ri2lGMXZ1Bubzar.png" width="500" alt="vite-demo"/>

---

## 谢谢

<i class="ri-emotion-line"></i>

敬请老师和各位同学指正
