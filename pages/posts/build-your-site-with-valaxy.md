---
title: 用 Valaxy 从零搭建一个属于自己的网站
date: 2026-11-10
updated: 2026-11-10
description: 2026 年新版的个人网站搭建教程：用 Valaxy（Vite + Vue 3）从零创建博客，涵盖环境准备、一条命令建站、类型提示配置、Markdown 写作、GitHub Pages / Netlify / Vercel / Cloudflare Pages 部署、AI 协作（AGENTS.md、llms.txt、MCP），以及从 Hexo 迁移的对照。
categories:
  - 云游的小安利
tags:
  - 教程
  - Valaxy
  - 分享
---

> 写给想要拥有一个自己的网站但没有资金成本的小白与曾经的自己。
>
> 这是 2020 年那篇《[教你如何从零开始搭建一个属于自己的网站](/posts/how-to-build-your-site)》的新版。

## 前言

虽说是网站，对于个人来说，或许一般叫作博客。但我不希望它仅仅是一个博客，而是能够成为一个处于自己现实生活之外、自由、实验、不用畏惧他人眼光甚至可以独断专行的地方。

这一点，六年过去了，依然没有变。

变的是工具。

2020 年写旧文时，我用的是 Hexo、`hexo-theme-yun`、GitHub Pages 和 Travis CI。后来我自己动手做了 [Valaxy](https://valaxy.site/zh/guide/why)，现在我的博客就跑在它上面。所以这篇文章换了一条主线：**用 Valaxy 从零搭一个站**。

为什么是 Valaxy？简单讲，它面向的是**想要更现代的开发体验**的人：

- **Vite + Vue 3**：开发服务器启动很快，页面和主题都是 Vue 写的，Vue 与 Vite 生态的插件可以直接用。
- **热更新**：改文章、改配置、改标签分类，保存后浏览器立刻变化，而且是局部更新，不用整页刷新。
- **带类型提示的配置**：`site.config.ts` 和 `valaxy.config.ts` 是 TypeScript，编辑器里鼠标悬浮就能看到每个选项的说明。
- **AI 友好**：新项目自带给编程助手看的 `AGENTS.md`，可以生成 `llms.txt`，还可以让 Cursor 之类的工具通过 MCP 帮你检查文章（后面会讲）。

> Hexo 依然是一个很棒的博客框架，我的博客就是在它上面长大的。如果你现在正在用某个很喜欢的 Hexo 主题或插件，继续用它完全没问题。Valaxy 只是给那些想换一套更现代工作流的人，多一个选项。

这依然是一篇新手向教程，也许会有点科普的感觉。我会尽量保持「点到为止」：讲清楚每一步在干嘛，但不会教你怎么注册账号、安装时怎么点下一步。希望看完之后，没有基础的小白也能搭出一个属于自己的站点。（前提是认识基础的英语单词和善用搜索引擎，现在还可以善用 AI。）

已经有基础的同学可以大胆跳读。

> 注释处多为相关补充说明，对正常流程没有影响，若没有兴趣，可以略过。

文中的命令和文件内容，我都是用 Valaxy v1.2.2 实际跑过一遍写下来的。如果你看到时版本已经更新，以 [Valaxy 官方文档](https://valaxy.site/zh/guide/getting-started)为准。

<!-- more -->

### 关键词

- Valaxy
- 静态博客
- Vite / Vue 3
- 无服务器
- GitHub Pages
- AI 协作（`llms.txt` / MCP）

## 步骤

### 准备环境

你需要三样东西：Node.js、pnpm、Git。再加一个顺手的编辑器：VS Code。

#### Node.js

> 什么是 Node.js？它是一个能让 JavaScript 脱离浏览器运行的环境。JavaScript 原本只能待在浏览器这个「水缸」里，Node.js 相当于把水缸也搬到了你的电脑上。你不用懂更多，只需要知道：**Valaxy 的开发和构建都跑在 Node.js 上**。

前往 [Node.js 官网](https://nodejs.org/)下载 **LTS（长期支持版）**。Valaxy 要求 Node.js `>=22.12.0`，所以请确认版本不要太旧。

> 为什么推荐 LTS 而不是最新版？因为最新版偶尔会遇到一些奇妙的 bug，LTS 更稳。

打开终端（Windows 打开 PowerShell 或命令提示符，macOS 打开「终端」），输入：

```bash
node --version
```

如果显示的版本号不低于 `v22.12.0`，就没问题了。

> 后文说「输入命令」，都是指在终端里输入。

#### pnpm

> pnpm 是一个包管理工具，你可以理解成「软件商店的命令行版」，作用和 Node.js 自带的 `npm` 差不多，但装依赖更快更省空间。Valaxy 的脚手架推荐用 pnpm，要求 `>=10.26.0`。

安装方式见 [pnpm 官网](https://pnpm.io/installation)，其中一种是用 npm 装：

```bash
npm install -g pnpm
pnpm --version
```

> 国内下载依赖慢的话，可以切换到 npmmirror 镜像。旧文里的 `registry.npm.taobao.org` 早就不能用了，请使用新域名：
>
> ```bash
> pnpm config set registry https://registry.npmmirror.com
> ```

#### Git 和 VS Code

> Git 是一个版本管理工具。比如设计师做好了第三版海报，客户却说还是要第一版，这时就可以用 Git 一键回到最初的版本。它还是后面把网站推送到 GitHub 的桥梁。

- 安装 [Git](https://git-scm.com/)。
- 安装 [VS Code](https://code.visualstudio.com/)。

> VS Code 是 Visual Studio Code 的简称，一个轻量又强大的编辑器（宇宙第一编辑器，这里不接受反驳）。注意它不是 Visual Studio（VS），那是一个体积大一个量级的 IDE。

> Valaxy 的脚手架会在 `.vscode/extensions.json` 里推荐一些插件，用 VS Code 打开项目时，它会提示你安装，装上就能在编辑器里直接预览图标、国际化文字等。还有一个 [Valaxy 扩展](https://marketplace.visualstudio.com/items?itemName=YunYouJun.valaxy)，可以在编辑器里查看文章列表和本地预览。

### 一条命令建站

旧文里，这一步要装 `hexo-cli`、`hexo init`、`npm install`、再装主题、再装渲染器……现在只要一条命令。

先进入你打算放网站代码的文件夹，然后输入：

```bash
pnpm create valaxy@latest
```

> `create` 是 pnpm 的一个小技巧：`pnpm create xxx` 会去下载并运行名为 `create-xxx` 的脚手架包。「脚手架」就是帮你生成项目模板的工具。

接下来会出现几个问题，依次选择就好：

```text
  🌌 Valaxy  v1.2.2

? Select a type: › - Use arrow-keys. Return to submit.
❯   Blog - For Most Users
    Theme - For Theme Developers
    Addon - For Addon Developers

? Select a theme:
❯   Yun - A light & clean theme (default)
    Press - A document-oriented theme
    Custom - Enter a custom theme name

? Project name: › valaxy-blog
```

1. `Select a type`：选 **Blog**（我们是来搭博客的）。
2. `Select a theme`：选 **Yun**（默认的博客主题，也是我自己在用的）。`Press` 是偏文档风格的主题，`Custom` 可以输入自定义主题名。
3. `Project name`：项目文件夹名，比如 `valaxy-blog`。如果你准备部署到 GitHub Pages 的根路径，可以直接用 `你的用户名.github.io`（后面会讲）。
4. `Install and start it now?`：我建议先选 **No**，我们手动来，这样你知道每一步在干什么。

脚手架跑完之后，会提示你接下来该做什么：

```bash
cd valaxy-blog
pnpm install
pnpm run dev
```

- `pnpm install` 会安装 `package.json` 里提到的所有依赖。
- `pnpm run dev` 会启动本地开发服务器（写成 `pnpm dev` 也可以，效果一样）。

> 脚手架生成的 `pnpm-workspace.yaml` 里记录了依赖安装的构建权限，请保留它，不要删。

启动成功后，终端会显示类似这样的内容：

```text
  🌌 Valaxy  v1.2.2

  🪐 theme   > yun (v1.2.2)
  📁 /path/to/valaxy-blog

  Preview    > http://localhost:4859/
  Network    > http://你的局域网 IP:4859/

  shortcuts  > restart | open | qr | edit
```

打开 `Preview` 后面的地址（默认是 `http://localhost:4859/`，端口被占用时会自动换一个，以终端为准），你就能看到你的第一个 Valaxy 站点了。刚打开时，首页会先出现一行竖排的大字（脚手架默认是「我的小站」），动画结束后往下翻，就能看到一篇示例文章《Hello, Valaxy!》。

![Valaxy 脚手架首页，可见示例文章《Hello, Valaxy!》](/images/valaxy-home.png)

这是本地预览往下翻之后的样子。

按 `Ctrl + C` 可以停止服务器。

#### 热更新体验一下

保持 `pnpm dev` 运行，用 VS Code 打开项目，找到 `valaxy.config.ts`。脚手架里首页大字默认就是「我的小站」，你可以改成自己喜欢的文字：

<!-- eslint-skip -->
```ts
themeConfig: {
  banner: {
    enable: true,
    title: '你好，世界', // 改成你喜欢的文字
  },
},
```

保存，然后看浏览器。

没错，你不需要手动刷新。这就是 Vite 带来的热更新，不光是配置，文章内容、标签、分类的修改也都是即时生效的。比如把 `pages/posts/hello-valaxy.md` 开头的 `title` 改成「你好，Valaxy！」，文章页上的标题会立刻变过去：

![把示例文章标题改成「你好，Valaxy！」后，页面立即更新](/images/valaxy-hmr.gif)

保存后标题从「Hello, Valaxy!」变成了「你好，Valaxy！」，不用手动刷新。封面图上的那行字是组件里写死的，所以还是原来的文案，这也正常。

> 这是我做 Valaxy 的最初动机之一。Hexo 每次改完要重新生成、刷新页面，而现代前端框架早就能做到「保存即所见」了。

### 看看生成了什么

用 `ls` 或者在 VS Code 里看一下目录，主要的内容是这些：

```text
valaxy-blog
├── .github/workflows/gh-pages.yml   # GitHub Actions 自动部署
├── .vscode/                         # 推荐的 VS Code 插件
├── AGENTS.md                        # 给 AI 编程助手看的说明
├── components/                      # 自定义组件（会被自动注册）
├── layouts/                         # 自定义布局
├── locales/                         # 自定义国际化文字
├── pages/                           # 所有页面和文章
│   └── posts/hello-valaxy.md        # 示例文章
├── public/                          # 静态资源（原样复制）
├── styles/                          # 覆盖主题样式
├── netlify.toml                     # Netlify 配置
├── vercel.json                      # Vercel 配置
├── site.config.ts                   # 站点信息
├── valaxy.config.ts                 # 主题与框架配置
└── package.json
```

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
date: 2026-11-10
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

> 文章标题下面如果想控制首页展示的摘要，可以在正文里加一行 `<!-- more -->`，它前面的内容会作为摘要。注意 `more` 前后要有空格。

#### 标签与分类

和旧文一样，标签（`tags`）和分类（`categories`）直接写在 frontmatter 里。比如本文头部是这样的：

```md
---
title: 用 Valaxy 从零搭建一个属于自己的网站
date: 2026-11-10
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

#### 在 Markdown 里写 Vue 组件

这是 Valaxy 和很多博客框架的一个不同点：**`components/` 文件夹下的 Vue 组件会被自动注册，可以直接在 Markdown 里使用**。

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

> 脚手架自带的示例文章《Hello, Valaxy!》就用了同样的方法：在文章里放了一个可交互的 Vue 星座封面。想看更多可以翻文档：[在 Markdown 中使用 Vue](https://valaxy.site/zh/guide/markdown#using-vue-in-markdown)。

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

> 这一步以前叫「备份」，现在它同时也是**部署的触发器**：推送一次，GitHub 就会帮你构建并发布。

##### 开启自动部署

> 下面这份工作流适用于 `create-valaxy` 1.2.3 及之后生成的项目。之前生成的项目可以直接把下面这份工作流复制过去，覆盖原来的 `.github/workflows/gh-pages.yml`。

脚手架已经帮你生成了 `.github/workflows/gh-pages.yml`，也就是 GitHub Actions 的工作流。它不再往 `gh-pages` 分支推静态文件，而是用 GitHub 官方的 Pages Actions，把构建好的 `dist/` 直接发布出去。大致是这样：

1. 把代码推送到 `main` / `master` / `valaxy` 分支时触发（也可以在 Actions 页面手动跑一次）；
2. 检出完整的提交历史，用 pnpm 安装依赖，再执行 `pnpm run build`；
3. 把 `dist/` 上传为 Pages 产物，部署到 GitHub Pages。

工作流里的 `fetch-depth: 0` 是故意的：Valaxy 可以用 Git 提交时间当作文章日期，浅克隆拿不到完整历史，日期会不准，所以需要把历史都拉下来。

完整内容是这样的（来自即将随 `create-valaxy` 1.2.3 发布的脚手架）：

```yaml
name: GitHub Pages

on:
  push:
    branches:
      # The branch where the project source code resides
      # 项目源代码所在的分支
      - main
      - master
      - valaxy
  workflow_dispatch:

# Publish the built site with GitHub Pages. The workflow token can read
# the repository and upload the artifact.
permissions:
  contents: read
  pages: write
  id-token: write

# One deployment at a time. Let an in-progress production deploy finish.
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          # Git dates for posts need the full history.
          # 文章的 Git 日期需要完整提交历史。
          fetch-depth: 0

      - uses: pnpm/action-setup@v6
        with:
          # Template requires pnpm >=10.26 (allowBuilds). No packageManager pin.
          version: '>=10.26.0'

      - name: Use Node.js from package.json engines
        uses: actions/setup-node@v7
        with:
          node-version-file: package.json

      - name: Setup Pages
        uses: actions/configure-pages@v6

      - name: Install dependencies
        # The scaffold ships package.json without a lockfile.
        run: pnpm install

      - name: Build
        run: pnpm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

> 什么是持续集成（CI）？可以理解为「你把代码推上去，机器人自动帮你构建、测试、发布」。旧文里我用的是 Travis CI，现在 GitHub Actions 已经足够好用，而且不用额外注册、不用额外设置 Token。权限已经写在工作流里了（`contents: read`、`pages: write`、`id-token: write`），一般不必再去改仓库的 Actions 权限。

接着打开仓库的 `Settings` -> `Pages`，在 Build and deployment 的 Source 里选择 **GitHub Actions**。注意不是选 `gh-pages` 分支——这条新工作流不会再生成那个分支。

> 如果你的源码分支不叫 `main`、`master` 或 `valaxy`，要修改 `gh-pages.yml` 里的 `on.push.branches`。选好发布源之后，如果第一次没有把站点发出来，到 Actions 页面把这次工作流再跑一遍就行。

稍等一两分钟，打开 `https://你的用户名.github.io`，就能看到线上的网站了。

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

不想用 GitHub Pages？这几个平台也都可以免费托管静态站点，并且都是「连接仓库就能自动部署」。

- **Netlify**：脚手架已经内置了 `netlify.toml`（构建命令 `pnpm run build`，发布目录 `dist`）。在 Netlify 里连接你的 GitHub 仓库即可自动部署。
- **Vercel**：脚手架内置了 `vercel.json`（开启了 `cleanUrls`）。在 Vercel 里 `Add New...` -> `Project`，选择仓库并 `Import`，将 `Framework Preset` 设置为 `Other`，`Output Directory` 设置为 `dist`，然后点 `Deploy`。
- **Cloudflare Pages**：在 Cloudflare 控制台进入「Workers 和 Pages」，创建项目并连接 Git 仓库，选择部署分支，将构建命令设为 `pnpm build`，构建输出目录设为 `dist`，保存并部署。

> 它们的共同点就是：构建命令 `pnpm build`，输出目录 `dist`。记住这两个，换到别的平台（比如 Render，甚至自己的服务器）也一样。

更多细节（包括 Nginx、Docker）见 [部署 | Valaxy](https://valaxy.site/zh/guide/deploy)。

### AI 时代的新玩法

旧文写的时候，ChatGPT 还没有出现。现在写博客、改站点，很多人都会让 AI 帮一把。Valaxy 在这方面做了一些准备，下面说的都是目前文档里实际存在的功能，详见 [与 AI 协作](https://valaxy.site/zh/guide/work-with-ai)。

#### AGENTS.md：给 AI 看的说明书

还记得目录里那个 `AGENTS.md` 吗？它是给在你的站点里干活的编程助手（比如 Cursor、Claude Code 等）看的：里面写了常用命令、该改哪些文件、`llms.txt` 怎么回事等等。你让 AI 帮你改站点时，它能读到这些，就不容易乱改框架本身的东西。

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

为了看看实际效果，我临时写了一篇《写给周末的一点随记》，正文里链到了一篇还不存在的 `/posts/getting-started`。按照上面的地址连上 MCP 之后（Cursor、Claude 连的也是同一个地址），调用 `valaxy_check_page`，检查的文件是 `pages/posts/weekend-notes.md`，返回是这样的（有删节）：

```json
{
  "ok": true,
  "diagnostics": [
    {
      "code": "missing-link",
      "severity": "warning",
      "message": "Local link target not found: /posts/getting-started",
      "hint": "Check the resolved route, source-relative file path or public asset path. Custom runtime routes and asset resolvers are not checked.",
      "line": 10
    }
  ],
  "totalDiagnostics": 1
}
```

它准确地指出了第 10 行那个坏掉的内部链接，并给了修复提示。`ok` 仍是 `true`，因为这是 warning 而不是 error——文章本身能正常生成。同一篇文章用命令行 `pnpm exec valaxy check --file pages/posts/weekend-notes.md` 检查，结果一致：`passed (1 diagnostics)`，并打出同一条 `missing-link` 警告。

几点需要知道的：

- MCP 只在 `pnpm dev` 时运行，生产构建不包含它。
- 它只接受本机连接，并且只读，不能创建文章、改文件或执行命令。
- 默认不会暴露草稿、隐藏页面和加密页面。

> 不想开 MCP 也行，同样的检查可以直接用命令行：
>
> ```bash
> pnpm exec valaxy check --file pages/posts/hello-valaxy.md
> ```
>
> 我本地跑了一下，示例文章的结果是 `passed (0 diagnostics)`。

### 从 Hexo 迁过来

如果你和当年的我一样，博客在 Hexo 上，想换一套更现代的开发体验，可以参考下面的对应关系。

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

> 文章的 Markdown 和 frontmatter 大多可以直接复制过去；但 Hexo 的主题不能在 Valaxy 上直接运行，需要换成 Valaxy 的主题（比如 Yun）。另外 Markdown 解析基于 `markdown-it`，如果遇到换行之类的细节差别，可以看迁移文档里的常见问题。

- 完整的迁移步骤：[从其他博客框架迁移](https://valaxy.site/zh/migration/)（页面里还有一个「AI 迁移助手」，选好原框架，复制提示词给 AI 就行）。
- 想对比 Valaxy、Hexo 和 VitePress 各自适合什么场景：[VitePress 能做博客吗？](https://valaxy.site/zh/guide/vitepress)、[静态博客框架怎么选](https://valaxy.site/zh/guide/choose)。
- 我自己博客的迁移就是一个真实案例，可以对比 [yunyoujun.github.io](https://github.com/YunYouJun/yunyoujun.github.io) 仓库的 `hexo` 分支和 `valaxy` 分支。

> 如果某个 Hexo 主题或插件对你来说就是不可替换的，留在 Hexo 也是很好的选择。工具是为人服务的。

## FAQ

### 如何绑定你的自定义域名？

首先，你得有个自己的域名。

> 避免广告嫌疑，你可以自行前往相关域名提供商购买。

对于 GitHub Pages：

1. 在域名服务商处，使用 `CNAME` 解析到 `你的用户名.github.io`。（当然 `A` 记录直接解析到 GitHub Pages 的 IP 地址也可以，具体见 [官方文档](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。）
2. 打开仓库的 `Settings` -> `Pages`，在 **Custom domain** 里填上你的域名（比如 `blog.example.com`），点 Save。
3. 把 `site.config.ts` 里的 `url` 改成你的域名。

> 以前走 `gh-pages` 分支发布时，需要在 `public/` 下放一个 `CNAME` 文件，不然下次部署会把设置里自动加进去的那个文件盖掉。现在这份工作流改成用 GitHub Actions 发布了，按 [GitHub 的说明](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)，这种发布方式下不会再生成 `CNAME` 文件，仓库里即使放了也会被忽略，自定义域名只要在 Pages 设置里填写就行。

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

如果想用国内的云服务器，或者国内 CDN，不备案确实寸步难行。不过先要分清两件事：你的网站到底是不是托管在中国内地。

如果你只是把站点放在 GitHub Pages、Netlify、Vercel 或 Cloudflare Pages 上，服务器在境外，一般**不需要**做工信部的 ICP 备案，绑定自己的域名也是如此。想用中国内地的云服务器，或把域名解析到国内 CDN（比如阿里云、腾讯云的内地节点）时，才需要先完成 ICP 备案，否则国内接入商不会让未备案的域名上线。

依据是《[非经营性互联网信息服务备案管理办法](https://www.miit.gov.cn/gyhxxhb/jgsj/cyzcyfgs/bmgz/xxtxl/art/2024/art_84a0cfa0ebd049bbbe751dca9a008e56.html)》：在中国境内提供非经营性互联网信息服务，应当履行备案手续。查询和办理入口是工信部的 [ICP/IP地址/域名信息备案管理系统](https://beian.miit.gov.cn/)。

要通过阿里云或腾讯云备案，需要先有符合条件的中国内地云资源，再由这家接入商代为提交。备案本身不收费，但云资源是要花钱的。2026 年两边的门槛大致是：

- [腾讯云](https://cloud.tencent.com/document/product/243/18908)（文档更新于 2026 年 10 月 16 日）：中国境内、包年包月、购买时长不少于 3 个月（含续费），备案期间剩余有效期不少于 1 个月，并且要有公网 IP。
- [阿里云](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/overview)：中国内地节点、包年包月，购买时长大于 3 个月（含续费累计），并购买公网带宽。免费试用的 ECS 不能用来备案。

旧文里写过「用学生优惠买一个月服务器，关联一下就行」——现在已经不行了，最短基本是三个月起。

个人备案通常只能做个人博客、个人空间这类个人性质的网站（[腾讯云的说明](https://cloud.tencent.com/document/product/243/19628)）。域名得先完成实名认证，后缀也得是工信部批复过的，一些少见后缀在国内备案不了。具体要交哪些材料、网站名称和内容怎么写，各省管局并不完全一样，请以接入商和当地管局的最新规则为准。我不是政策专家，上面这些都来自 2026 年仍在公开的官方和云厂商说明，执行时请再核对一遍原文。

备案成功后，页脚必须清晰地展示备案号，并链接到工信部备案管理系统（现在的地址是 `https://beian.miit.gov.cn/`）。Valaxy 的 Yun 主题已经预留了备案配置，脚手架的 `valaxy.config.ts` 里就有，默认关闭：

<!-- eslint-skip -->
```ts
footer: {
  beian: {
    enable: false, // 备案成功后改成 true
    icp: '', // 填写你的备案号
  },
},
```

另外还有一套独立的 **公安备案**（也叫联网备案），不是同一回事，要在 [全国互联网安全管理服务平台](https://beian.mps.gov.cn/) 办理。阿里云的文档写过：ICP 备案通过、网站开通后 30 天内应完成公安备案；即便服务器在境外、不需要 ICP 备案，若网站要对中国内地提供服务，他们也建议做公安联网备案（见 [阿里云 ICP 备案流程概述](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/icp-filing-application-overview)）。各地执行尺度不同，请以当地公安机关和平台说明为准。

### 视频？

依然没有视频，一是懒，二是文字更利于更新勘误。

### 其他平台

毕竟自己的站点可能还是不会有什么人看，所以发到其他平台了（然而还是没有人）。不过在这里阅读体验应该是最好的。

## 结语

六年前我写下这篇教程的时候，想的是：个人网站可以用来记录生活、回忆、创作、学习笔记、开发经验，包括作为一个试验平台。可以与熟悉的人分享，也可以作为另一个世界另一个自己的展示。

六年后，工具换了一茬又一茬，这个想法一点没变。

多年后回看自己当初写下的内容，未尝不是件有趣的事情。

善始者众，善终者寡。

> 臣闻善作者，不必善成；善始者，不必善终。「史记·乐毅列传」

希望大家能有毅力坚持下去，不忘初心。

> 永远相信美好的事情即将发生

文章相关的讨论，可以直接在文末评论区留言。如果是 Valaxy 本身的问题或建议，欢迎到 [Valaxy Discussions](https://github.com/YunYouJun/valaxy/discussions) 或 [Issues](https://github.com/YunYouJun/valaxy/issues) 反馈。
