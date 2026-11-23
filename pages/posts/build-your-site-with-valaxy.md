---
title: 用 Valaxy 从零搭建一个属于自己的网站
date: 2026-11-20
updated: 2026-11-24
outline: [2, 3]
cover: /images/valaxy-guide/cover-editorial.webp
coverComponent: ValaxyGuideCover
description: "六年前我写过一篇用 Hexo 从零建站的教程，这篇是换成 Valaxy 的新版。从准备环境、写下第一篇文章，到用 GitHub Pages 把网站发布出去，一步步带你搭出自己的博客。如果你已经在用 Hexo，文末也有一份迁移对照。"
categories:
  - 云游的小安利
tags:
  - 教程
  - Valaxy
  - 分享
---

> 写给想要拥有一个自己的网站但囊中羞涩的小白与曾经的自己。
>
> 这是 2020 年那篇《[教你如何从零开始搭建一个属于自己的网站](/posts/how-to-build-your-site)》的 2026 新版。

## 前言

虽说是网站，对于个人来说，或许一般叫作博客。但我不希望它仅仅是一个博客，而是能够成为一个处于自己现实生活之外、自由、实验、不用畏惧他人眼光甚至可以独断专行的地方。

这一点，六年过去了，依然没有变。

---

但自那以来，框架与技术栈已经发生了翻天覆地的变化。

