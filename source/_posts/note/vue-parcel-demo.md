---
title: Parcel.js + Vue 搭建笔记
date: 2018-02-20 21:13:42
updated: 2020-02-26 04:05:00
tags:
  - Vue
  - Parcel
  - 笔记
  - 学习
categories:
  - 云游的小笔记
---

去年（已经是三年前了！）年末便听得新一代打包工具 Parcel.js 的风风火火，今日（两年前的某一天）也终于得以静下心来试一试。

<!-- more -->

![five-year](https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/meme/five-year.gif)

## [Parcel](https://parceljs.org)

如官网所述，极速零配置 Web 应用打包工具。

- GitHub : <https://github.com/parcel-bundler/parcel>

## [Vue](https://cn.vuejs.org)

鼎鼎大名,自不多言。

---

Vue 官方提供的模板 [vuejs-template/webpack](https://github.com/vuejs-templates/webpack) 是基于 Webpack 打包的。所以尝试着用 parcel.js 来替代 webpack 与 vue 结合在一起。

### 自己的小 Demo

- [vue-parcel-demo](<https://github.com/YunYouJun/vue-parcel-demo)
- [我很可爱，请给我钱！](https://github.com/YunYouJun/give-me-money): Vue + Parcel 实现的小应用

## 过程

### 初始化

基本可以参照 [vuejs-template/webpack](https://github.com/vuejs-templates/webpack) 进行修改。

`vue init webpack vue-parcel-demo` 使用 vue 脚手架生成 webpack 模板

```sh
? Project name vue-parcel-demo
? Project description A Vue.js project
? Author YunYouJun <me@yunyoujun.cn>
? Vue build runtime | Runtime-only
? Install vue-router? Yes
? Use ESLint to lint your code? No
? Set up unit tests No
? Setup e2e tests with Nightwatch? No
? Should we run `npm install` for you after the project has been created? (recommended) yarn
```

- 删除 `build`, `config`, `static`, `node_modules`（之后重装） 文件夹与 `.editorconfig`, `.postcssrc.js`, `package.json`（之后重新生成） 文件。

- `README.md`（可以重写）

- 进入文件夹下，执行 `yarn init` （配置默认即可）

### 安装依赖

```sh
yarn add parcel-bundler vue vue-router --dev
```

[parcel-plugin-vue](https://github.com/BoltDoggy/parcel-plugin-vue)

> parcel-bundler/parcel @1.7.0 support Vue Now. This plugin will be not recommended.

Parcel 1.7.0 版本似乎已经支持 Vue 了。所以不需要再安装 `parcel-plugin-vue` 插件了。（~~默默删去了一段~~）

(果然配置越来越少 2333，再之后这篇文章说不定都没有存在的必要了。)

---

虽说零配置，实际上是 Parcel 帮我们把要配置的东西做了。

在打包 Vue 的时候，发现它调用 yarn 安装了几个插件。当然我们也可以自己先安装上。

```sh
yarn add -D vue-template-compiler @vue/component-compiler-utils vue-hot-reload-api
# -D 与 --dev 一个意思，将依赖安装在 devDependencies
```

### Babel 配置

[Babel · The compiler for next generation JavaScript](https://babeljs.io/)

Parcel 已经[默认支持 Babel 转换](https://parceljs.org/javascript.html#%E9%BB%98%E8%AE%A4-babel-%E8%BD%AC%E6%8D%A2)

### index.html

```html
<html lang="zh-cmn-Hans"></html>
```

[网页头部的声明应该是用 lang="zh" 还是 lang="zh-cn"？ - 知乎](https://www.zhihu.com/question/20797118)

emmm, 纠结地搜到了这个答案。简体中文页面原来是用 `lang="zh-cmn-Hans"`

#### 引入 `main.js`

```html
...
<body>
  <div id="app"></div>
  <script src="./src/main.js"></script>
</body>
...
```

### `package.json` 添加 `scripts` 字段

```json
{
  "name": "vue-parcel-demo",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/YunYouJun/vue-parcel-demo",
  "author": "YunYouJun <me@yunyoujun.cn>",
  "license": "MIT",
  "scripts": {
    "start": "npm run dev",
    "dev": "parcel index.html -p 2333 --open",
    "build": "parcel build index.html --public-url ./ --no-cache"
  },
  "devDependencies": {
    "@vue/component-compiler-utils": "^3.1.1",
    "autoprefixer": "^9.7.4",
    "parcel-bundler": "^1.12.4",
    "postcss-modules": "^1.5.0",
    "vue": "^2.5.16",
    "vue-hot-reload-api": "^2.3.0",
    "vue-router": "^3.0.1",
    "vue-template-compiler": "^2.5.16"
  },
  "dependencies": {}
}
```

- `-p 2333` 设置端口号为 `2333`
- `--open` 自动打开浏览器
- `--public-url ./` 设置要提供服务的公共 URL(`./` 也就是设置为当前 `dist` 目录下)
- `--no-cache` 禁用文件系统缓存

### .gitignore

使用 git 管理仓库时，切记添加自定义忽略文件

- `.cache` 是 `parcel` 构建时的缓存
- `dist` 是打包后的文件

```sh
# Custom
.cache
dist

# ...

node_modules/

# ...
```

如果使用 VS Code 编辑器，也可以对工作区进行配置，不对 `.cache` `dist` 等文件夹进行搜索。

[搜索排除](https://yunyoujun.cn/note/vscode-config-note/#%E6%90%9C%E7%B4%A2%E6%8E%92%E9%99%A4)

### [使用 SCSS](https://zh.parceljs.org/scss.html)

### Command

- `npm run dev` 运行
- `npm run build` 构建

输入 `npm run dev` 运行试试。

出现如下报错：

> Server running at http://localhost:1234
> × C:\Users\YunYou\Documents\GitHub\vue-parcel-demo\src\router\index.js:3:23: Cannot resolve dependency '@/components/HelloWorld'

原因是 `@` 是 webpack 默认配置中使用 alias (别名) 指代 src 文件夹的符号。

```json
// 位于 build/webpack.base.conf

resolve: {
  // 路径别名
  alias: {
    '@': resolve('src'),
    'vue$': 'vue/dist/vue.esm.js' // 这一个之后解释
  }
},
```

进入 `src/router/index.js` , 将路径修改为相对路径

```js
import HelloWorld from '@/components/HelloWorld'
---
import HelloWorld from '../components/HelloWorld'
```

再次运行 `npm run dev`, 打开 <http://localhost:1234> 即可看到 Vue 的主页了。

## FAQ

### [运行时 + 编译器 vs. 只包含运行时](https://cn.vuejs.org/v2/guide/installation.html#%E8%BF%90%E8%A1%8C%E6%97%B6-%E7%BC%96%E8%AF%91%E5%99%A8-vs-%E5%8F%AA%E5%8C%85%E5%90%AB%E8%BF%90%E8%A1%8C%E6%97%B6)

在使用 vue 脚手架 `vue init webpack vue-parcel-demo` 生成 vue-webpack 模板过程中，有如下提示：

```sh
? Vue build (Use arrow keys)
> Runtime + Compiler: recommended for most users
  Runtime-only: about 6KB lighter min+gzip, but templates (or any Vue-specific HTML) are ONLY allowed in .vue files - render functions are required elsewhere
```

如果选择 `Runtime + Compiler` ,此后会发生如下报错。

> [Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.(found in )

因为 [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack) 的 `main.js` 源码如下

[vuejs-templates/webpack/template/src/main.js](https://github.com/vuejs-templates/webpack/blob/develop/template/src/main.js)

```js
new Vue({
  el: '#app',
  {{#router}}
  router,
  {{/router}}
  {{#if_eq build "runtime"}}
  render: h => h(App)
  {{/if_eq}}
  {{#if_eq build "standalone"}}
  components: { App },
  template: '<App/>'
  {{/if_eq}}
})
```

如果选择 `Runtime + Compiler`, `main.js` 为

```js
...
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```

如果选择 `Runtime-only`, `main.js` 则为

```js
...
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
```

Vue 模板中 webpack 的默认配置通过 alias 设置了 vue 的别名，引用了完整版的 vue 。

```json
// 位于 build/webpack.base.conf

resolve: {
  // 路径别名
  alias: {
    '@': resolve('src'),
    'vue$': 'vue/dist/vue.esm.js' // 即此处
  }
},
```

最终打好的包里实际上是不需要编译器的，所以只用运行时版本即可。

Parcel 使用 `runtime-only`, 修改 `main.js` 中内容为 `Runtime-only` 形式 `render: h => h(App)` 即可。

## 后记

= =，意外的访问量很高。

时至今日，许多当初的配置已经不再需要，会逐步去除。