[<span class="inline-tech-icon i-logos-react" aria-hidden="true"></span>React](https://react.dev/) / [<span class="inline-tech-icon i-logos-vue" aria-hidden="true"></span>Vue](https://vuejs.org/) / [<span class="inline-tech-icon i-logos-svelte-icon" aria-hidden="true"></span>Svelte](https://svelte.dev/) / [<span class="inline-tech-icon i-logos-solidjs-icon" aria-hidden="true"></span>Solid](https://www.solidjs.com/) 前端框架层出不穷，各领风骚。但如今却被 AI 洪流逐一碾过，悄无声息。

AI 时代，个人博客是否真的有意义呢？
我想，答案依然是肯定的。

当然，有些答案也逐渐发生了变化。

## 我们还需要框架吗？

2020 年写旧文时，我用的是 [<span class="inline-tech-icon i-logos-hexo" aria-hidden="true"></span>Hexo](https://hexo.io/)、[<span class="inline-tech-icon i-ri-cloud-line" aria-hidden="true"></span>hexo-theme-yun](https://github.com/YunYouJun/hexo-theme-yun)、[<span class="inline-tech-icon i-simple-icons-github" aria-hidden="true"></span>GitHub Pages](https://pages.github.com/) 和 [<span class="inline-tech-icon i-logos-travis-ci" aria-hidden="true"></span>Travis CI](https://www.travis-ci.com/)。后来我自己动手做了 [<span class="inline-tech-icon inline-tech-icon--valaxy" aria-hidden="true"></span>Valaxy](https://valaxy.site/zh/guide/why)，现在我的博客就跑在它上面。

所以这篇文章换了一条主线：**用 Valaxy 从零搭一个站**。

为什么换成 Valaxy？这几年维护自己的博客，顺手把写文章时在意的几件事也做进了 Valaxy：

- **Vite + Vue 3 开发体验**：本地启动与热更新足够快；修改配置、文章、标签或分类时，浏览器能立刻看到变化，也可以接着复用 Vue / Vite 的插件生态。
- **TypeScript 类型提示**：`site.config.ts` 和 `valaxy.config.ts` 都带类型定义，忘了哪一项是做什么的，鼠标放上去就能看说明。
- **交互式文章**：Markdown 里可以直接写 Vue 组件，不用只靠纯文字配图。从顶部会随亮暗模式切换、可点开轨道动效的封面，到正文里的路线图、模拟终端、配置预览和部署演示，都是直接运行的 Vue 组件。
- **顺手的 AI 协作**：脚手架自带 `AGENTS.md` 让编程助手看懂站点约定；后面还会讲怎么生成 `llms.txt`，以及怎么用 MCP 检查文章里的断链和图片。

<!-- more -->

到了 AI 时代，热更新和类型提示早就不算什么新鲜事，但平时写文章，这些顺手的小细节依然很省心：改完保存立刻能看到效果，偶尔想加个交互演示，让 AI 帮写个组件丢进 `components/` 就能直接用。

不过，具体写什么、怎么写，还是自己说了算。

> Hexo 依然是一个很棒的博客框架，我的博客就是在它上面长大的。如果你现在用着顺手的 Hexo 主题或插件，继续用完全没问题；如果想换一套基于 Vite 和 Vue 的工作流，Valaxy 可以是另一个选择，我也会一直维护它。

这依然是一篇新手向教程，我会尽量保持「点到为止」：讲清楚每一步在干嘛，但不会细讲安装时怎么点下一步。已经有基础的同学可以大胆跳读。

当然，现在你也可以把这篇文章直接丢给 AI 助手，让它陪你一步步把站搭好。如果实际运行脚手架时界面细节略有变化，以 [Valaxy 官方文档](https://valaxy.site/zh/guide/getting-started) 为准。

> 注释处多为补充说明，对正常建站没有影响，不想看可以直接略过。

### 顺便科普：静态博客和动态博客有什么区别？

- **动态博客**（如 WordPress、Typecho、Ghost）：文章存在数据库里，每次有人访问，服务器都要查询数据库并实时拼出网页。自带管理后台很方便，但你需要自己租服务器并维护运行环境。
- **静态博客**（如 Valaxy、Hexo、Hugo）：文章就是本地的 Markdown 文件，发布前一次性构建成纯 HTML / CSS / JS。访问时直接返回现成的页面，**不需要自己的后端服务器**，可以免费托管在 GitHub Pages 上，打开速度通常也更快。

> 很多人看到「静态」会以为页面只能是纯文字、不能交互。其实「静态」指的是**页面不需要后端服务器实时渲染**，而不是浏览器里不能动。
>
> Valaxy 生成的页面本身就运行着 Vue，做动画和交互演示都很方便；只有评论区这类需要跨访客存数据的功能，才需要接入第三方服务。

### 技术栈

<ValaxyGuideTechStack />

## 步骤

第一次搭站，按下面这五步走就行：准备环境、创建并预览、改基础配置、写第一篇文章、部署上线。走完这一套，网站就正式上线了；后面的进阶玩法和常见问题，等有需要再回来看。

<ValaxyGuideRoadmap />

### 准备环境

开工前先准备三件基础工具：**Node.js**（`>=22.12.0`）、**pnpm**（`>=10.26.0`）、**Git**，外加顺手的编辑器 **VS Code**。

后文说「输入命令」，都是指打开终端（Windows 用 PowerShell 或命令提示符，macOS 用「终端」）输入。

按下面卡片里的官网链接装好后，可以顺手勾选记录进度；装完也可以复制底部的命令检查一下版本：

<ValaxyGuideEnvChecklist />

### 一条命令建站

旧文里，这一步要装 `hexo-cli`、`hexo init`、`npm install`、再装主题、再装渲染器……现在只要一条命令。

先进入你打算放网站代码的文件夹，然后输入：

```bash
pnpm create valaxy@latest
```

> `create` 是 pnpm 的一个小技巧：`pnpm create xxx` 会去下载并运行名为 `create-xxx` 的脚手架包。「脚手架」就是帮你生成项目模板的工具。

接下来会出现几个问题，你可以先在下面这个模拟终端里用方向键或点击试选一遍，改改项目目录名，再点端口预览本地首页：

<ValaxyGuideCli />

1. `Select a type`：选 **Blog**（我们是来搭博客的）。
2. `Select a theme`：选 **Yun**（默认的博客主题，也是我自己在用的）。`Press` 是偏文档风格的主题，`Custom` 可以输入自定义主题名。
3. `Project name`：项目文件夹名，比如 `valaxy-blog`；如果要部署到 GitHub Pages 的根路径，也可以直接写成 `你的用户名.github.io`（后面会讲）。
4. `Install and start it now?`：建议新手先选 **No**，再依次手动执行那三条命令：`cd 目录名`、`pnpm install`（安装依赖）和 `pnpm dev`（启动本地开发服务器），这样能更清楚每一步在做什么。

> 脚手架生成的 `pnpm-workspace.yaml` 记录了依赖安装的构建权限，请保留它，不要删。

启动后打开终端里 `Preview` 后面的地址（默认 `http://localhost:4859/`，按 `Ctrl + C` 可以停止服务），首页能看到竖排大字「我的小站」，往下翻就是示例文章《Hello, Valaxy!》：

![Valaxy 脚手架首页，可见示例文章《Hello, Valaxy!》](/images/valaxy-home.png)

#### 热更新体验一下

保持 `pnpm dev` 运行，用 VS Code 打开项目修改 `valaxy.config.ts` 或 `pages/posts/hello-valaxy.md`，**保存后浏览器就会局部刷新**。不光文章文字、标签和分类，主题配色和首页大字也能即时生效（封面上组件写死的文案除外）：

![把示例文章标题改成「你好，Valaxy！」后，页面立即更新](/images/valaxy-hmr.gif)

> 这是我做 Valaxy 的最初动机之一：Hexo 每次改完要重新生成、整页刷新，而基于 Vite 的现代框架早就能做到「保存即所见」了。

#### 看看生成了什么

打开项目目录时，文件看起来可能有点多。一开始其实只要关心标着「必改」的那几项，点选下面的文件就能看各自的作用（需要纯文本目录树的话，点右下角可以一键复制）。

<ValaxyGuideFileTree />

> 脚手架还生成了 `Dockerfile` 和 `nginx.conf`，如果你想把站点放到自己的服务器上，可以用它们。新手可以忽略。

大部分情况下，你只需要在 `pages` 文件夹下写文章，在两个配置文件里改改选项。

### 配置

Valaxy 的配置分成两个文件。

- `site.config.ts`：**站点信息**，比如标题、作者、描述、网址，这部分和主题无关。
- `valaxy.config.ts`：**主题和框架的配置**。

#### 站点信息

打开 `site.config.ts`，修改标题、作者和描述：

```ts
import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://你的域名/',
  lang: 'zh-CN',
  timezone: 'Asia/Shanghai',
  title: '我的博客',
  author: {
    name: '小明',
    avatar: '/images/avatar.jpg', // 头像
    email: 'you@example.com',
    link: 'https://你的域名/',
  },
  description: '记录生活与技术。',
})
```

> `url` 是你的站点**最终上线的地址**，用来生成文章链接、站点地图、RSS 和 `llms.txt`。新项目里它是占位的 `https://example.com/`，上线前记得换成你自己的。它不会改变本地开发服务器的地址。

> 头像放在哪？Hexo 里是 `source/images`，Valaxy 里把图片放进项目的 `public/images/` 文件夹，然后用 `/images/avatar.jpg` 引用即可。`public` 下的文件会原样复制到最终的站点里。也可以用图床，直接填在线链接。

#### 主题配置

还记得旧文里让大家新建 `_config.yun.yml` 吗？那是一个 YAML 文件，写错缩进或字段名要等运行时才发现。

现在这些都写在 `valaxy.config.ts` 里。比如把主题色换成黑色：

```ts
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

export default defineValaxyConfig<UserThemeConfig>({
  theme: 'yun',

  themeConfig: {
    colors: {
      primary: '#000000',
    },
    banner: {
      enable: true,
      title: '我的小站',
    },
  },
})
```

保存，主题色就变了。

还没搭好本地环境也没关系，先在下面这个小实验室里调一下标题、主题色或首页大字，点一点代码里带下划线的字段，直接感受一下热更新和类型提示：

<ValaxyGuideConfigPlayground />

> 这个 `defineValaxyConfig<UserThemeConfig>` 就是类型提示的来源。在 VS Code 里把鼠标悬浮在 `colors`、`primary` 这些字段上，就能看到注释和默认值；输入时还会自动补全。写错字段名，编辑器会直接标红。比起去翻 YAML 文档，是不是友好不少？

> `.ts` 是 TypeScript 的后缀名，TypeScript 可以简单理解成「带类型的 JavaScript」。你不需要系统学它，照着模板改值就行。

更多配置请看 [站点配置与主题配置](https://valaxy.site/zh/guide/config/)，或者直接在编辑器里顺着类型提示探索。

### 开始写作

#### 文章

文章都放在 `pages/posts/` 文件夹下，每个 Markdown 文件就是一篇文章。你可以直接新建 `pages/posts/first-post.md`，也可以用命令生成：

```bash
pnpm exec valaxy new first-post
```

> `md` 是 `Markdown` 的后缀名，是一种简洁方便的文本标记语言，只要记住几个简单语法就能写出排版不错的文章。它介于 Word 和 TXT 之间：Word 太重，TXT 又没有标题、加粗这些功能。

文章顶部用 `---` 包起来的区域叫 **frontmatter**（文章元数据），下面才是正文：

```md
---
title: 我的第一篇文章
date: 2026-11-20
tags:
  - 日常
categories:
  - 随笔
description: 这是我的第一篇文章。
---

## 你好，Valaxy

这是我的第一篇文章。
```

保存后，首页的文章列表会立刻更新。

![左边是 Markdown 标题，右边是带 Valaxy 标识和同一标题的博客预览](/images/valaxy-guide/first-page.webp)

> 文章标题下面如果想控制首页展示的摘要，可以在正文里加一行 `<!-- more -->`，它前面的内容会作为摘要。注意 `more` 前后要有空格。

#### 标签与分类

和旧文一样，标签（`tags`）和分类（`categories`）直接写在 frontmatter 里。比如本文头部是这样的：

```md
---
title: 用 Valaxy 从零搭建一个属于自己的网站
date: 2026-11-20
tags:
  - 教程
  - Valaxy
  - 分享
categories:
  - 云游的小安利
---
```

脚手架里已经带了「标签」「分类」「归档」页面，文章里写了对应字段，它们就会自动更新。

> 更多可以写在 frontmatter 里的选项（比如 `top` 置顶、`hide` 隐藏、`draft` 草稿等）见 [文章 | Valaxy](https://valaxy.site/zh/guide/post)。

#### 构建并预览

写完文章，想看看最终效果，可以构建一次：

```bash
pnpm build
pnpm serve
```

- `pnpm build` 会预渲染所有页面，把纯静态文件输出到 `dist/` 文件夹。
- `pnpm serve` 会在本地预览刚刚构建好的 `dist/`，默认地址是 `http://localhost:4173/`（以终端输出为准）。它不会重新构建，改了东西需要重新 `pnpm build`。

> `dist` 就是旧文里 Hexo 生成的 `public` 文件夹的对应物，也就是你网站的全部静态文件。GitHub Pages 这类服务只认纯静态文件，所以我们要先构建。

### 部署

终于到了把网站放到线上的时候。Valaxy 构建出来的就是普通的静态文件，所以能放的地方非常多。

#### GitHub Pages（白嫖首选）

##### 注册 GitHub 并新建仓库

> GitHub 是全世界最大的开源项目与代码托管平台，同时也是众多开发者的交流场所。代码托管用的正是前面提到的 Git。（还是全球最大的同性交友网站。）它提供的 GitHub Pages 可以免费托管静态网站。

注册并登录 [GitHub](https://github.com/)，点击右上角的 `+` -> `New repository` 新建仓库。

- 如果你想用 `https://你的用户名.github.io` 这个地址，仓库名必须是 `你的用户名.github.io`。
- 其他仓库名也可以，那就是「项目站点」，地址是 `https://你的用户名.github.io/仓库名/`，需要额外配置 `base`，见下面的提示。

> 注册时的英文用户名将成为你的免费域名前缀，取名需谨慎。

##### 推送源码

在项目目录下：

```bash
git init
git add -A
git commit -m ":tada: init"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

> 如果觉得每次都要敲 `git add` / `commit` / `push` 很烦，也可以像旧文那样写个脚本，或者直接用 VS Code 左侧的源代码管理面板，点点鼠标就行。

> 这一步以前叫「备份」。等选好发布来源，以后每次推送也会触发部署。

##### 开启自动部署

到 GitHub 仓库的 `Settings` → `Pages`，把 `Build and deployment` 下的 `Source` 设为 **GitHub Actions**。

脚手架已内置 `.github/workflows/gh-pages.yml`（可参考[官方模板](https://github.com/YunYouJun/valaxy/blob/v1.5.0/packages/create-valaxy/template-blog/.github/workflows/gh-pages.yml)）：推送到 `main`、`master` 或 `valaxy` 分支时，Actions 会自动安装依赖、构建 `dist/` 并发布到 GitHub Pages。

可以在下面点「模拟一次 git push」看每一步怎么跑，也可以切到 `my-blog` 看看子路径忘了配 `base` 会怎样：

<ValaxyGuideDeployPipeline />

> 什么是持续集成（CI）？可以理解为「把代码推上去，让平台自动完成构建和发布」。旧文里用的是 Travis CI，现在直接用 GitHub Actions 就够了。所需权限已经写在工作流文件里。

推送之后，可以切到仓库顶部的 `Actions` 标签页查看构建日志和部署状态。如果第一次部署没跑起来，打开 `GitHub Pages` 工作流，点一次 `Run workflow`。

- 源码用自定义分支的话，记得修改 `.github/workflows/gh-pages.yml` 里的 `on.push.branches`。
- 保留工作流里的 `fetch-depth: 0`。Valaxy 可以用 Git 提交时间作为文章日期，浅克隆拿到的历史可能不够。
- 如果项目还在用 1.2.2 那套工作流，迁移时对照上面的模板和[同版本的 package.json](https://github.com/YunYouJun/valaxy/blob/v1.5.0/packages/create-valaxy/template-blog/package.json)一起调整。先核对 Node.js 和 `packageManager`。

等 `Actions` 里的构建和部署步骤都显示通过后，打开 `https://你的用户名.github.io`（或在部署记录里点击生成的页面链接），就能看到已经上线的网站了。

> 使用 HTTPS，建议开启强制跳转：`Settings` -> `Pages` -> `Enforce HTTPS`。

> **项目站点注意：** 如果仓库名不是 `你的用户名.github.io`，站点会部署在子路径下，需要在 `valaxy.config.ts` 里配置 `base`：
>
> ```ts
> export default defineValaxyConfig({
>   siteConfig: {
>     url: 'https://你的用户名.github.io/仓库名/',
>   },
>   vite: {
>     base: '/仓库名/',
>   },
> })
> ```
>
> 详见 [部署指南](https://valaxy.site/zh/guide/deploy)。

#### Netlify / Vercel / Cloudflare Pages

不想用 GitHub Pages？这几个平台也都可以免费托管静态站点，而且都遵循 **「连接仓库 → 执行 `pnpm build` → 发布 `dist/`」** 这一套流程，切到下面对应平台就能看配置和步骤：

<ValaxyGuideHostMatrix />

更多平台细节（包括 Render、Nginx、Docker）见 [部署 | Valaxy](https://valaxy.site/zh/guide/deploy)。

## 进阶与迁移

小站上线后，想再折腾一点，可以从这里挑着看。下面几节分别聊怎么在文章里用 Vue 组件、怎么配合 AI 使用，以及已有的 Hexo 博客怎么搬过来。

### 在 Markdown 里写 Vue 组件

这是 Valaxy 和很多博客框架最大的不同之一：**`components/` 目录下的 Vue 组件会自动注册，直接就能在 Markdown 里当标签用**。前面出现过的那些交互演示，全都是靠这个机制嵌进正文里的。

新建 `components/HelloCounter.vue`：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button class="rounded px-4 py-2 bg-blue text-white" @click="count++">
    你已经点了 {{ count }} 次
  </button>
</template>
```

然后在任意文章里直接用：

```md
下面是一个可以点的按钮：

<HelloCounter />
```

> 文章里写的 `class="rounded px-4 ..."` 这种是 UnoCSS 的原子化 CSS（类似 TailwindCSS），Valaxy 内置了，Markdown 和组件里都能直接用。

> 除了正文，文章封面也能直接用 Vue 组件。本文顶部的封面就是 `components/covers/ValaxyGuideCover.vue`，在 frontmatter 里加一行 `coverComponent: ValaxyGuideCover` 就能同时渲染到文章页顶部和首页卡片——既能跟着 `html.dark` 适配亮暗模式，也能直接点开轨道动画，同时保留 `cover` 作为兜底和社交分享图。脚手架自带的示例文章《Hello, Valaxy!》也用了同样的机制。更多用法见文档：[图片与 Vue 组件封面](https://valaxy.site/zh/guide/post#cover) 与 [在 Markdown 中使用 Vue](https://valaxy.site/zh/guide/markdown#using-vue-in-markdown)。

再试试下面这个组件（源码在 `components/ValaxyWritingFlow.vue`，文章里只写了一行 `<ValaxyWritingFlow />`）：

先在右侧预览里点几次计数按钮，再改掉左侧标题并按 `Ctrl / ⌘ + S` 保存，可以看到标题会局部更新，但计数不会清零。也可以点底部的「模拟整页刷新」做个对比，或切到第二个标签看看 `<!-- more -->` 是怎么截取首页摘要的。

<ValaxyWritingFlow />

顺带一提，这也是我在开头说「有些答案发生了变化」的其中一个原因。

以前想在博客里加几个交互演示，写代码、调暗黑模式和各种细节，花的时间往往比写正文还多，大多数时候想想就算了。现在纯文字教程越来越容易生成，但反过来，写一个小组件丢进 `components/` 的门槛也低了很多——你只需要想清楚想让读者体验什么，具体实现可以让 AI 帮着写。

而且静态博客把文章、组件和样式都放在同一个仓库里，改完立刻能热更新预览，上线也不用操心后端服务，做交互式文章反而很顺手。

页面上可以是能直接上手玩的交互演示，底层依然是干净的 Markdown 原文（顺便也方便 AI 读取）。技术栈换了一轮又一轮，但能把自己的想法做成点开就能互动的小东西，博客这件事好像又变得更有意思了。

### AI 时代的新玩法

旧文写的时候，ChatGPT 还没有出现。现在写博客、改站点，很多人都会让 AI 帮一把。Valaxy 在这方面也做了一些准备，详见 [与 AI 协作](https://valaxy.site/zh/guide/work-with-ai)。

#### AGENTS.md：给 AI 看的说明书

还记得目录里那个 `AGENTS.md` 吗？它是写给编程助手（比如 Cursor、Claude Code 等）看的说明文件，里面列出了常用命令、该改哪些文件、`llms.txt` 的作用等。让 AI 帮你改站点时，它会先读这份文件，不容易乱改不该动的地方。

> 你也可以安装 Valaxy 的 Agent Skills（实验性功能），让 AI 更懂 Valaxy 的配置、主题和插件：
>
> ```bash
> npx skills add YunYouJun/valaxy
> ```

#### llms.txt：让 AI 读懂你的博客

脚手架生成的新项目，在 `site.config.ts` 里默认设置了：

<!-- eslint-skip -->
```ts
llms: {
  enable: true,
},
```

这样 `pnpm build` 之后，`dist/` 里会多出：

- `llms.txt`：站点索引，列出所有文章的标题、描述和链接；
- `llms-full.txt`：所有文章的全文；
- 每篇文章对应的原始 Markdown 文件。

> `llms.txt` 是给大语言模型读的「站点说明」，有点像给 AI 看的 `sitemap.xml`。

要注意：开启后，**文章的 Markdown 原文会随站点一起公开**。如果你不想这样，把 `llms.enable` 改成 `false` 即可。

#### MCP：让 AI 帮你检查文章

这个默认是关闭的，需要你手动开。在 `valaxy.config.ts` 里加上（模板里已经有这行注释，取消注释即可）：

```ts
export default defineValaxyConfig<UserThemeConfig>({
  mcp: true,
})
```

重新运行 `pnpm dev`，终端里会多出 MCP 的地址和需要设置的请求头，类似：

```text
  ➜  Valaxy MCP (read-only): http://localhost:4859/__valaxy_mcp
     Client header: Origin: http://localhost:4859
```

以 Cursor 为例，在项目里添加 `.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "valaxy": {
      "url": "http://localhost:4859/__valaxy_mcp",
      "headers": {
        "Origin": "http://localhost:4859"
      }
    }
  }
}
```

连接成功后，AI 可以用这些**只读**工具：

| 工具 | 用途 |
| --- | --- |
| `valaxy_list_posts` | 列出文章元数据 |
| `valaxy_search_pages` | 在标题、描述和正文里搜索 |
| `valaxy_read_page` | 读取某个页面的正文 |
| `valaxy_list_collections` | 列出合集目录 |
| `valaxy_inspect_page` | 查看某页最终的路由、布局等解析结果 |
| `valaxy_check_page` | 检查元数据、路由冲突、布局、本地链接和图片，并给出修复建议 |

然后你就可以直接对 AI 说：

> 列出我的博客文章，检查第一篇的最终路由、布局和本地链接，并根据诊断修复 Markdown。

比如你在写一篇周末随记，顺手链到一个还没建的本地页面。连上 MCP 后，AI 调用 `valaxy_check_page` 检查这篇文章，就能找出这个断链、标出对应的行号，并附上排查提示（点击下面带波浪线的链接就能看到）：

<ValaxyGuideMcpCheck />

几点需要知道的：

- MCP 只在 `pnpm dev` 时运行，生产构建不包含它。
- 它只接受本机连接，并且只读，不能创建文章、改文件或执行命令。
- 默认不会暴露草稿、隐藏页面和加密页面。

> 不想开 MCP 也行，同样的检查可以直接用命令行：
>
> ```bash
> pnpm exec valaxy check --file pages/posts/hello-valaxy.md
> ```

### 从 Hexo 迁过来

如果你和当年的我一样，博客在 Hexo 上，想换一套更现代的开发体验，可以参考下面的对应关系（<span class="inline-tech-icon i-logos-hexo" aria-hidden="true"></span>Hexo → <span class="inline-tech-icon inline-tech-icon--valaxy" aria-hidden="true"></span>Valaxy）：

| 用途 | Hexo | Valaxy |
| --- | --- | --- |
| 文章 | `source/_posts` | `pages/posts` |
| 页面（Markdown / HTML） | `source` | `pages` |
| 静态资源（图片、`CNAME` 等） | `source` | `public` |
| 站点配置 | `_config.yml` | `site.config.ts` |
| 主题配置 | `_config.yun.yml` 等 | `valaxy.config.ts` 的 `themeConfig` |
| 本地预览 | `hexo server` | `pnpm dev` |
| 新建文章 | `hexo new post xxx` | `pnpm exec valaxy new xxx` |
| 构建 | `hexo generate` | `pnpm build` |
| 输出目录 | `public` | `dist` |
| 部署 | `hexo-deployer-git` / CI | GitHub Actions 等（脚手架自带） |

> 文章的 Markdown 和 frontmatter 大多可以直接复制过去；但 Hexo 的主题无法直接在 Valaxy 上运行，需要换成 Valaxy 的主题（比如 Yun）。
>
> 另外 Valaxy 的 Markdown 解析基于 `markdown-it`，如果遇到换行之类的细节差异，可以看迁移文档里的常见问题。

- 完整的迁移步骤：[从其他博客框架迁移](https://valaxy.site/zh/migration/)（页面里还有一个「AI 迁移助手」，选好原框架，复制提示词给 AI 就行）。
- 想对比 Valaxy、Hexo 和 VitePress 各自适合什么场景：[VitePress 能做博客吗？](https://valaxy.site/zh/guide/vitepress)、[静态博客框架怎么选](https://valaxy.site/zh/guide/choose)。
- 我自己博客的迁移就是一个真实案例，可以对比 [yunyoujun.github.io](https://github.com/YunYouJun/yunyoujun.github.io) 仓库的 `hexo` 分支和 `valaxy` 分支。

> 如果某个 Hexo 主题或插件对你来说就是不可替换的，留在 Hexo 也是很好的选择。工具是为人服务的。
>
> （但如今，我想用 AI 重写实现类似的功能应该不是什么难事。）

## FAQ

### 如何绑定你的自定义域名？

首先，你得有个自己的域名。

> 避免广告嫌疑，你可以自行前往相关域名提供商购买。

对于 GitHub Pages：

1. 在域名服务商处，使用 `CNAME` 解析到 `你的用户名.github.io`。（当然 `A` 记录直接解析到 GitHub Pages 的 IP 地址也可以，具体见 [官方文档](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。）
2. 打开仓库的 `Settings` -> `Pages`，在 **Custom domain** 里填上你的域名（比如 `blog.example.com`），点 Save。
3. 把 `site.config.ts` 里的 `url` 改成你的域名。

> 以前走 `gh-pages` 分支发布时，需要在 `public/` 下放一个 `CNAME` 文件，不然下次部署会把后台自动生成的文件覆盖掉。
>
> 现在改成 GitHub Actions 发布了。按 [GitHub 的说明](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)，这种方式不再使用 `CNAME` 文件（放了也会被忽略），直接在 Pages 设置里填写自定义域名就行。

Netlify、Vercel、Cloudflare Pages 绑定域名则在各自的控制台里添加即可。

### 评论系统怎么办？

静态博客本身没有后端，所以评论需要借助第三方服务。Valaxy 提供了官方插件（Addon）：

- [Waline](https://valaxy.site/zh/addons/official/waline)：依赖服务端，可以托管在 Vercel 等平台上。
- [Twikoo](https://valaxy.site/zh/addons/official/twikoo)：同样是需要部署服务端的评论系统。
- Utterances：基于 GitHub Issues，通过挂载脚本集成。

以 Waline 为例，安装 `valaxy-addon-waline` 后，在 `valaxy.config.ts` 里：

```ts
import { defineValaxyConfig } from 'valaxy'
import { addonWaline } from 'valaxy-addon-waline'

export default defineValaxyConfig({
  siteConfig: {
    comment: {
      enable: true,
    },
  },
  addons: [
    addonWaline({
      serverURL: 'https://your-waline-url',
    }),
  ],
})
```

> 完整步骤见 [第三方评论系统 | Valaxy](https://valaxy.site/zh/guide/third-party/comment-system)。我个人对各评论系统的看法写在 [第三方评论系统之我见](https://www.yunyoujun.cn/posts/third-party-comment-system)。

### 备案

想使用中国内地的云服务器或国内 CDN 时，不备案确实寸步难行；不过动手前先区分一件事：**你的站点是不是托管在中国内地**。

如果你只是把站点放在 GitHub Pages、Netlify、Vercel 或 Cloudflare Pages 上，服务器在境外，一般**不需要**做工信部的 ICP 备案（绑自定义域名也是如此）；只有用到中国内地云服务器或把域名解析到内地 CDN 节点时，才需要先完成 ICP 备案。

<details>
<summary>展开查看：2026 国内云资源门槛、页脚配置与公安备案说明</summary>

- **国内接入规则与门槛（2026 参考）**：需按《[非经营性互联网信息服务备案管理办法](https://www.miit.gov.cn/gyhxxhb/jgsj/cyzcyfgs/bmgz/xxtxl/art/2024/art_84a0cfa0ebd049bbbe751dca9a008e56.html)》履行备案手续（入口：[ICP/IP地址/域名信息备案管理系统](https://beian.miit.gov.cn/)）。接入商代交备案不收费，但要求自备符合条件的中国内地云资源（旧文里「用学生优惠买 1 个月服务器」的做法如今已不适用）：
  - [腾讯云](https://cloud.tencent.com/document/product/243/18908)：中国境内包年包月且购买时长不少于 3 个月（含续费）、备案期间剩余有效期不少于 1 个月，且具备公网 IP。
  - [阿里云](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/overview)：中国内地节点包年包月，购买时长大于 3 个月（含续费累计）并购买公网带宽；免费试用 ECS 不能备案。
- **个人备案注意事项**：个人性质通常只能做个人博客或个人空间（见 [腾讯云说明](https://cloud.tencent.com/document/product/243/19628)），域名需完成实名认证且为工信部批复后缀；各地管局要求有差异，办理前请以接入商与当地管局规则为准。

备案通过后，页脚必须展示备案号并链接回 `https://beian.miit.gov.cn/`。Valaxy 的 Yun 主题已经在 `valaxy.config.ts` 里预留了开关（默认关闭）：

<!-- eslint-skip -->
```ts
footer: {
  beian: {
    enable: false, // 备案成功后改成 true
    icp: '', // 填写你的备案号
  },
},
```

- **关于公安备案**：另外还有一套独立的 **公安联网备案**，要在 [全国互联网安全管理服务平台](https://beian.mps.gov.cn/) 办理。阿里云文档指出 ICP 备案通过、网站开通后 30 天内应完成公安备案；即使服务器在境外无需 ICP 备案，若面向中国内地提供服务，同样建议完成公安备案（见 [阿里云 ICP 备案流程概述](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/icp-filing-application-overview)）。具体以当地公安机关与平台说明为准。

</details>

### 视频？

依然没有视频，一是懒，二是文字更利于更新勘误。

## 结语

六年前我写下这篇教程的时候，想的是：个人网站可以用来记录生活、回忆、创作、学习笔记、开发经验，包括作为一个试验平台。可以与熟悉的人分享，也可以作为另一个世界另一个自己的展示。

六年后，工具换了许多，这个想法一点没变。AI 很擅长写出工整的答案，但它无法替你记住某个普通夜晚的心情；留在这个域名下的，才是真正属于你自己的时间切片。

多年后回看自己当初写下的内容，未尝不是件有趣的事情。

善始者众，善终者寡。

> 臣闻善作者，不必善成；善始者，不必善终。「史记·乐毅列传」

能一直写当然很好。忙起来停一阵也没关系，小站会在那里等你。

从 2019 年写出 `hexo-theme-yun`，到 2022 年立项 Valaxy 一路维护到现在，形态变了不少，但还是希望它能陪大家多留一点文字下来。

如果你也像当年的我一样，手头没多少预算，不妨现在就新建一个 Markdown 文件，随便写下第一句吧。不必在意流量，也不必一开始就写得多好，哪怕全网只有你一个读者，这个网址依然是只属于你的小房间。

<ValaxyGuideFirstPost />

<ValaxyGuideBlessing>永远相信美好的事情即将发生</ValaxyGuideBlessing>

---

<ValaxyGuideFeedback />
